"use client";
import {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useEffect
} from "react";


export const HelperContext = createContext();

export default function HelperContextProvider({ children }) {

  const [isOpen, setIsOpen] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);


  return (
    <HelperContext.Provider value={{ isOpen, setIsOpen, trackIndex, setTrackIndex, isPlaying, setIsPlaying }}>
      {children}
    </HelperContext.Provider>
  );
}

export function useHelperContextApp() {
  return useContext(HelperContext)
}