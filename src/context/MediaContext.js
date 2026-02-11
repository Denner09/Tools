import { createContext, useContext, useState } from 'react';

const MediaContext = createContext();

export function MediaProvider({ children }) {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <MediaContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  return useContext(MediaContext);
}
