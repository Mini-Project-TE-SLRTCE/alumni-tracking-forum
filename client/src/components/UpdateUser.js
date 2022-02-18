import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, updateUser } from '../reducers/userReducer';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import "yup-phone";

import { TextInput } from './FormikMuiFields';
import { notify } from '../reducers/notificationReducer';
import AlertMessage from './AlertMessage';
import getErrorMsg from '../utils/getErrorMsg';

import {
  Button,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { useAuthStyles } from '../styles/muiStyles';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import FaceIcon from '@material-ui/icons/Face';
import CallIcon from '@material-ui/icons/Call';

const validationSchemaUpdate = yup.object({
  username: yup
    .string()
    .required('Required')
    .max(20, 'Must be at most 20 characters')
    .min(3, 'Must be at least 3 characters')
    .matches(
      /^[a-zA-Z0-9-_]*$/,
      'Only alphanumeric characters allowed, no spaces/symbols'
    ),
  name: yup
    .string()
    .required('Required'),
  password: yup
    .string()
    .required('Required')
    .min(6, 'Must be at least 6 characters'),
  email: yup
    .string()
    .email('Invalid email')
    .required('Required'),
  phoneNumber: yup
    .string()
    .matches(/^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/, "Invalid phone number")
  // TODO: fix phone validation
});

const UpdateUser = () => {
  const dispatch = useDispatch();
  const [authType, setAuthType] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const classes = useAuthStyles(authType)();

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      await dispatch(updateUser(values));
      dispatch(
        notify(
          `Welcome, ${values.name}. You've been successfully registered.`,
          'success'
        )
      );
    } catch (err) {
      setSubmitting(false);
      setError(getErrorMsg(err));
    }
  };

  return (
    <div>
      <div className={classes.authWrapper}>
        <Formik
          validateOnChange={true}
          initialValues={{ username: '', password: '' }}
          onSubmit={handleUpdate}
          validationSchema={
            validationSchemaUpdate
          }
        >
          {({ isSubmitting }) => (
            <>
              <Form className={classes.form}>
                <Typography
                  variant="h5"
                  color="secondary"
                  className={classes.formTitle}
                >
                  Update details
                </Typography>

                <div className={classes.input}>
                  <PersonIcon className={classes.inputIcon} color="primary" />
                  <TextInput
                    name="username"
                    type="text"
                    placeholder="Enter username"
                    label="Username"
                    required
                    fullWidth
                  />
                </div>

                <div className={classes.input}>
                  <FaceIcon className={classes.inputIcon} color="primary" />
                  <TextInput
                    name="name"
                    type="text"
                    placeholder="Enter name"
                    label="Name"
                    required
                    fullWidth
                  />
                </div>

                <div className={classes.input}>
                  <AlternateEmailIcon className={classes.inputIcon} color="primary" />
                  <TextInput
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    label="Email"
                    required
                    fullWidth
                  />
                </div>

                <div className={classes.input}>
                  <CallIcon className={classes.inputIcon} color="primary" />
                  <TextInput
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    label="Phone number"
                    required
                    fullWidth
                  />
                </div>

                <div className={classes.input}>
                  <LockIcon className={classes.inputIcon} color="primary" />
                  <TextInput
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter password"
                    label="Password"
                    required
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPass((prevState) => !prevState)
                            }
                          >
                            {showPass ? (
                              <VisibilityOffIcon color="primary" />
                            ) : (
                              <VisibilityIcon color="primary" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                <div className={classes.input}>
                  <CallIcon className={classes.inputIcon} color="primary" />
                  <TextInput
                    name="batch"
                    type="text"
                    placeholder="Enter batch"
                    label="Batch"
                    required
                    fullWidth
                  />
                </div>

                <div className={classes.input}>
                  <CallIcon className={classes.inputIcon} color="primary" />
                  <TextInput
                    name="branch"
                    type="text"
                    placeholder="Enter branch"
                    label="Branch"
                    required
                    fullWidth
                  />
                </div>

                <div className={classes.input}>
                  <CallIcon className={classes.inputIcon} color="primary" />
                  <TextInput
                    name="role"
                    type="text"
                    placeholder="Enter role"
                    label="Role"
                    required
                    fullWidth
                  />
                </div>

                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  size="large"
                  startIcon={
                    authType === 'login' ? <ExitToAppIcon /> : <PersonAddIcon />
                  }
                  className={classes.submitButton}
                  disabled={isSubmitting}
                >
                  {authType === 'login'
                    ? isSubmitting
                      ? 'Logging In'
                      : 'Login'
                    : isSubmitting
                      ? 'Signing Up'
                      : 'Sign Up'}
                </Button>
              </Form>

              <Divider
                orientation="vertical"
                flexItem
                className={classes.divider}
              />

              <div className={classes.sidePanel}>
                <Typography
                  variant="h6"
                  className={classes.switchText}
                  color="primary"
                >
                  {authType === 'login'
                    ? `Don't have an account?`
                    : 'Already have an account?'}
                </Typography>

                <Button
                  onClick={() =>
                    authType === 'login'
                      ? setAuthType('signup')
                      : setAuthType('login')
                  }
                  fullWidth
                  size="large"
                  color="primary"
                  variant="outlined"
                  startIcon={
                    authType === 'login' ? <PersonAddIcon /> : <ExitToAppIcon />
                  }
                  disabled={isSubmitting}
                >
                  {authType === 'login' ? 'Sign Up' : 'Login'}
                </Button>
              </div>
            </>
          )}
        </Formik>
      </div>
      <div>
        <AlertMessage
          error={error}
          severity="error"
          clearError={() => setError(null)}
        />
      </div>
    </div>
  );
};

export default UpdateUser;
