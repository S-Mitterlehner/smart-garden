import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "graphql-ws";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import Header from "./components/Header.tsx";
import { AppSettingsProvider } from "./hooks/useAppSettings.tsx";
import { AuthProvider } from "./hooks/useAuth.tsx";
import "./index.css";
import BedPage from "./pages/BedPage.tsx";
import GardenPage from "./pages/GardenPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";

const queryClient = new QueryClient();

const httpLink1 = new HttpLink({
  uri: `${import.meta.env.VITE_API_PROTOCOL}://${import.meta.env.VITE_API_HOST}/graphql/`,
  credentials: "include",
});

const wsLink1 = new GraphQLWsLink(
  createClient({
    url: `ws://${import.meta.env.VITE_API_HOST}/graphql/`,
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink1,
  httpLink1,
);
const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const theme = createTheme({
  colors: {
    emerald: [
      "#ecfdf5", // 50
      "#d0fae5", // 100
      "#a4f4cf", // 200
      "#5ee9b5", // 300
      "#00d492", // 400
      "#00bc7d", // 500
      "#009966", // 600
      "#007a55", // 700
      "#006045", // 800
      "#004f3b", // 900
    ],
  },
  primaryColor: "emerald",
});

const oidcConfig = {
  onSignIn: () => {
    // Redirect?
  },
  authority: "https://oidc.io/oauthhttps://localhost:7006/connect/token",
  clientId: "react-client",
  redirectUri: "http://localhost:5173/",
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppSettingsProvider>
      <AuthProvider>
        <MantineProvider theme={theme}>
          <Notifications />
          <ApolloProvider client={apolloClient}>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <Header />
                <div className="m-auto max-w-screen-desktop px-4 py-4 desktop:py-12">
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route
                      path="/garden"
                      element={
                        <ProtectedRoute>
                          <GardenPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/bed">
                      <Route
                        path=":bedId"
                        element={
                          <ProtectedRoute>
                            <BedPage />
                          </ProtectedRoute>
                        }
                      ></Route>
                    </Route>
                    <Route path="/" element={<Navigate to="/garden" />} />
                    <Route path="*" element={<Navigate to="/garden" />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </QueryClientProvider>
          </ApolloProvider>
        </MantineProvider>
      </AuthProvider>
    </AppSettingsProvider>
  </StrictMode>,
);
