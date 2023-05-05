import { NavigationContext } from "@/app/context/Navigation";
import { logout } from "@/app/services/features/auth.slice";
import { useAppDispatch } from "@/app/services/hook";
import { Icon, MaybeElement } from "@blueprintjs/core";
import { BlueprintIcons_16Id } from "@blueprintjs/icons/lib/esm/generated-icons/16px/blueprint-icons-16";
import { useContext, useState } from "react";
import config from "../../config";
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
  isForAdmin?: boolean;
}

const NavItemComponent = ({
  isSideBarDesktop,
  text,
  icon,
  to,
  isForAdmin,
}: INavItemComponent) => {
  const { isAdmin } = useContext(NavigationContext);

  const ifAdmin = isForAdmin ? isAdmin : !isAdmin;

  if (!ifAdmin) {
    return <></>;
  }

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

  const dispatch = useAppDispatch();

  const onLogout = () => {
    dispatch(logout({}));
  };
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
            {sideBarDesktop ? config.APP_NAME : config.APP_NAME.slice(0, 2)}
          </OrganizationName>
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
              icon="people"
              text="Users"
              to="users"
              // isForAdmin
            />

            <NavItemComponent
              isSideBarDesktop={sideBarDesktop}
              icon="changes"
              text="Verification Requests"
              to="verification-requests"
            />
          </NavItems>
        </Nav>
      </SideBarContainer>
      <Icon size={18} icon="power" onClick={onLogout} />
    </SideBarWrapper>
  );
};
