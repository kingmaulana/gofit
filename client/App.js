import '@/global.css';
import { ApolloProvider } from "@apollo/client";
import client from "@/config/apollo";
import AuthProvider from "@/helpers/auth-context";
import AppConsumer from "@/app-consumer";
import Home from './screens/Home';
import RootStackHome from './navigations/RootStackHome';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <AppConsumer />
      </AuthProvider>
    </ApolloProvider>
  )
}