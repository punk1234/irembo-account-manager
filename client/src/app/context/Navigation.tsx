import { useMemo } from "react";
import { createContext, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { authSelector } from "../services/features/auth.slice";
import { useAppSelector } from "../services/hook";

interface INavigation {
  children: ReactNode;
}

export interface INavigationContext {
  userEmail: string;
  userPicture: string;
  userId: string;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isVerified: boolean;
  firstName: string;
  lastName: string;
  maritalStatus: string;
  nationality: string;
  is2fa: boolean;
}

export const NavigationContext = createContext<INavigationContext>({
  userEmail: "",
  userPicture: "",
  userId: "",
  isAdmin: false,
  isAuthenticated: false,
  isVerified: false,
  firstName: "",
  lastName: "",
  maritalStatus: "",
  nationality: "",
  is2fa: false,
});

export const Navigation = ({ children }: INavigation) => {
  const { user, token, twoFaSetupCode } = useAppSelector(authSelector);

  const checkToken = user ? true : false;

  const userData = useMemo(() => {
    if (user) {
      return user;
    }
    return null;
  }, [user]);

  if (!user?.verified && token) {
    return <Navigate to="/confirm-login" replace />;
  }

  return (
    <NavigationContext.Provider
      value={{
        userEmail: userData?.email || "",
        userPicture: userData?.photoUrl || "",
        userId: userData?.id || "",
        isAdmin: userData?.isAdmin || false,
        isAuthenticated: checkToken,
        isVerified: userData?.verified || false,
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        maritalStatus: userData?.maritalStatus || "",
        nationality: userData?.nationality || "",
        is2fa: twoFaSetupCode ? true : false,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
