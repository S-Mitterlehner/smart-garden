const { ApolloServer } = require("apollo-server");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");

// Initialize an ApolloGateway instance and pass it
// the supergraph schema
const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      //TODO: get endpoints from env
      { name: "beds", url: "http://localhost:5206/graphql/" },
      { name: "plants", url: "http://localhost:5117/graphql/" },
    ],
  }),
});

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
  gateway,

  cors: {
    origin: "*", // Allow all origins
  },
});

server.listen(5100).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
