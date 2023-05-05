import { authSelector } from "@/app/services/features/auth.slice";
import { useAppSelector } from "@/app/services/hook";
import { QRCodeGenerator } from "@/components";
import {
  AuthWrapper,
  AuthWrapperContainer,
  FormTitle,
  QRCodeWrapper,
} from "../Auth.styles";

export const QRScan = () => {
  const { twoFaSetupCode } = useAppSelector(authSelector);

  return (
    <AuthWrapper>
      <AuthWrapperContainer>
        <FormTitle>Scan QR code</FormTitle>
        <QRCodeWrapper>
          <QRCodeGenerator qrValue={twoFaSetupCode} />
        </QRCodeWrapper>
      </AuthWrapperContainer>
    </AuthWrapper>
  );
};
