import { useVerifyOtpMutation } from "@/app/services/endpoints/auth.endpoint";
import { setUserCredentials } from "@/app/services/features/auth.slice";
import { useAppDispatch } from "@/app/services/hook";
import { Button, Input } from "@/components";
import { useForm } from "@/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AuthForm,
  AuthWrapper,
  AuthWrapperContainer,
  FormTitle,
} from "../Auth.styles";

export const VerifyOTP = () => {
  const [handleOtpVerification, { isLoading, isError, isSuccess, data }] =
    useVerifyOtpMutation();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const onVerify = async (data: Record<string, any>) => {
    const { code } = data;
    await handleOtpVerification({
      code,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        setUserCredentials({
          token: data.token,
          user: data.user,
        })
      );
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [isSuccess]);

  const { values, handleChange, handleSubmit } = useForm(onVerify);
  return (
    <AuthWrapper>
      <AuthWrapperContainer>
        <FormTitle>Verify OTP</FormTitle>
        <AuthForm onSubmit={handleSubmit}>
          <Input
            placeholder="Enter OTP"
            type="number"
            name="code"
            labelbg="#fff"
            isError={isError}
            onChange={handleChange}
            value={values["code"] || ""}
            required
          />
          <Button
            text={isLoading ? "Loading" : "Confirm"}
            type="submit"
            margin="20px 0px 0px 0px"
          />
        </AuthForm>
      </AuthWrapperContainer>
    </AuthWrapper>
  );
};
