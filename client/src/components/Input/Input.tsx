import { InputHTMLAttributes, useState } from "react";
import { Icon as BlueIcon } from "@blueprintjs/core";
import {
  InputField,
  InputLabel,
  InputWrapper,
  CustomInput,
  InputError,
} from "./Input.styles";

interface IInput extends Omit<InputHTMLAttributes<HTMLInputElement>, "value"> {
  placeholder?: string;
  name?: string;
  labelbg?: string;
  color?: string;
  isError?: boolean;
  error_text?: string;
  value?: File | number | string | null;
}

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value"> {
  label?: string;
  placeholder?: string;
  required?: boolean;
  name: string;
  icon?: string;
  value?: File | number | string | null;
  selectedFile?: File | null;
  isError?: boolean;
  error_text?: string;
  labelbg?: string;
}

export const Input = ({
  placeholder,
  type,
  labelbg,
  color = "var(--faint-black)",
  isError = false,
  error_text = "Error",
  value,
  ...rest
}: IInput) => {
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <CustomInput>
      <InputWrapper>
        {inputFocus && (
          <InputLabel labelbg={labelbg} data-focus={inputFocus}>
            {placeholder}
          </InputLabel>
        )}

        <InputField
          autoComplete="off"
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          data-type={type}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          color={color}
          {...rest}
        />

        {type === "password" && (
          <BlueIcon
            icon={`${showPassword ? "eye-open" : "eye-off"}`}
            color="#8f95b2"
            size={20}
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </InputWrapper>

      {isError && !inputFocus && (
        <InputError>
          <BlueIcon icon="error" color="var(--error)" size={11} />
          {error_text}
        </InputError>
      )}
    </CustomInput>
  );
};
