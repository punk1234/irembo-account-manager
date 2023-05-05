import { useCreateUserMutation } from "@/app/services/endpoints";
import { Button, Input, Select } from "@/components";
import { useForm } from "@/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const appName = config.APP_NAME;

  const [handleSignup, { isLoading, isSuccess }] = useCreateUserMutation();

  const navigate = useNavigate();

  const onSignup = (data: Record<string, any>) => {
    console.log(data);
    const { email, password, countryCode, firstName, lastName } = data;
    handleSignup({
      email,
      password,
      countryCode,
      firstName,
      lastName,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess]);

  const { values, handleChange, handleSubmit } = useForm(onSignup);
  return (
    <AuthWrapper>
      <AuthWrapperContainer>
        <FormTitle>Sign up on {appName}</FormTitle>
        <FormText>
          Welcome to the {appName} platform! Please enter your details
        </FormText>
        <AuthForm onSubmit={handleSubmit}>
          <Input
            placeholder="Enter Your Email"
            type="email"
            name="email"
            labelbg="#fff"
            isError
            onChange={handleChange}
            value={values["email"] || ""}
            required
          />
          <Input
            placeholder="Enter Your Password"
            type="password"
            name="password"
            labelbg="#fff"
            onChange={handleChange}
            value={values["password"] || ""}
            required
          />
          <Select
            name="countryCode"
            value={values["nationality"]}
            onChange={handleChange}
            options={[
              { label: "Nigeria", value: "NG" },
              { label: "Rwanda", value: "RW" },
            ]}
          />
          <Input
            placeholder="Enter Your First Name"
            type="text"
            name="firstName"
            labelbg="#fff"
            isError
            onChange={handleChange}
            value={values["firstName"] || ""}
            required
          />
          <Input
            placeholder="Enter Your Last Name"
            type="text"
            name="lastName"
            labelbg="#fff"
            isError
            onChange={handleChange}
            value={values["lastName"] || ""}
            required
          />
          <Button
            text={isLoading ? "Loading..." : "Confirm"}
            type="submit"
            margin="20px 0px 0px 0px"
          />
        </AuthForm>
        <FormBottomWrapper>
          <FormBottom to="/login">Continue with {appName}</FormBottom>
        </FormBottomWrapper>
      </AuthWrapperContainer>
    </AuthWrapper>
  );
};
