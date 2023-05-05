import React, { useContext } from "react";
import { NavigationContext } from "@/app/context/Navigation";
import DefaultUserImage from "@/assets/profile-default.png";
import { HeaderWrapper, Logo, NavItems, UserProfile } from "./Header.styles";

export const Header = () => {
  const { userPicture } = useContext(NavigationContext);

  return (
    <HeaderWrapper>
      <Logo />
      <NavItems>
        <UserProfile src={userPicture} brokenSrc={DefaultUserImage} />
      </NavItems>
    </HeaderWrapper>
  );
};
