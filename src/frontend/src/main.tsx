import "@mantine/core/styles.css";
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import BeetPage from "./pages/BeetPage.tsx";
import { MantineProvider } from "@mantine/core";
import Header from "./components/Header.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ArcElement, Chart as ChartJs } from "chart.js";
import GardenPage from "./pages/GardenPage.tsx";

const queryClient = new QueryClient();

ChartJs.register(ArcElement);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <BrowserRouter>
          <Header />
          <div className="max-w-screen-desktop m-auto py-4 px-4 desktop:py-12">
            <Routes>
              <Route path="/garden" element={<GardenPage />} />
              <Route path="/beet">
                <Route path=":beetId" element={<BeetPage />}></Route>
              </Route>
              <Route path="/" element={<Navigate to="/garden" />} />
            </Routes>
          </div>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>
);
