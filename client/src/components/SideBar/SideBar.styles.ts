import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const SideBarWrapper = styled.aside`
  position: sticky;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100vh;
  background: var(--white);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.161);
  padding: 1rem 0;
  &[data-desktop] {
    width: 200px;
  }

  &[data-desktop="false"] {
    width: 70px;
  }
`;

export const SideBarContainer = styled.div`
  height: 100%;
  position: relative;
`;

export const SideBarControl = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: var(--secondary-bg);
  box-shadow: 0px 12px 28px rgba(33, 39, 73, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translate(-15%, -50%);
  cursor: pointer;

  span {
    display: inline-flex;
  }
`;

export const Organization = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  position: relative;
  padding: 1rem;

  span {
    display: inline-flex;
    cursor: pointer;
    padding: 5px;
    border-radius: 6px;

    :hover {
      background-color: var(--secondary-bg);
      box-shadow: 0px 12px 28px rgba(33, 39, 73, 0.2);

      svg {
        fill: var(--white);
      }
    }
  }

  &[data-mobile="false"] {
    background-color: var(--secondary-bg);
    box-shadow: 0px 12px 28px rgba(33, 39, 73, 0.2);
    color: var(--white);
    border-radius: 6px;
    text-align: center;
    text-transform: uppercase;
    cursor: pointer;
    width: 40px;
    height: 40px;
    padding: 10px;
    margin: auto;
  }
`;

export const OrganizationName = styled.p`
  flex: 1;
  font-size: 1rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const Nav = styled.nav`
  margin-top: 60px;
  height: 80%;
  overflow-y: auto;
`;

export const NavItems = styled.ul`
  list-style: none;
  padding: 0 1rem;
`;

export const NavItem = styled.li`
  :not(:last-child) {
    margin-bottom: 24px;
  }
`;

export const SideBarNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 8px;
  cursor: pointer;
  text-decoration: none;
  color: var(--black);
  border-left: 3px solid transparent;

  span {
    display: inline-flex;

    svg {
      fill: var(--faint-black);
    }
  }

  :hover {
    border-left: 3px solid var(--faint-black);
  }

  &.active {
    border-left: 3px solid var(--faint-black);
  }

  &[data-position="false"] {
    justify-content: center;
  }
`;
