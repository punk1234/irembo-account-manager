import { Icon, MaybeElement } from "@blueprintjs/core";
import { BlueprintIcons_16Id } from "@blueprintjs/icons/lib/esm/generated-icons/16px/blueprint-icons-16";
import { useState } from "react";
import {
  SideBarWrapper,
  SideBarContainer,
  SideBarControl,
  Organization,
  OrganizationName,
  Nav,
  NavItems,
  NavItem,
  SideBarNavLink,
} from "./SideBar.styles";

interface INavItemComponent {
  isSideBarDesktop: boolean;
  text: string;
  icon: BlueprintIcons_16Id | MaybeElement;
  to: string;
}

const NavItemComponent = ({
  isSideBarDesktop,
  text,
  icon,
  to,
}: INavItemComponent) => {
  return (
    <NavItem>
      <SideBarNavLink
        to={to}
        data-position={isSideBarDesktop}
        className={(isActive) => isActive && "active"}
      >
        <Icon size={18} icon={icon} />
        {isSideBarDesktop && text}
      </SideBarNavLink>
    </NavItem>
  );
};

export const SideBar = () => {
  const [sideBarDesktop, setSideBarDesktop] = useState(false);

  return (
    <SideBarWrapper data-desktop={sideBarDesktop}>
      <SideBarContainer>
        <SideBarControl onClick={() => setSideBarDesktop(!sideBarDesktop)}>
          <Icon
            color="var(--white)"
            icon={sideBarDesktop ? "chevron-left" : "chevron-right"}
            size={16}
          />
        </SideBarControl>
        <Organization data-mobile={sideBarDesktop}>
          <OrganizationName>
            {sideBarDesktop ? "FuncFlow" : "FuncFlow".slice(0, 2)}
          </OrganizationName>
          {sideBarDesktop && (
            <Icon color="var(--black)" icon="chevron-down" size={16} />
          )}
        </Organization>
        <Nav>
          <NavItems>
            <NavItemComponent
              isSideBarDesktop={sideBarDesktop}
              icon="grid-view"
              text="Dashboard"
              to="dashboard"
            />
            <NavItemComponent
              isSideBarDesktop={sideBarDesktop}
              icon="changes"
              text="Functional Requirements"
              to="functional-requirements"
            />
          </NavItems>
        </Nav>
      </SideBarContainer>
    </SideBarWrapper>
  );
};
