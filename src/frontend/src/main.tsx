import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "graphql-ws";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Header from "./components/Header.tsx";
import { AppSettingsProvider } from "./hooks/useAppSettings.tsx";
import "./index.css";
import BedPage from "./pages/BedPage.tsx";
import GardenPage from "./pages/GardenPage.tsx";

const queryClient = new QueryClient();

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_API_PROTOCOL}://${import.meta.env.VITE_API_HOST}/graphql`,
  credentials: "include",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${import.meta.env.VITE_API_HOST}/graphql`,
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);
const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppSettingsProvider>
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
    </AppSettingsProvider>
  </StrictMode>,
);
