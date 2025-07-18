import React from 'react';
import { TextField } from '@mui/material';

const StyledTextField = ({ 
  select, 
  children, 
  SelectProps = {}, 
  sx = {}, 
  ...props 
}) => {
  // Default styling for both select and regular fields to fix width shift issues
  const defaultSx = {
    // Prevent helperText from causing width expansion
    '& .MuiFormHelperText-root': {
      position: 'absolute',
      bottom: '-20px',
      left: '0',
      right: '0',
      margin: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '0.75rem',
      lineHeight: '1.66',
    },
    // Add bottom margin to accommodate absolutely positioned helperText
    marginBottom: props.error || props.helperText ? '24px' : '0px',
  };

  // Additional styling for select fields
  const selectSx = select ? {
    '& .MuiInputLabel-root': {
      transform: 'translate(14px, 16px) scale(1)',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -9px) scale(0.75)',
      },
    },
    '& .MuiSelect-select': {
      minWidth: '120px',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.87)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
      },
    },
  } : {};

  // Default SelectProps for select fields
  const defaultSelectProps = select ? {
    MenuProps: {
      PaperProps: {
        style: {
          maxHeight: 300,
        },
      },
    },
    displayEmpty: true,
    ...SelectProps,
  } : SelectProps;

  return (
    <TextField
      {...props}
      select={select}
      sx={{
        ...defaultSx,
        ...selectSx,
        ...sx,
      }}
      SelectProps={defaultSelectProps}
    >
      {children}
    </TextField>
  );
};

export default StyledTextField;