import { useState, useCallback } from 'react';

export const useFormValidation = (validationSchema, initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(async (fieldName, value) => {
    try {
      await validationSchema.validateAt(fieldName, { [fieldName]: value });
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
      return true;
    } catch (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error.message }));
      return false;
    }
  }, [validationSchema]);

  const validateForm = useCallback(async () => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.inner.forEach(err => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  }, [validationSchema, values]);

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, values[name]);
  }, [values, validateField]);

  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    const isValid = await validateForm();
    
    if (isValid) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
    return isValid;
  }, [validateForm, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    validateForm
  };
};