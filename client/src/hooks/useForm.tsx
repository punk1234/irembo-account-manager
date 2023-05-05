import { useState } from "react";

export const useForm = (
  onSubmit: (values: Record<string, string | number | File | null>) => void
) => {
  const [values, setValues] = useState<
    Record<string, string | number | File | null>
  >({});

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    setValues({
      ...values,
      [name]: files ? files[0] : value,
    });

    if (files) setSelectedFile(files[0]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return { values, selectedFile, handleChange, handleSubmit };
};
