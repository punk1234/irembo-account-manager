import React, { useState } from "react";
import { Icon as BlueIcon } from "@blueprintjs/core";
import {
  InputField,
  InputLabel,
  InputWrapper,
  CustomInput,
  InputError,
} from "./Input.styles";

interface IInput {
  placeholder?: string;
  type: "text" | "number" | "email" | "password";
  inputValue?: string;
  name?: string;
  labelbg?: string;
  color?: string;
  isError?: boolean;
  error_text?: string;
}

export const Input = ({
  placeholder,
  type,
  inputValue,
  name,
  labelbg,
  color = "var(--faint-black)",
  isError = false,
  error_text = "Error",
}: IInput) => {
  const [value, setValue] = useState<string | number>();
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <CustomInput>
      <InputWrapper>
        {(inputFocus || value) && (
          <InputLabel labelbg={labelbg} data-focus={inputFocus}>
            {placeholder}
          </InputLabel>
        )}

        <InputField
          autoComplete="off"
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          value={value || inputValue}
          name={name}
          onChange={(e) => setValue(e.target.value)}
          data-type={type}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          color={color}
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
