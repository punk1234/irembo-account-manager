import { Button, Input } from "../../../components";
import {
  AuthForm,
  AuthWrapper,
  AuthWrapperContainer,
  FormTitle,
} from "../Auth.styles";

export const VerifyOTP = () => {
  const labelBgColor = "var(--white)";

  return (
    <AuthWrapper>
      <AuthWrapperContainer>
        <FormTitle>Verify OTP</FormTitle>
        <AuthForm>
          <Input
            placeholder="Enter OTP"
            type="number"
            name="otp"
            labelbg={labelBgColor}
          />
          <Button text="Confirm" type="submit" margin="20px 0px 0px 0px" />
        </AuthForm>
      </AuthWrapperContainer>
    </AuthWrapper>
  );
};
