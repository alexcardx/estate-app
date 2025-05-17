import { useState } from "react";
import { postSchema } from "../utils/validationSchema";

export const useFormValidation = (formData) => {
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const result = postSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path.join(".")] = err.message;
      });
      setValidationErrors(fieldErrors);
      return false;
    }
    setValidationErrors({});
    return true;
  };

  return { validationErrors, validate };
};
