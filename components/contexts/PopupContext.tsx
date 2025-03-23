import { createContext, ReactNode, useContext, useState } from "react";
import Popup from "../shared/Popup";

interface PopupContextType {
  isPopupVisible: boolean;
  showPopup: () => void;
  hidePopup: () => void;
  setPopupContent: (content: ReactNode) => void;
}

const PopupContext = createContext<PopupContextType>({
  isPopupVisible: false,
  showPopup: () => {},
  hidePopup: () => {},
  setPopupContent: () => {},
});

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);

  const showPopup = () => setIsPopupVisible(true);
  const hidePopup = () => {
    setIsPopupVisible(false);
    setContent(null);
  };
  const setPopupContent = (content: ReactNode) => setContent(content);

  return (
    <PopupContext.Provider
      value={{
        isPopupVisible,
        showPopup,
        hidePopup,
        setPopupContent,
      }}
    >
      {children}
      <Popup visible={isPopupVisible}>{content}</Popup>
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};
