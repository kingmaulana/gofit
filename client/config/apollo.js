import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {getSecure} from "@/helpers/secure";

const httpLink = createHttpLink({
  uri: process.env.EXPO_PUBLIC_API_URL,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getSecure("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default client;