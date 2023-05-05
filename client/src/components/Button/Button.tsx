import { ButtonWrapper } from "./Button.styles";

interface IButton {
  type?: "button" | "submit";
  text: string;
  bg?: string;
  hoverBg?: string;
  margin?: string;
  disabled?: boolean;
  onClick?: any;
}

export const Button = ({
  type,
  text,
  bg = "var(--secondary-bg)",
  hoverBg = "var(--secondary-bg-f)",
  margin,
  disabled,
  onClick,
}: IButton) => {
  return (
    <ButtonWrapper
      disabled={disabled}
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
