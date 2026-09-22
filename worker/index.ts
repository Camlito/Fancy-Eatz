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
  const result = await env.AI.run("@cf/meta/llama-3.2-3b-instruct", { prompt, max_tokens: 1800, temperature: 0.7 });
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
  const result = await env.AI.run("@cf/meta/llama-3.2-3b-instruct", { prompt, max_tokens: 2600, temperature: 0.65 });
  return parseJson(extractText(result));
}

async function analyzeKitchenPhoto(env: Env, body: any) {
  if (!body?.image || typeof body.image !== "string") throw new Error("Image is required");
  const match = body.image.match(/^data:image\/[^;]+;base64,(.+)$/);
  if (!match) throw new Error("Unsupported image");
  const bytes = Uint8Array.from(atob(match[1]), c => c.charCodeAt(0));
  const result: any = await env.AI.run("@cf/llava-hf/llava-1.5-7b-hf", {
    image: [...bytes],
    prompt: "Identify only visible food ingredients in this refrigerator, pantry, countertop, or grocery photo. Do not guess hidden items or brands. Return a concise comma-separated list only."
  });
  const text = extractText(result);
  const items = text.split(/,|\n/).map(x => x.replace(/^[-*\d.\s]+/, "").trim()).filter(Boolean).slice(0, 40);
  return { items };
}

async function createExperience(env: Env, body: any) {
  const prompt = `You are the Fancy Eatz private dining concierge. Design one complete upscale home dining experience.
Return ONLY valid JSON:
{"title":"string","appetizer":"string","entree":"string","sides":["string"],"dessert":"string","pairing":"non-alcoholic drink pairing","timeline":["string"],"plating":"string","tableSetting":"string","groceries":["string"],"estimatedCost":"string"}
On hand: ${body.pantry}
Occasion: ${body.occasion}
Guests: ${body.guests}
Total budget target: ${body.budget}
Time available: ${body.minutes} minutes
Diet: ${body.diet}
Style: ${body.style}
Use on-hand ingredients first, respect dietary restrictions, keep the plan achievable at home, and treat all costs as rough estimates rather than live prices.`;
  const result = await env.AI.run("@cf/meta/llama-3.2-3b-instruct", { prompt, max_tokens: 2200, temperature: 0.7 });
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
    if (request.method === "POST" && url.pathname === "/api/analyze-kitchen-photo") {
      try { return json(await analyzeKitchenPhoto(env, await request.json())); }
      catch (error) { return json({ error: "Photo analysis failed", detail: String(error) }, 500); }
    }
    if (request.method === "POST" && url.pathname === "/api/generate-experience") {
      try { return json({ experience: await createExperience(env, await request.json()) }); }
      catch (error) { return json({ error: "Experience generation failed", detail: String(error) }, 500); }
    }
    if (request.method === "POST" && url.pathname === "/api/generate-plan") {
      try { return json({ plan: await createPlan(env, await request.json()) }); }
      catch (error) { return json({ error: "Weekly plan generation failed", detail: String(error) }, 500); }
    }
    return env.ASSETS.fetch(request);
  }
};