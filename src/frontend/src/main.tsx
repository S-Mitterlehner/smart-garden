import "@mantine/core/styles.css";
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import BeetPage from "./pages/BeetPage.tsx";
import { MantineProvider } from "@mantine/core";
import Header from "./components/Header.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ArcElement, Chart as ChartJs } from "chart.js";

const queryClient = new QueryClient();

ChartJs.register(ArcElement);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <BrowserRouter>
          <Header />
          <div className="max-w-8xl m-auto px-4 py-4">
            <Routes>
              <Route path="/beet">
                <Route path=":beetId" element={<BeetPage />}></Route>
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>
);
