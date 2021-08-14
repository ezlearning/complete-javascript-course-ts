// import { LatLngTuple } from "leaflet";
export type LatLngTuple = [number, number];
export const WORKOUT_RUNNING = "running";
export const WORKOUT_CYCLING = "cycling";
export const WORKOUTS_KEY = "workouts";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export class Workout {
  workoutType = "";
  description = "";
  date = new Date();
  id = Date.now() + "";
  clicks = 0;

  constructor(
    public coords: LatLngTuple,
    public distance: number, /// in km
    public duration: number // in min
  ) {}

  _setDescription() {
    // prettier-ignore
    this.description = `${
      this.workoutType[0].toUpperCase()
    }${
      this.workoutType.slice( 1)
    } on ${months[this.date.getMonth()]} ${
      this.date.getDate()
    }`;
  }

  click() {
    this.clicks++;
  }
}

export class Running extends Workout {
  pace = 0;
  workoutType = WORKOUT_RUNNING;

  constructor(
    public coords: LatLngTuple = [0, 0],
    public distance: number = 0, /// in km
    public duration: number = 0, // in min
    public cadence: number = 0 // steps/min
  ) {
    super(coords, distance, duration);
    this._setDescription();
    this.calcPace();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

export class Cycling extends Workout {
  speed = 0;
  workoutType = WORKOUT_CYCLING;

  constructor(
    public coords: LatLngTuple = [0, 0],
    public distance: number = 0, /// in km
    public duration: number = 0, // in min
    public elevationGain: number = 0 // meters
  ) {
    super(coords, distance, duration);
    this._setDescription();
    this.calcSpeed();
  }

  calcSpeed() {
    //km/h
    this.speed = this.distance / this.duration / 60;
    return this.speed;
  }
}
