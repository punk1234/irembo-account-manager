import { useNavigate } from "react-router-dom";
import {
  QrCodeButton,
  QrCodeContainer,
  QrCodeImage,
} from "./QRCodeGenerator.styles";

interface IQRCodeGenerator {
  qrValue: any;
}

export const QRCodeGenerator = ({ qrValue }: IQRCodeGenerator) => {
  const navigate = useNavigate();

  return (
    <QrCodeContainer>
      <QrCodeImage src={qrValue} />
      <QrCodeButton type="button" onClick={() => navigate("/verify-otp")}>
        Done
      </QrCodeButton>
    </QrCodeContainer>
  );
};
