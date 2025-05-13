import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Header from "./components/Header.tsx";
import "./index.css";
import BedPage from "./pages/BedPage.tsx";
import GardenPage from "./pages/GardenPage.tsx";

const queryClient = new QueryClient();
const apolloClient = new ApolloClient({
  uri: "https://localhost:5002/graphql",
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <Notifications />
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Header />
            <div className="m-auto max-w-screen-desktop px-4 py-4 desktop:py-12">
              <Routes>
                <Route path="/garden" element={<GardenPage />} />
                <Route path="/bed">
                  <Route path=":bedId" element={<BedPage />}></Route>
                </Route>
                <Route path="/" element={<Navigate to="/garden" />} />
              </Routes>
            </div>
          </BrowserRouter>
        </QueryClientProvider>
      </ApolloProvider>
    </MantineProvider>
  </StrictMode>,
);
