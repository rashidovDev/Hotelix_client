import { ApolloClient, InMemoryCache} from "@apollo/client";
import {HttpLink} from "@apollo/client/link/http"

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:5001/graphql",
  credentials: "include",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;