import React from "react";
import { ButtonWrapper } from "./Button.styles";

interface IButton {
  type: "button" | "submit";
  text: string;
  bg?: string;
  hoverBg?: string;
  margin: string;
  onClick?: () => void;
}

export const Button = ({
  type,
  text,
  bg = "var(--secondary-bg)",
  hoverBg = "var(--secondary-bg-f)",
  margin,
  onClick,
}: IButton) => {
  return (
    <ButtonWrapper
      type={type}
      bg={bg}
      hoverBg={hoverBg}
      margin={margin}
      onClick={onClick}
    >
      {text}
    </ButtonWrapper>
  );
};
