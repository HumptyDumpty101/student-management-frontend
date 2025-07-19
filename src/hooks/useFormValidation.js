import { useState, useCallback, useRef } from 'react';

export const useFormValidation = (validationSchema, initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeoutRef = useRef(null);

  const setNestedValue = (obj, path, value) => {
    const keys = path.split('.');
    const result = { ...obj };
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current) || typeof current[keys[i]] !== 'object') {
        current[keys[i]] = {};
      } else {
        current[keys[i]] = { ...current[keys[i]] };
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    return result;
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const validateField = useCallback(async (fieldName, value) => {
    try {
      // For nested fields, we need to validate with the current values structure
      const testValues = setNestedValue(values, fieldName, value);
      await validationSchema.validateAt(fieldName, testValues);
      setErrors(prev => {
        if (prev[fieldName]) {
          const { [fieldName]: removed, ...rest } = prev;
          return rest;
        }
        return prev;
      });
      return true;
    } catch (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error.message }));
      return false;
    }
  }, [validationSchema, values]);

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
    setValues(prev => setNestedValue(prev, name, value));
    
    // Debounced validation for performance
    if (touched[name]) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        validateField(name, value);
      }, 300);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, getNestedValue(values, name));
  }, [values, validateField]);

  const handleSubmit = useCallback(async (onSubmit) => {
    console.log('Form submission started');
    setIsSubmitting(true);
    
    console.log('Current form values:', values);
    console.log('Current form errors:', errors);
    
    const isValid = await validateForm();
    console.log('Form validation result:', isValid);
    
    if (isValid) {
      try {
        console.log('Calling onSubmit with values:', values);
        await onSubmit(values);
        console.log('Form submission successful');
      } catch (error) {
        console.error('Form submission error:', error);
        setIsSubmitting(false);
        throw error; // Re-throw the error so the form can handle it
      }
    } else {
      console.log('Form validation failed, errors:', errors);
    }
    
    setIsSubmitting(false);
    return isValid;
  }, [validateForm, values, errors]);

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
    validateForm,
    setIsSubmitting,
    getNestedValue: (path) => getNestedValue(values, path)
  };
};