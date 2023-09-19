import React from "react";
import "./Switch.scss";

interface SwitchProps {
  isActive: boolean;
  onClick: () => void;
}

const Switch: React.FC<SwitchProps> = ({ isActive, onClick }) => {
  const toggleSwitch = () => {
    onClick();
  };

  return (
    <label
      className={`switch ${isActive ? "on" : "off"}`}
      onClick={toggleSwitch}
    >
      <div className={`slider ${isActive ? "on" : "off"}`}></div>
    </label>
  );
};

export default Switch;
