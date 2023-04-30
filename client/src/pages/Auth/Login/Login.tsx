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

export const Login = () => {
  const labelBgColor = "var(--white)";
  const appName = config.APP_NAME;

  return (
    <AuthWrapper>
      <AuthWrapperContainer>
        <FormTitle>Welcome</FormTitle>
        <FormText>Login to {appName}</FormText>
        <AuthForm>
          <Input
            placeholder="Enter Your Email"
            type="email"
            name="email"
            labelbg={labelBgColor}
          />
          <Input
            placeholder="Enter Your Password"
            type="password"
            name="password"
            labelbg={labelBgColor}
          />
          <Button text="Continue" type="submit" margin="20px 0px 0px 0px" />
        </AuthForm>
        <FormBottomWrapper>
          <FormBottom to="/signup">Create an account with {appName}</FormBottom>
        </FormBottomWrapper>
      </AuthWrapperContainer>
    </AuthWrapper>
  );
};
