import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { App as DevApp } from "./dev/App";

import "./styles.css";

if (window.hasOwnProperty("__TAURI__")) {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <DevApp />
    </React.StrictMode>
  );
}
