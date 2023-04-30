import React from "react";
import { Button } from "../Button/Button";
import {
  HeaderWrapper,
  Logo,
  ProjectDropDown,
  NavItems,
  UserProfile,
} from "./Header.styles";

export const Header = () => {
  return (
    <HeaderWrapper>
      <Logo />
      <NavItems>
        <UserProfile>AF</UserProfile>
      </NavItems>
    </HeaderWrapper>
  );
};
