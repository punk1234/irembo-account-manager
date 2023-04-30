import QRCode from "react-qr-code";

interface IQRCodeGenerator {
  qrValue: any
}

export const QRCodeGenerator = ({qrValue}:IQRCodeGenerator ) => {
  return (
    <QRCode value={qrValue}/>
  )
}
