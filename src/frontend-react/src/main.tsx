import "@mantine/core/styles.css";
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import BeetPage from "./pages/BeetPage.tsx";
import { MantineProvider } from "@mantine/core";
import Header from "./components/Header.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <Header />
        <div className="max-w-8xl m-auto px-4 py-2">
          <Routes>
            <Route path="/beet">
              <Route path=":beetId" element={<BeetPage />}></Route>
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
