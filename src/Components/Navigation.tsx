// Navigation
import React, { useState } from "react";
import CustomButton from "../UI/CustomButton";
import { NAV_ITEM_DEMO, NAV_ITEM_LIVE } from "../Helpers/Constants";
import Switch from "../UI/Switch";
import "./Navigation.scss";
import { useNavContext } from "../Contexts/NavigationContext";

type NavigationProps = {
  activeButton: string;
  setActiveButton: React.Dispatch<React.SetStateAction<string>>;
};

function Navigation({ activeButton, setActiveButton }: NavigationProps) {
  const [inputValue, setInputValue] = useState("");
  const { navState, setState } = useNavContext();

  const handleKeyPress = (e: { key: string }) => {
    if (e.key === "Enter") {
      setState((prevState) => ({
        ...prevState,
        search: inputValue,
      }));
    }
  };

  const toggleLive = () => {
    setState((prevState) => ({
      ...prevState,
      isLive: !prevState.isLive,
    }));
  };

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInputValue(e.target.value);
  };

  return (
    <nav className="navbar">
      <div className="left">
        <div className="logo">
          <i className="fa-sharp fa-light fa-layer-group fa-2xl"></i>
        </div>
        <div>
          <input
            type="search"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            onKeyUp={handleKeyPress}
            className="search"
            placeholder="Search"
          ></input>
        </div>
      </div>

      <div className="right">
        <Switch
          isActive={navState.isLive}
          onClick={() => {
            toggleLive();
          }}
        />
        <CustomButton
          title={NAV_ITEM_LIVE}
          isActive={navState.isLive}
          onClick={() => {
            toggleLive();
            setActiveButton((prev) =>
              prev === NAV_ITEM_DEMO ? NAV_ITEM_LIVE : NAV_ITEM_DEMO
            );
          }}
        />
      </div>
    </nav>
  );
}

export default Navigation;
