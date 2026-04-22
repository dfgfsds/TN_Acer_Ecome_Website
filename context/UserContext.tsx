"use client";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserAPi } from "../api-endpoints/authendication";

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
  login: (user: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["getUserData", userId],
    queryFn: async () => {
      const response = await getUserAPi(`${userId}`);
      // Handle the case where the API returns the user object directly or nested
      return response.data?.user || response.data;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  const login = (userData: any) => {
    const id = userData?.user_id || userData?.id || userData?.user?.id;
    const cartId = userData?.cart_id;
    if (id) {
      localStorage.setItem('userId', id.toString());
      if (cartId) localStorage.setItem('cartId', cartId.toString());

      setUserId(id.toString());

      // Handle structures like { user: {...}, token: "..." } vs direct user object
      setUser(userData?.user || userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
