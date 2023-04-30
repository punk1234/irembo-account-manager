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
        <ProjectDropDown>Projects</ProjectDropDown>
        <UserProfile>AF</UserProfile>
        <Button type="button" text="Upgrade Plan" margin="0" />
      </NavItems>
    </HeaderWrapper>
  );
};
