import React from "react";

interface CustomButtonProps {
  title: string;
  onClick: () => void;
  isActive: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onClick,
  isActive,
}) => {
  const onButtonClick = () => {
    onClick();
  };

  return (
    <button className={isActive ? "active" : ""} onClick={onButtonClick}>
      {title}
    </button>
  );
};

export default CustomButton;
