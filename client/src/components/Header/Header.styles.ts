import styled from "styled-components";

export const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  padding: 1rem 3rem;
  background-color: green;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: var(--white);
  box-shadow: 0px 12px 28px rgba(33, 39, 73, 0.2);
`;

export const Logo = styled.img`
  height: 40px;
  width: 40px;
`;

export const NavItems = styled.section`
  display: flex;
  align-items: center;
  gap: 30px;
`;

export const UserProfile = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: var(--faint-black);
  color: var(--white);
  box-shadow: 0px 12px 28px rgba(33, 39, 73, 0.2);
`;

export const ProjectDropDown = styled.div`
  cursor: pointer;
  font-size: 0.9rem;
`;
