import { type ReactNode, createContext, useContext, useEffect, useState } from "react";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

interface User {
  id: string;
  username: string;
  telegramId?: string;
}

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setState({
            isAuthenticated: true,
            user: JSON.parse(storedUser),
            isLoading: false,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setState({
      isAuthenticated: true,
      user,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("user");
    setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
