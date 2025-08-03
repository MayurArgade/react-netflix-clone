import { createContext, useContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const WatchLaterContext = createContext();

export const WatchLaterProvider = ({ children }) => {
  const [watchLater, setWatchLater] = useState(() => {
    const stored = localStorage.getItem("watchLater");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("watchLater", JSON.stringify(watchLater));
  }, [watchLater]);

  const addToWatchLater = (movie, tags = []) => {
    setWatchLater((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      return [...prev, { ...movie, tags }];
    });
  };

  const removeFromWatchLater = (id) => {
    setWatchLater((prev) => prev.filter((m) => m.id !== id));
  };

  const updateTags = (id, tags) => {
    setWatchLater((prev) =>
      prev.map((m) => (m.id === id ? { ...m, tags } : m))
    );
  };

  return (
    <WatchLaterContext.Provider
      value={{ watchLater, addToWatchLater, removeFromWatchLater, updateTags }}
    >
      {children}
    </WatchLaterContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWatchLater = () => useContext(WatchLaterContext); 