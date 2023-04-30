import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Header, SideBar } from "../components";

export const RootAppShell = () => {
  return (
    <AppMain>
      <SideBar />
      <AppBody>
        <Header />
        <AppContent>
          <Outlet />
        </AppContent>
      </AppBody>
    </AppMain>
  );
};

const AppMain = styled.main`
  display: flex;
`;

const AppBody = styled.div`
  flex: 1;
`;

const AppContent = styled.div`
  background-color: var(--white);
  overflow: auto;
  padding: 3rem;
  height: calc(100vh - 80px);
`;
