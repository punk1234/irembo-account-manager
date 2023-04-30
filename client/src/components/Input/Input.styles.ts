import styled from "styled-components";

export const CustomInput = styled.div``;

export const InputWrapper = styled.div`
  position: relative;
  padding: 14px 12px;
  width: 100%;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    display: inline-flex;
    cursor: pointer;
  }
`;

interface IInputLabel {
  labelbg?: string;
}

export const InputLabel = styled.label<IInputLabel>`
  position: absolute;
  top: -8px;
  left: 16px;
  padding: 0px 2px;
  font-size: 14px;
  background-color: ${(props) => props.labelbg};
  color: var(--text-grey);
`;

interface IInputField {
  color?: string;
}

export const InputField = styled.input<IInputField>`
  outline: none;
  border: none;
  width: 100%;
  font-size: clamp(0.9rem, 90%, 1rem);
  color: ${(props) => props.color};
  background-color: transparent;

  ::placeholder {
    color: var(--text-grey);
    font-size: 0.9rem;
  }

  :focus-within {
    ::placeholder {
      color: transparent;
    }
  }
`;

export const InputError = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 6px 4px 2px 6px;
  font-size: 12px;
  color: var(--error);

  span {
    display: inline-flex;
  }
`;
