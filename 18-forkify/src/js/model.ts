import { Recipe, RecipeForm, RecipeResposne, SearchRecipeResposne } from "./types";
import { API_KEY, API_URL, ITEMS_PER_PAGE } from "./config";
import { AJAX } from "./helpers";

export const state = {
  loading: false,
  recipe: null as unknown as Recipe,
  bookmarks: [] as Recipe[],
  search: {
    page: 1,
    itemsPerPage: ITEMS_PER_PAGE,
    query: "",
    results: [] as Recipe[],
  },
};

(window as any).state = state;

export type SearchResult = typeof state.search;

export const loadRecipe = async function (id: string) {
  const data: RecipeResposne = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
  state.recipe = data.data.recipe;
  if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
    state.recipe.bookmarked = true;
  } else {
    state.recipe.bookmarked = false;
  }
};

export const searchRecipes = async function (query: string) {
  const data: SearchRecipeResposne = await AJAX(
    `${API_URL}?search=${query}&key=${API_KEY}`
  );
  state.search.query = query;
  state.search.results = data.data.recipes;
  console.log("data ", data);
  // state.recipe = data.data.recipe;
};

export function getSearchResultsPage(page = 1) {
  state.search.page = page;
  const start = (page - 1) * state.search.itemsPerPage; // 0
  const end = page * state.search.itemsPerPage; // 9
  return state.search.results.slice(start, end);
}

export function updateServings(newServiings: number) {
  // newQt = oldQt * newServings / oldServings // 2 * 8 / 4
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = ((ing.quantity || 0) * newServiings) / state.recipe.servings;
  });

  state.recipe.servings = newServiings;
}

function persistBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export function addBookmark(recipe: Recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);
  persistBookmarks();

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
}

export function deleteBookmark(id: string) {
  // Delete bookmark
  const index = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  persistBookmarks();

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
}

function init() {
  const storage = localStorage.getItem("bookmarks");
  if (storage) {
    state.bookmarks = JSON.parse(storage);
    console.log("bookmarks", state.bookmarks);
  }
}

init();

export function clearBookmarks() {
  localStorage.removeItem("bookmarks");
}

export async function uploadRecipe(newRecipe: RecipeForm) {
  const ingredients = Object.entries(newRecipe)
    .filter(
      (entry) =>
        entry[0].startsWith("ingredient") &&
        typeof entry[1] === "string" &&
        entry[1] !== ""
    )
    .map((entry) => {
      const ingArr = (entry[1] as string).split(",").map((ing) => ing.trim());
      if (ingArr.length !== 3) {
        throw new Error("Wrong Ingredient format! Please use the correct format :)");
      }

      const [quantity, unit, description] = ingArr;
      return { quantity: quantity ? +quantity : null, unit, description };
    });

  const recipe: Recipe = {
    title: newRecipe.title as string,
    cooking_time: +newRecipe.cookingTime,
    image_url: newRecipe.image as string,
    ingredients: ingredients,
    publisher: newRecipe.publisher as string,
    servings: +newRecipe.servings,
    source_url: newRecipe.sourceUrl as string,
  };

  const data: RecipeResposne = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
  state.recipe = data.data.recipe;
  addBookmark(state.recipe);
}
