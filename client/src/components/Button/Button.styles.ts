import styled from "styled-components";

interface IButtonWrapper {
  bg: string;
  margin: string;
  hoverBg: string;
}

export const ButtonWrapper = styled.button<IButtonWrapper>`
  background-color: ${(props) => props.bg};
  color: var(--white);
  cursor: pointer;
  margin: ${(props) => props.margin};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  letter-spacing: 1px;
  outline: none;
  border: none;
  padding: 16px 12px;
  border-radius: 8px;

  :hover {
    background-color: ${(props) => props.hoverBg};
  }
`;
