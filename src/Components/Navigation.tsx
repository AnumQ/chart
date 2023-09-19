// Navigation
import React, { useState } from "react";
import CustomButton from "../UI/CustomButton";
import { NAV_ITEM_DEMO, NAV_ITEM_LIVE } from "../Helpers/Constants";
import Switch from "../UI/Switch";
import "./Navigation.scss";

type NavigationProps = {
  activeButton: string;
  setActiveButton: React.Dispatch<React.SetStateAction<string>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

function Navigation({
  activeButton,
  setActiveButton,
  setSearch,
}: NavigationProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (e: { key: string }) => {
    if (e.key === "Enter") {
      setSearch(inputValue);
    }
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
          isActive={activeButton !== NAV_ITEM_DEMO}
          onClick={() => {
            setActiveButton((prev) =>
              prev === NAV_ITEM_DEMO ? NAV_ITEM_LIVE : NAV_ITEM_DEMO
            );
          }}
        />
        <CustomButton
          title={NAV_ITEM_LIVE}
          isActive={activeButton !== NAV_ITEM_DEMO}
          onClick={() => {
            setActiveButton((prev) =>
              prev === NAV_ITEM_DEMO ? NAV_ITEM_LIVE : NAV_ITEM_DEMO
            );
          }}
        />
        {/* {items.map((item, index) => (
          <CustomButton
            title={item}
            isActive={activeButton === item}
            onClick={() => {
              setActiveButton(item);
            }}
          />
        ))} */}
      </div>
    </nav>
  );
}

export default Navigation;
