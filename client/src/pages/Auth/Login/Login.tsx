import { useUserLoginMutation } from "@/app/services/endpoints";
import { set2fa } from "@/app/services/features/auth.slice";
import { useAppDispatch } from "@/app/services/hook";
import { Button, Input } from "@/components";
import config from "@/config";
import { useForm } from "@/hooks";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AuthForm,
  AuthWrapper,
  AuthWrapperContainer,
  FormTitle,
  FormText,
  FormBottomWrapper,
  FormBottom,
  Buttons,
} from "../Auth.styles";

export const Login = () => {
  const appName = config.APP_NAME;

  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(false);

  const [handleLogin, { isLoading, isError, isSuccess, data }] =
    useUserLoginMutation();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const onLogin = async (data: Record<string, any>) => {
    const { email, password } = data;
    await handleLogin({
      email,
      password,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        set2fa({
          token: data.token,
          twoFaSetupCode: data.twoFaSetupCode,
        })
      );

      if (!showPasswordInput) {
        navigate("/confirm-login", {
          replace: true,
        });
      } else {
        if (data.twoFaSetupCode) {
          navigate("/qr-scan");
        } else {
          navigate("/verify-otp");
        }
      }
    }
  }, [isSuccess]);

  const { values, handleChange, handleSubmit } = useForm(onLogin);

  return (
    <AuthWrapper>
      <AuthWrapperContainer>
        <FormTitle>Welcome</FormTitle>
        <FormText>Login to {appName}</FormText>
        <AuthForm onSubmit={handleSubmit}>
          <Input
            placeholder="Enter Your Email"
            type="email"
            name="email"
            labelbg="#fff"
            isError={isError}
            onChange={handleChange}
            value={values["email"] || ""}
            required
          />
          {showPasswordInput && (
            <Input
              placeholder="Enter Your Password"
              type="password"
              name="password"
              labelbg="#fff"
              isError={isError}
              onChange={handleChange}
              value={values["password"] || ""}
              required
            />
          )}

          <Buttons>
            <Button
              text={isLoading ? "Loading" : "Passwordless"}
              type="submit"
              disabled={showPasswordInput}
            />
            or
            <Button
              text={isLoading ? "Loading" : "Continue"}
              type={showPasswordInput ? "submit" : "button"}
              onClick={() => {
                if (showPasswordInput) {
                  return;
                } else {
                  values["email"] && setShowPasswordInput(true);
                }
              }}
            />
          </Buttons>
        </AuthForm>
        <FormBottomWrapper>
          <FormBottom to="/signup">Create an account with {appName}</FormBottom>
        </FormBottomWrapper>
      </AuthWrapperContainer>
    </AuthWrapper>
  );
};
