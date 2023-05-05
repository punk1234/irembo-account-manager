import {
  AuthWrapper,
  AuthWrapperContainer,
  FormTitle,
  FormText,
} from "../Auth.styles";

export const PasswordLessConfirmation = () => {
  return (
    <AuthWrapper>
      <AuthWrapperContainer>
        <FormTitle>Confirm Login</FormTitle>
        <FormText>Email Sent. Please check your mail for confirmation</FormText>
      </AuthWrapperContainer>
    </AuthWrapper>
  );
};
