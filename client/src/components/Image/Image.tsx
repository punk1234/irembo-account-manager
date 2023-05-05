import { useState, useEffect } from "react";
import { Container } from "./Image.styles";

interface IImage {
  src: string;
  brokenSrc: string;
}

export const Image = ({ src, brokenSrc, ...rest }: IImage) => {
  const [imgSrc, setImgSrc] = useState(src);
  const handleError = () => {
    setImgSrc(brokenSrc);
  };

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return <Container src={imgSrc} {...rest} onError={handleError} />;
};
