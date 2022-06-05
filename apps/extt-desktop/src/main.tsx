import "./styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "#/App";
import { App as DevApp } from "#/dev/App";
import { store } from "#/store";

if (window.hasOwnProperty("__TAURI__")) {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <DevApp />
    </React.StrictMode>
  );
}
