import { useClickOutside } from "@/hooks";
import { ChangeEvent, useState } from "react";
import { Input } from "../Input/Input";

import * as Styled from "./Select.styles";

export interface IOption {
  value: string;
  label: string;
}

interface ISelect {
  labelbg?: string;
  defaultValue?: string;
  options?: IOption[];
  label?: string;
  name: string;
  value: string | number | null | File;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Select = ({
  defaultValue = "Select",
  options,
  label,
  labelbg,
  name,
  onChange,
}: ISelect) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const closeDropDownRef = useClickOutside(() => setIsOpen(false));
  return (
    <Styled.SelectWrapper>
      <Styled.Label labelbg={labelbg}>{label}</Styled.Label>
      <Styled.SelectContainer
        onClick={() => setIsOpen(!isOpen)}
        data-bdradius={isOpen}
      >
        <Styled.SelectedValue>
          {selectedOption || defaultValue}
        </Styled.SelectedValue>
        <Styled.Caret as="span" data-isopen={isOpen} />
      </Styled.SelectContainer>
      {isOpen && (
        <Styled.OptionContainer>
          {options
            ?.filter(
              (filteredOption) => filteredOption.label !== selectedOption
            )
            ?.map((option) => {
              return (
                <Styled.Option
                  key={option.value}
                  onClick={() => {
                    setSelectedOption(option.label);
                    setIsOpen(false);
                    onChange({
                      target: {
                        name,
                        value: option.value,
                      },
                    } as ChangeEvent<HTMLInputElement>);
                  }}
                >
                  <input
                    type="text"
                    name={name}
                    value={option.label}
                    readOnly
                    onChange={onChange}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  />
                </Styled.Option>
              );
            })}
        </Styled.OptionContainer>
      )}
    </Styled.SelectWrapper>
  );
};
