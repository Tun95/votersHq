import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { ContextProvider } from "./context/Context.tsx";
import { GlobalProvider } from "./context/UserContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    <ContextProvider>
      <GlobalProvider>
        <HelmetProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </HelmetProvider>
      </GlobalProvider>
    </ContextProvider>
  </Router>
);
