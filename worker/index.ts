type Env = {
  AI: { run: (model: string, input: Record<string, unknown>) => Promise<unknown> };
  ASSETS: { fetch: (request: Request) => Promise<Response> };
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });
}

function extractText(result: any): string {
  if (typeof result === "string") return result;
  if (typeof result?.response === "string") return result.response;
  if (typeof result?.result?.response === "string") return result.result.response;
  return JSON.stringify(result);
}

function parseJson(text: string) {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("AI did not return JSON");
  return JSON.parse(cleaned.slice(start, end + 1));
}

async function createMeal(env: Env, body: any) {
  const prompt = `You are the Fancy Eatz AI Kitchen Concierge. Create ONE upscale but practical home-cooked meal.
Return ONLY valid JSON with exactly these fields:
{"title":"string","description":"string","ingredients":["string"],"steps":["string"],"plating":"string","missing":["string"],"estimatedCost":"string"}
Pantry/on-hand ingredients: ${body.pantry || "common home pantry staples"}
Meal type: ${body.mealType || "Dinner"}
Occasion: ${body.occasion || "Elevated Weeknight"}
Servings: ${body.servings || "2"}
Time limit: ${body.time || "45 minutes"}
Style: ${body.style || "Chef's choice"}
Dietary preference: ${body.diet || "No restriction"}
Target grocery budget: ${body.budget || "$25"}
Use on-hand ingredients as much as possible. Respect dietary preference. Missing must contain only groceries genuinely needed. Give clear food-safe cooking steps and elegant achievable plating. estimatedCost is a rough grocery estimate, never live local pricing. Do not claim the recipe is copied verbatim from a cookbook.`;
  const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", { prompt, max_tokens: 1800, temperature: 0.7 });
  return parseJson(extractText(result));
}

async function createPlan(env: Env, body: any) {
  const prompt = `You are the Fancy Eatz AI Kitchen Concierge. Build a seven-day upscale but practical meal plan, exactly Monday through Sunday.
Return ONLY valid JSON:
{"title":"string","days":[{"day":"Monday","meal":"string","description":"string","estimatedCost":"string","groceries":["string"]}],"grocery":["string"],"estimatedTotal":"string"}
Pantry/on-hand ingredients: ${body.pantry || "common home pantry staples"}
Servings: ${body.servings || "2"}
Time per meal: ${body.time || "45 minutes"}
Style: ${body.style || "Chef's choice"}
Dietary preference: ${body.diet || "No restriction"}
Target budget per meal: ${body.budget || "$25"}
Reuse ingredients intelligently to reduce waste and spending. grocery must be one deduplicated combined shopping list, excluding pantry items when possible. All costs are rough estimates only.`;
  const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", { prompt, max_tokens: 2600, temperature: 0.65 });
  return parseJson(extractText(result));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/_healthcheck") return json({ ok: true, service: "fancy-eatz" });
    if (request.method === "POST" && url.pathname === "/api/generate-meal") {
      try { return json({ meal: await createMeal(env, await request.json()) }); }
      catch (error) { return json({ error: "Meal generation failed", detail: String(error) }, 500); }
    }
    if (request.method === "POST" && url.pathname === "/api/generate-plan") {
      try { return json({ plan: await createPlan(env, await request.json()) }); }
      catch (error) { return json({ error: "Weekly plan generation failed", detail: String(error) }, 500); }
    }
    return env.ASSETS.fetch(request);
  }
};