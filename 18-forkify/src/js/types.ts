export interface Ingredient {
  quantity: number | null;
  description: string;
  unit: string;
}

export interface Recipe {
  id?: string;
  key?: string;
  title: string;
  cooking_time: number;
  image_url: string;
  ingredients: Ingredient[];
  publisher: string;
  servings: number;
  source_url: string;
  bookmarked?: boolean;
}

export interface RecipeForm {
  [key: string]: FormDataEntryValue;
}

export interface RecipeResposne {
  data: {
    recipe: Recipe;
  };
  status: string; // fail | success
  message?: string;
}

export interface SearchRecipeResposne {
  data: {
    recipes: Recipe[];
  };
  status: string; // fail | success
  message?: string;
}
