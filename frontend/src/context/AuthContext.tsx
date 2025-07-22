import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import authAPIs from "@/api/authAPIs";
import Cookies from "js-cookie";

type User = {
  id: number;
  name: string;
  email: string;
  role: "employer" | "candidate";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authAPIs.getCurrentUser();
        setUser(res.data.data);
      } catch {
        Cookies.remove("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchUser(); // silence "void-return expected" warning
  }, []);

  const logout = () => {
    void authAPIs.logout().catch(() => {});
    Cookies.remove("token");
    setUser(null);
    window.location.href = "/login";
  };

  const contextValue = useMemo(
    () => ({ user, loading, logout }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
