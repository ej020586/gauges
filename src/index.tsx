import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./components/App.tsx";
import { isDev } from "./config";
import AppDev from "./components/AppDev.tsx";

console.log("isDev", isDev);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {!isDev ? <App /> : <AppDev />}
  </StrictMode>
);
