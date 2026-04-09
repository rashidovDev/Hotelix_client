import {
  ApolloLink,
  ApolloClient,
  HttpLink,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:5001/graphql",
  credentials: "include", // ← sends HttpOnly cookie automatically
});

// Attach accessToken to every request
const authLink = new SetContextLink((prevContext) => {
  let token = null;

  if (typeof window !== "undefined") {
    const authStorage = localStorage.getItem("hotelix-auth");
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        token = parsed?.state?.accessToken ?? null;
      } catch {
        token = null;
      }
    }
  }

  return {
    headers: {
      ...(prevContext.headers ?? {}),
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Auto refresh accessToken when expired
const errorLink = new ErrorLink(({ error, operation, forward }) => {
  const graphQLErrors = CombinedGraphQLErrors.is(error) ? error.errors : [];

  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === "UNAUTHENTICATED") {
        return new Observable((observer) => {
          (async () => {
            try {
              // Call refreshTokens — cookie is sent automatically
              const response = await fetch(
                process.env.NEXT_PUBLIC_GRAPHQL_URL ||
                  "http://localhost:5001/graphql",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include", // ← sends HttpOnly cookie
                  body: JSON.stringify({
                    query: `mutation {
                      refreshTokens {
                        accessToken
                        user {
                          id firstName lastName email role
                        }
                      }
                    }`,
                  }),
                }
              );

              const { data } = await response.json();
              if (!data?.refreshTokens) throw new Error("Refresh failed");

              const { accessToken, user } = data.refreshTokens;

              // Update only accessToken in storage
              const current = JSON.parse(
                localStorage.getItem("hotelix-auth") || "{}"
              );
              current.state.accessToken = accessToken;
              current.state.user = user;
              current.state.isAuthenticated = true;
              localStorage.setItem("hotelix-auth", JSON.stringify(current));

              // Retry original request with new token
              operation.setContext(({ headers = {} }) => ({
                headers: {
                  ...headers,
                  authorization: `Bearer ${accessToken}`,
                },
              }));

              forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
            } catch {
              // Refresh failed — clear auth and redirect
              localStorage.removeItem("hotelix-auth");
              window.location.href = "/auth/login";
              observer.error(new Error("Session expired"));
            }
          })();
        });
      }
    }
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;