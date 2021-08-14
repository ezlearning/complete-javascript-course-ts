export const AppDom = {
  form: document.querySelector<HTMLFontElement>(".form"),
  containerWorkouts: document.querySelector<HTMLUListElement>(".workouts"),
  inputType: document.querySelector<HTMLSelectElement>(".form__input--type"),
  inputDistance: document.querySelector<HTMLInputElement>(
    ".form__input--distance"
  ),
  inputDuration: document.querySelector<HTMLInputElement>(
    ".form__input--duration"
  ),
  inputCadence: document.querySelector<HTMLInputElement>(
    ".form__input--cadence"
  ),
  inputElevation: document.querySelector<HTMLInputElement>(
    ".form__input--elevation"
  ),
};
