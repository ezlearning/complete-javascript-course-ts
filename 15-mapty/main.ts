import "leaflet/dist/leaflet.css";
import { App } from "./App";

declare global {
  interface Window {
    app: App;
  }
}

const app = new App();
window.app = app;
