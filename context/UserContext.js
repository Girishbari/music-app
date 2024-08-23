"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState();

  function setUserData({ email, playlists, userId }) {
    if (!typeof window) return;
    window.localStorage.setItem("email", JSON.stringify(email) || "");
    window.localStorage.setItem("playlists", JSON.stringify(playlists) || []);
    window.localStorage.setItem("userId", JSON.stringify(userId) || "")
    setUser({
      email: email,
      playlists: playlists,
    });
  }
  return (
    <UserContext.Provider value={{ user, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContextApp() {
  return useContext(UserContext);
}
