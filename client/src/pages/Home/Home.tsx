import { Link } from "react-router-dom";
import { useGetUsersQuery } from "../../app/services/endpoints";
import { HomeWrapper } from "./Home.styles";

export const Home = () => {
  const { isLoading } = useGetUsersQuery({});

  return (
    <HomeWrapper>
      <Link to="/signup">{isLoading ? "Loading" : "Signup"}</Link>
    </HomeWrapper>
  );
};
