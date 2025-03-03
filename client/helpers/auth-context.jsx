import {deleteSecure, getSecure, storeSecure} from "@/helpers/secure";
import {useState, createContext, useEffect, useMemo} from "react";
import {Alert} from "react-native";

export const AuthContext = createContext(null);

export default function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    Alert.alert("Logout from GoFit?", "This will log you out of the app.", [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          await handleLogoutProcess();
        },
      },
    ]);
  }

  const handleLogin = async (loginData) => {
    await storeSecure("token", loginData.token);
    setLogin(true)
  }

  const handleLogoutProcess = async () => {
    await deleteSecure("token");
    setUser(null);
    setLogin(false);
  }

  useEffect(() => {
    const storeToken = async () => {
      return getSecure("token");
    }

    storeToken().then(async (token) => {
      if (token) {
        setLogin(true);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const value = useMemo(() => ({
    loading,
    user,
    login,
    handleLogin,
    handleLogout
  }), [loading, user, login])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}