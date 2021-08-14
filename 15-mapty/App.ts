import * as L from "leaflet";
import { AppDom } from "./consts";
import {
  Workout,
  Running,
  Cycling,
  WORKOUT_CYCLING,
  WORKOUT_RUNNING,
  WORKOUTS_KEY,
} from "./Workout";

const MapZoomLevel = 15;

export class App {
  // private variable
  #map: L.Map = null;
  #mapClickEvent: L.LeafletMouseEvent = null;
  #workouts: Workout[] = [];

  constructor() {
    this._getPosition();
    AppDom.form.addEventListener("submit", this._newWorkout.bind(this));
    AppDom.inputType.addEventListener("change", this._toggleElevationField.bind(this));
    AppDom.containerWorkouts.addEventListener("click", this._moveToPopup.bind(this));

    this._getLocalStorage();
  }

  private _getPosition() {
    if (navigator.geolocation) {
      console.log("ddd >>>", "getCurrentPosition");
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), (err) => {
        console.error("Coult not get you position", err);
      });
    }
  }

  private _loadMap(position: GeolocationPosition) {
    const { latitude, longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude},10z`);

    const coords: L.LatLngTuple = [latitude, longitude];
    this.#map = L.map("map").setView(coords, MapZoomLevel);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));

    this.#workouts.forEach((w) => this._renderWorkoutMarker(w));
  }

  private _showForm(event: L.LeafletMouseEvent) {
    this.#mapClickEvent = event;
    AppDom.form.classList.remove("hidden");
    AppDom.inputDistance.focus();
  }

  private _hideForm() {
    AppDom.inputDistance.value = "";
    AppDom.inputDuration.value = "";
    AppDom.inputCadence.value = "";
    AppDom.inputElevation.value = "";

    AppDom.form.style.display = "none";
    AppDom.form.classList.add("hidden");
    setTimeout(() => {
      AppDom.form.style.display = "grid";
    }, 1000);
  }

  private _toggleElevationField() {
    AppDom.inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    AppDom.inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  private _newWorkout(event: Event) {
    event.preventDefault();

    const validInputs = (...inputs: number[]) =>
      inputs.every((val) => Number.isFinite(val));
    const allPositives = (...inputs: number[]) => inputs.every((val) => val > 0);

    // Get data from from
    const workoutType = AppDom.inputType.value;
    const distance = +AppDom.inputDistance.value;
    const duration = +AppDom.inputDuration.value;

    let workout: Workout;
    const { lat, lng } = this.#mapClickEvent.latlng;

    // If workout running, create running object
    if (workoutType === WORKOUT_RUNNING) {
      const cadence = +AppDom.inputCadence.value;
      // Check if data is valid
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositives(distance, duration, cadence)
      ) {
        return alert("Inputs have to be positive numbers!");
      }

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout cycling, create cycling object
    else if (workoutType === WORKOUT_CYCLING) {
      const elevation = +AppDom.inputElevation.value;
      // Check if data is valid
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositives(distance, duration)
      ) {
        return alert("Inputs have to be positive numbers!");
      }

      workout = new Cycling([lat, lng], distance, duration, elevation);
    } else {
      return alert("Invalid workoutType!" + workoutType);
    }

    // Add new object to workout array
    this.#workouts.push(workout);

    // Render workout on map as marker
    this._renderWorkoutMarker(workout);

    // Render workout on list
    this._renderWorkout(workout);

    // hide form + clear input fields
    this._hideForm();

    // save data
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout: Workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.workoutType}-popup`,
        })
      )
      .setPopupContent(
        `${workout.workoutType === WORKOUT_RUNNING ? "🚴‍♀️" : "🏃‍♂️"}${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout: Workout) {
    console.log("render", workout);

    let html = `
    <li class="workout workout--${workout.workoutType}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.description}</h2>
      <div class="workout__details">
        <span class="workout__icon">${
          workout.workoutType === WORKOUT_RUNNING ? "🚴‍♀️" : "🏃‍♂️"
        }️</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
    `;

    if (workout instanceof Running) {
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed()}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
      `;
    } else if (workout instanceof Cycling) {
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
      `;
    } else {
      console.error("invalid workout type", workout);
    }

    AppDom.form.insertAdjacentHTML("afterend", html);
  }

  private _moveToPopup(event: MouseEvent) {
    if (!(event.target instanceof HTMLElement)) return;
    const workoutEl = event.target.closest<HTMLLIElement>(".workout");

    if (!workoutEl) return;
    const workout = this.#workouts.find((w) => w.id === workoutEl.dataset.id);

    if (!workout) return;
    this.#map.setView(workout.coords, MapZoomLevel, {
      animate: true,
      duration: 1,
    });

    workout.click();
  }

  _setLocalStorage() {
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data: Workout[] = JSON.parse(localStorage.getItem(WORKOUTS_KEY));
    if (!data) return;

    data.forEach((item) => {
      if (item.workoutType === WORKOUT_CYCLING) {
        const cycling = Object.assign(new Cycling(), item);
        this.#workouts.push(cycling);
      } else if (item.workoutType === WORKOUT_RUNNING) {
        const running = Object.assign(new Running(), item);
        this.#workouts.push(running);
      }
    });

    this.#workouts.forEach((w) => this._renderWorkout(w));
  }

  reset() {
    localStorage.removeItem(WORKOUTS_KEY);
    location.reload();
  }
}
