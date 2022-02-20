import React from 'react';
import { useField } from 'formik';
import { TextField, FormControlLabel, Radio, MenuItem } from '@material-ui/core';

export const TextInput = ({
  select,
  placeholder,
  label,
  type,
  required,
  fullWidth,
  InputProps,
  multiline,
  rows,
  rowsMax,
  variant,
  size,
  disabled,
  options,
  ...props
}) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';

  if (!select) {
    return (
      <TextField
        placeholder={placeholder}
        label={label}
        type={type}
        InputProps={InputProps}
        required={required}
        fullWidth
        multiline={multiline}
        rows={rows}
        rowsMax={rowsMax}
        variant={variant}
        size={size}
        disabled={disabled}
        {...field}
        helperText={errorText}
        error={!!errorText}
      />
    );
  }
  else {
    return (
      <TextField
        select={select}
        placeholder={placeholder}
        label={label}
        type={type}
        InputProps={InputProps}
        required={required}
        fullWidth
        multiline={multiline}
        rows={rows}
        rowsMax={rowsMax}
        variant={variant}
        size={size}
        disabled={disabled}
        {...field}
        helperText={errorText}
        error={!!errorText}
      >
        {
          options.map(item => {
            return (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            )
          })
        }
      </TextField>
    )
  }
};

export const RadioInput = ({ label, ...props }) => {
  const [field] = useField(props);
  return <FormControlLabel {...field} control={<Radio />} label={label} />;
};
