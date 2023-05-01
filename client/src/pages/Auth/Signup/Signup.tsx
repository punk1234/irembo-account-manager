import { Button, Input } from "../../../components";
import config from "../../../config";
import {
  AuthForm,
  AuthWrapper,
  AuthWrapperContainer,
  FormTitle,
  FormText,
  FormBottomWrapper,
  FormBottom,
} from "../Auth.styles";

export const Signup = () => {
  const labelBgColor = "var(--white)";
  const appName = config.APP_NAME;

  return (
    <AuthWrapper>
      <AuthWrapperContainer>
        <FormTitle>Sign up on {appName}</FormTitle>
        <FormText>
          Welcome to the {appName} platform! Please enter your details
        </FormText>
        <AuthForm>
          <Input
            placeholder="Enter Your Email"
            type="email"
            name="email"
            labelbg={labelBgColor}
            isError
          />
          <Input
            placeholder="Enter Your Password"
            type="password"
            name="password"
            labelbg={labelBgColor}
          />
          <Button text="Confirm" type="submit" margin="20px 0px 0px 0px" />
        </AuthForm>
        <FormBottomWrapper>
          <FormBottom to="/login">Continue with {appName}</FormBottom>
        </FormBottomWrapper>
      </AuthWrapperContainer>
    </AuthWrapper>
  );
};
