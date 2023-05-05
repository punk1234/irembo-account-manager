import styled from "styled-components";

export const SelectWrapper = styled.div`
  position: relative;
`;

interface ILabel {
  labelbg?: string;
}

export const Label = styled.label<ILabel>`
  position: absolute;
  top: -8px;
  left: 16px;
  padding: 0px 2px;
  font-size: 14px;
  background-color: ${({ labelbg }) => labelbg};
  color: var(--text-grey);
`;

export const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 12px;
  width: 100%;
  background: var(--white);
  border: 1px solid var(--border);
  cursor: pointer;
  border-radius: 8.07558px;
  font-size: clamp(0.9rem, 90%, 1rem);

  &[data-open="true"] {
    border-radius: 8.07558px 8.07558px 0 0;
  }
`;

export const SelectedValue = styled.p``;

export const OptionContainer = styled.div`
  padding: 10px;
  background-color: #fff;
  overflow-y: auto;
  height: min(max(18px), fit-content);
  position: absolute;
  top: 100;
  z-index: 9999;
  width: 100%;
  box-shadow: 0px 4px 2px #000;
  color: red;
`;

export const Caret = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-radius: 4px 4px 0 0;
  border-width: 10px 7.64px 0 7.64px;
  border-color: #000 transparent transparent transparent;

  &[data-isopen="true"] {
    border-width: 0 7.64px 10px 7.64px;
    border-color: transparent transparent #000 transparent;
    border-radius: 0 0 5px 5px;
  }
`;

export const Option = styled.div`
  padding: 8px 14px;
  cursor: pointer;
  border: none;

  input {
    background-color: transparent;
    outline: none;
    border: none;
    width: 100%;
    cursor: pointer;
  }

  :hover {
    background-color: var(--color-white-200);
  }

  :not(:first-child) {
    margin-top: 10px;
  }

  font-size: var(--font-text--sm-2);
`;
