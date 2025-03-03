import '@/global.css';
import {ApolloProvider} from "@apollo/client";
import client from "@/config/apollo";
import AuthProvider from "@/helpers/auth-context";
import AppConsumer from "@/app-consumer";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <AppConsumer/>
      </AuthProvider>
    </ApolloProvider>
  )
}