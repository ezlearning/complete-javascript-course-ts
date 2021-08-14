import { recipeView } from "./views/RecipeView";
import { searchView } from "./views/SearchView";
import { resultsView } from "./views/ResultsView";
import { bookmarksView } from "./views/BookmarksView";
import { paginationView } from "./views/PaginationView";
import { addRecipeView } from "./views/AddRecipeView";

import * as model from "./model";
import { RecipeForm } from "./types";
import { MODAL_CLOSE_SECONDS } from "./config";

///////////////////////////////////////
const recipeController = async function () {
  if (model.state.loading) {
    return;
  }
  const id = window.location.hash;
  if (!id) return;

  try {
    model.state.loading = true;
    recipeView.renderSpinner();

    // 0)update results view to mark selected search result
    const page = model.state.search.page;
    resultsView.update(model.getSearchResultsPage(page));
    bookmarksView.update(model.state.bookmarks);

    // 1) loading recipe
    await model.loadRecipe(id.slice(1));

    // 2) rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    recipeView.renderError();
  } finally {
    model.state.loading = false;
  }
};

function bookmarkControler() {
  // 1. add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2. udpate recipe view
  recipeView.update(model.state.recipe);

  // 3. render the bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const searchController = async function () {
  if (model.state.loading) {
    return;
  }

  // 1. get search query
  const query = searchView.getQuery();
  if (!query) return;

  try {
    // 2. search
    model.state.loading = true;
    resultsView.renderSpinner();
    await model.searchRecipes(query);

    // 3. render results
    searchView.clear();
    const pageData = model.getSearchResultsPage();
    resultsView.render(pageData);

    // 4. render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(`${err} 💥💥💥`);
  } finally {
    model.state.loading = false;
  }
};

const paginationController = function (page: number) {
  // render new results
  const pageData = model.getSearchResultsPage(page);
  resultsView.render(pageData);

  // render now pagination
  paginationView.render(model.state.search);
};

const updateServingsController = function (newServings: number) {
  // update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  recipeView.update(model.state.recipe);
};

function bookmarksControler() {
  bookmarksView.render(model.state.bookmarks);
}

async function addRecipeController(newRecipe: RecipeForm) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL
    window.history.pushState(null, `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, 1000 * MODAL_CLOSE_SECONDS);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
}

function init() {
  bookmarksView.addController(bookmarksControler);
  recipeView.addController(recipeController);
  recipeView.addUpdateServicesController(updateServingsController);
  recipeView.addBookmarkController(bookmarkControler);
  searchView.addController(searchController);
  paginationView.addController(paginationController);
  addRecipeView.addUploadHandler(addRecipeController);
  console.log("welcome");
}

init();
