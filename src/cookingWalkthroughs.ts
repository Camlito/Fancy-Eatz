export type WalkthroughVideo = { src: string; poster: string; captions: string; duration: number; steps: { label: string; start: number; end: number; caption: string }[] };

export const cookingWalkthroughs: Record<string, { classic: WalkthroughVideo; signature: WalkthroughVideo }> = {
  "Weeknight Garlic Butter Chicken": {
    "classic": {
      "src": "/videos/cooking/garlic-butter-chicken-classic.mp4",
      "captions": "/videos/cooking/garlic-butter-chicken-classic.vtt",
      "duration": 58.499,
      "steps": [
        {
          "label": "Prep your kitchen",
          "start": 0.0,
          "end": 10.145,
          "caption": "Heat the oven to 425\u00b0F. Halve the baby potatoes, wash the broccoli, and keep raw chicken on a separate tray."
        },
        {
          "label": "Season and coat",
          "start": 10.145,
          "end": 19.085,
          "caption": "Season chicken and potatoes with paprika, salt and pepper. Melt the butter with garlic, then coat the chicken and potatoes."
        },
        {
          "label": "Start roasting",
          "start": 19.085,
          "end": 29.235,
          "caption": "Place chicken and potatoes on a sheet pan. Roast at 425\u00b0F for 15 minutes before adding the broccoli."
        },
        {
          "label": "Add the broccoli",
          "start": 29.235,
          "end": 38.235,
          "caption": "Add broccoli to the pan. Roast 10\u201315 minutes more. Cooking time varies with chicken thickness and potato size."
        },
        {
          "label": "Check doneness",
          "start": 38.235,
          "end": 49.702,
          "caption": "Check the thickest part of the chicken with a food thermometer. It must reach 165\u00b0F. Continue cooking as needed until potatoes are tender."
        },
        {
          "label": "Rest and serve",
          "start": 49.702,
          "end": 58.457,
          "caption": "Rest the chicken for 5 minutes. Serve with roasted potatoes and broccoli, spooning the pan juices over each plate."
        }
      ],
      "poster": "/videos/cooking/garlic-butter-chicken-classic.jpg"
    },
    "signature": {
      "src": "/videos/cooking/garlic-butter-chicken-signature.mp4",
      "captions": "/videos/cooking/garlic-butter-chicken-signature.vtt",
      "duration": 70.849,
      "steps": [
        {
          "label": "Prep your kitchen",
          "start": 0.0,
          "end": 10.145,
          "caption": "Heat the oven to 425\u00b0F. Halve the baby potatoes, wash the broccoli, and keep raw chicken on a separate tray."
        },
        {
          "label": "Season and coat",
          "start": 10.145,
          "end": 19.085,
          "caption": "Season chicken and potatoes with paprika, salt and pepper. Melt the butter with garlic, then coat the chicken and potatoes."
        },
        {
          "label": "Start roasting",
          "start": 19.085,
          "end": 29.235,
          "caption": "Place chicken and potatoes on a sheet pan. Roast at 425\u00b0F for 15 minutes before adding the broccoli."
        },
        {
          "label": "Add the broccoli",
          "start": 29.235,
          "end": 38.235,
          "caption": "Add broccoli to the pan. Roast 10\u201315 minutes more. Cooking time varies with chicken thickness and potato size."
        },
        {
          "label": "Check doneness",
          "start": 38.235,
          "end": 49.702,
          "caption": "Check the thickest part of the chicken with a food thermometer. It must reach 165\u00b0F. Continue cooking as needed until potatoes are tender."
        },
        {
          "label": "Rest and serve",
          "start": 49.702,
          "end": 58.457,
          "caption": "Rest the chicken for 5 minutes. Serve with roasted potatoes and broccoli, spooning the pan juices over each plate."
        },
        {
          "label": "Your Signature finish",
          "start": 58.457,
          "end": 70.807,
          "caption": "For four servings, mix 2 tablespoons extra-virgin olive oil, 1 tablespoon chopped parsley and 1 teaspoon lemon zest. Drizzle lightly over the plated dish."
        }
      ],
      "poster": "/videos/cooking/garlic-butter-chicken-signature.jpg"
    }
  },
  "Creamy Family Chicken Pasta": {
    "classic": {
      "src": "/videos/cooking/creamy-chicken-pasta-classic.mp4",
      "captions": "/videos/cooking/creamy-chicken-pasta-classic.vtt",
      "duration": 51.19,
      "steps": [
        {
          "label": "Cook the pasta",
          "start": 0.0,
          "end": 7.87,
          "caption": "Cook 12 ounces of pasta until al dente. Reserve half a cup of pasta water, then drain."
        },
        {
          "label": "Cook the chicken",
          "start": 7.87,
          "end": 19.337,
          "caption": "Season the diced chicken. Saut\u00e9 in olive oil until the center of the pieces reaches 165\u00b0F. Transfer to a clean plate."
        },
        {
          "label": "Build the sauce",
          "start": 19.337,
          "end": 27.27,
          "caption": "Lower the heat. Cook minced garlic for about 30 seconds, then add chicken broth and heavy cream."
        },
        {
          "label": "Add Parmesan",
          "start": 27.27,
          "end": 34.54,
          "caption": "Simmer the sauce gently. Stir in grated Parmesan until smooth; avoid a hard boil."
        },
        {
          "label": "Bring it together",
          "start": 34.54,
          "end": 42.615,
          "caption": "Return the cooked chicken, pasta and spinach to the pan. Toss until spinach wilts and everything is hot."
        },
        {
          "label": "Finish and serve",
          "start": 42.615,
          "end": 51.148,
          "caption": "Loosen the sauce with reserved pasta water as needed. Taste, adjust salt and pepper, and serve warm."
        }
      ],
      "poster": "/videos/cooking/creamy-chicken-pasta-classic.jpg"
    },
    "signature": {
      "src": "/videos/cooking/creamy-chicken-pasta-signature.mp4",
      "captions": "/videos/cooking/creamy-chicken-pasta-signature.vtt",
      "duration": 63.471,
      "steps": [
        {
          "label": "Cook the pasta",
          "start": 0.0,
          "end": 7.87,
          "caption": "Cook 12 ounces of pasta until al dente. Reserve half a cup of pasta water, then drain."
        },
        {
          "label": "Cook the chicken",
          "start": 7.87,
          "end": 19.337,
          "caption": "Season the diced chicken. Saut\u00e9 in olive oil until the center of the pieces reaches 165\u00b0F. Transfer to a clean plate."
        },
        {
          "label": "Build the sauce",
          "start": 19.337,
          "end": 27.27,
          "caption": "Lower the heat. Cook minced garlic for about 30 seconds, then add chicken broth and heavy cream."
        },
        {
          "label": "Add Parmesan",
          "start": 27.27,
          "end": 34.54,
          "caption": "Simmer the sauce gently. Stir in grated Parmesan until smooth; avoid a hard boil."
        },
        {
          "label": "Bring it together",
          "start": 34.54,
          "end": 42.615,
          "caption": "Return the cooked chicken, pasta and spinach to the pan. Toss until spinach wilts and everything is hot."
        },
        {
          "label": "Finish and serve",
          "start": 42.615,
          "end": 51.148,
          "caption": "Loosen the sauce with reserved pasta water as needed. Taste, adjust salt and pepper, and serve warm."
        },
        {
          "label": "Your Signature finish",
          "start": 51.148,
          "end": 63.428,
          "caption": "For four servings, mix 2 tablespoons extra-virgin olive oil, 1 tablespoon chopped parsley and 1 teaspoon lemon zest. Finish each bowl with a light drizzle."
        }
      ],
      "poster": "/videos/cooking/creamy-chicken-pasta-signature.jpg"
    }
  },
  "Pan-Seared Salmon with Lemon Cream": {
    "classic": {
      "src": "/videos/cooking/salmon-lemon-cream-classic.mp4",
      "captions": "/videos/cooking/salmon-lemon-cream-classic.vtt",
      "duration": 50.52,
      "steps": [
        {
          "label": "Prep the salmon",
          "start": 0.0,
          "end": 8.467,
          "caption": "Pat the salmon dry on a separate prep tray. Season with salt and pepper. Have the measured sauce ingredients ready."
        },
        {
          "label": "Sear and check",
          "start": 8.467,
          "end": 20.6,
          "caption": "Sear salmon in olive oil until golden, then turn carefully. Continue until the thickest part reaches 145\u00b0F. Transfer to a warm plate."
        },
        {
          "label": "Soften the shallot",
          "start": 20.6,
          "end": 27.933,
          "caption": "Lower the heat. Add butter and minced shallot to the skillet and cook until the shallot softens."
        },
        {
          "label": "Reduce the broth",
          "start": 27.933,
          "end": 35.733,
          "caption": "Add the broth and gently scrape up browned bits. Simmer until the liquid reduces by about half."
        },
        {
          "label": "Finish the sauce",
          "start": 35.733,
          "end": 42.478,
          "caption": "Stir in heavy cream and lemon juice. Simmer gently until the sauce lightly thickens."
        },
        {
          "label": "Plate and serve",
          "start": 42.478,
          "end": 50.478,
          "caption": "Spoon lemon cream sauce onto warm plates. Add the fully cooked salmon and finish with chopped parsley."
        }
      ],
      "poster": "/videos/cooking/salmon-lemon-cream-classic.jpg"
    },
    "signature": {
      "src": "/videos/cooking/salmon-lemon-cream-signature.mp4",
      "captions": "/videos/cooking/salmon-lemon-cream-signature.vtt",
      "duration": 63.401,
      "steps": [
        {
          "label": "Prep the salmon",
          "start": 0.0,
          "end": 8.467,
          "caption": "Pat the salmon dry on a separate prep tray. Season with salt and pepper. Have the measured sauce ingredients ready."
        },
        {
          "label": "Sear and check",
          "start": 8.467,
          "end": 20.6,
          "caption": "Sear salmon in olive oil until golden, then turn carefully. Continue until the thickest part reaches 145\u00b0F. Transfer to a warm plate."
        },
        {
          "label": "Soften the shallot",
          "start": 20.6,
          "end": 27.933,
          "caption": "Lower the heat. Add butter and minced shallot to the skillet and cook until the shallot softens."
        },
        {
          "label": "Reduce the broth",
          "start": 27.933,
          "end": 35.733,
          "caption": "Add the broth and gently scrape up browned bits. Simmer until the liquid reduces by about half."
        },
        {
          "label": "Finish the sauce",
          "start": 35.733,
          "end": 42.478,
          "caption": "Stir in heavy cream and lemon juice. Simmer gently until the sauce lightly thickens."
        },
        {
          "label": "Plate and serve",
          "start": 42.478,
          "end": 50.478,
          "caption": "Spoon lemon cream sauce onto warm plates. Add the fully cooked salmon and finish with chopped parsley."
        },
        {
          "label": "Your Signature finish",
          "start": 50.478,
          "end": 63.358,
          "caption": "For two servings, mix 1 tablespoon extra-virgin olive oil, half a tablespoon chopped parsley and half a teaspoon lemon zest. Drizzle sparingly around the plated salmon."
        }
      ],
      "poster": "/videos/cooking/salmon-lemon-cream-signature.jpg"
    }
  }
};
