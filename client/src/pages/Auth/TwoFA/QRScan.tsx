import { QRCodeGenerator } from "../../../components";
import {
    AuthWrapper,
    AuthWrapperContainer,
    FormTitle,
    QRCodeWrapper
  } from "../Auth.styles";
  
export const QRScan = () => {
  return (
    <AuthWrapper>
    <AuthWrapperContainer>
      <FormTitle>Scan QR code</FormTitle>
      <QRCodeWrapper>
        <QRCodeGenerator qrValue={1234} />
      </QRCodeWrapper>
    </AuthWrapperContainer>
  </AuthWrapper>
  )
}
