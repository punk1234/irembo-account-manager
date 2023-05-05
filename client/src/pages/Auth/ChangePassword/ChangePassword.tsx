import { Button, Input } from "../../../components";
import {
  AuthForm,
  AuthWrapper,
  AuthWrapperContainer,
  FormTitle,
} from "../Auth.styles";

export const ChangePassword = () => {
  const labelBgColor = "var(--white)";

  return (
    <AuthWrapper>
      <AuthWrapperContainer>
        <FormTitle>Change Password</FormTitle>
        <AuthForm>
          <Input
            placeholder="Enter Your Password"
            type="password"
            name="password"
            labelbg={labelBgColor}
          />
          <Input
            placeholder="Confirm Password"
            type="password"
            name="password"
            labelbg={labelBgColor}
          />
          <Button text="Continue" type="submit" margin="20px 0px 0px 0px" />
        </AuthForm>
      </AuthWrapperContainer>
    </AuthWrapper>
  );
};
