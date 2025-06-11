import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

export function createCustomApolloClient(host: string) {
  const httpLink = new HttpLink({
    uri: `${import.meta.env.VITE_API_PROTOCOL}://${host}/graphql/`,
    credentials: "include",
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: `ws://${host}/graphql/`,
    }),
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === "OperationDefinition" && definition.operation === "subscription";
    },
    wsLink,
    httpLink,
  );
  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
}
