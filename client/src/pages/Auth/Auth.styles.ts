import { Link } from "react-router-dom";
import styled from "styled-components";

export const AuthWrapper = styled.div`
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 0.5rem;
`;

export const AuthWrapperContainer = styled.div`
  width: clamp(18rem, 40vw, 40%);
  background-color: var(--white);
  box-shadow: 0px 12px 28px rgba(33, 39, 73, 0.2);
  border-radius: 8px;
  padding: 40px;
  font-size: var(--heading-1);

  @media (max-width: 600px) {
    padding: 40px 20px;
    width: 90%;
  }

  @media (max-width: 480px) {
    padding: 40px 10px;
    width: 100%;
    box-shadow: none;
    border-radius: 0;
  }
`;

export const FormTitle = styled.h3`
  text-align: center;
`;

export const FormText = styled.p`
  text-align: center;
  font-size: 1rem;
  margin: 14px auto;
  max-width: 80%;
  color: var(--faint-black);
  font-weight: 500;
`;

export const AuthForm = styled.form`
  display: grid;
  row-gap: 20px;
  margin-top: 40px;
`;

export const FormBottomWrapper = styled.div`
  text-align: center;
  margin-top: 30px;
`;

export const FormBottom = styled(Link)`
  color: var(--faint-black);
  font-size: 1rem;
`;
