import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, signupUser, forgotPwd } from '../reducers/userReducer';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

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
import EmailIcon from '@material-ui/icons/Email';
import FaceIcon from '@material-ui/icons/Face';
import CallIcon from '@material-ui/icons/Call';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

const validationSchemaSignup = yup.object({
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
    .required('Required'),
  linkedinUsername: yup
    .string()
    .required('Required'),
});

const validationSchemaLogin = yup.object({
  username: yup.string().required('Required'),
  password: yup.string().required('Required')
});

const validationSchemaForgotPwd = yup.object({
  email: yup
    .string()
    .email('Invalid email')
    .required('Required')
});

const AuthForm = () => {
  const dispatch = useDispatch();
  const [authType, setAuthType] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const classes = useAuthStyles(authType === 'signup' ? 'signup' : 'login')();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      await dispatch(loginUser(values));
      dispatch(
        notify(`Welcome, ${values.username}. You're logged in!`, 'success')
      );
    } catch (err) {
      setSubmitting(false);
      setError(getErrorMsg(err));
    }
  };

  const handleSignup = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      await dispatch(signupUser(values));
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

  const handleForgotPwd = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      await dispatch(forgotPwd(values));
      dispatch(
        notify(
          `Password reset link has been sent to ${values.email}.`,
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
          initialValues={{ username: '', name: '', email: '', phoneNumber: '', linkedinUsername: '', password: '' }}
          onSubmit={authType === 'login' ? handleLogin : authType === 'forgotPwd' ? handleForgotPwd : handleSignup}
          validationSchema={
            authType === 'login'
              ? validationSchemaLogin
              : authType === 'forgotPwd'
                ? validationSchemaForgotPwd
                : validationSchemaSignup
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
                  {authType === 'login'
                    ? 'Login to your account'
                    : authType === 'forgotPwd'
                      ? 'Forgot password'
                      : 'Create a new account'}
                </Typography>

                {
                  authType !== 'forgotPwd' ? (
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
                  ) : ''
                }

                {
                  authType === 'signup' ? (
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
                  ) : ''
                }

                {
                  authType !== 'login' ? (
                    <div className={classes.input}>
                      <EmailIcon className={classes.inputIcon} color="primary" />
                      <TextInput
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        label="Email"
                        required
                        fullWidth
                      />
                    </div>
                  ) : ''
                }

                {
                  authType === 'signup' ? (
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
                  ) : ''
                }

                {
                  authType === 'signup' ? (
                    <div className={classes.input}>
                      <LinkedInIcon className={classes.inputIcon} color="primary" />
                      <TextInput
                        name="linkedinUsername"
                        type="text"
                        placeholder="Enter LinkedIn username"
                        label="LinkedIn username"
                        required
                        fullWidth
                      />
                    </div>
                  ) : ''
                }

                {
                  authType !== 'forgotPwd' ? (
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
                  ) : ''
                }

                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  size="large"
                  startIcon={
                    authType === 'login' ? <ExitToAppIcon /> :
                      authType === 'forgotPwd' ? <EmailIcon /> : <PersonAddIcon />
                  }
                  className={classes.submitButton}
                  disabled={isSubmitting}
                >
                  {authType === 'login'
                    ? isSubmitting
                      ? 'Logging In'
                      : 'Login'
                    : authType === 'forgotPwd'
                      ? isSubmitting
                        ? 'Sending Reset Link'
                        : 'Send Reset Link'
                      : isSubmitting
                        ? 'Signing Up'
                        : 'Sign Up'}
                </Button>

                {
                  authType !== 'signup' ? (
                    authType === 'login' ? (
                      <a
                        className={classes.forgotPwdLink}
                        href="#"
                        onClick={() => setAuthType('forgotPwd')}
                      >
                        Forgot Password?
                      </a>
                    ) : (
                      <a
                        className={classes.forgotPwdLink}
                        href="#"
                        onClick={() => setAuthType('login')}
                      >
                        Login?
                      </a>
                    )
                  ) : ''
                }
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
                  {authType !== 'signup'
                    ? `Don't have an account?`
                    : 'Already have an account?'}
                </Typography>

                <Button
                  onClick={() =>
                    authType !== 'signup'
                      ? setAuthType('signup')
                      : setAuthType('login')
                  }
                  fullWidth
                  size="large"
                  color="primary"
                  variant="outlined"
                  startIcon={
                    authType !== 'signup' ? <PersonAddIcon /> : <ExitToAppIcon />
                  }
                  disabled={isSubmitting}
                >
                  {authType !== 'signup' ? 'Sign Up' : 'Login'}
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
    </div >
  );
};

export default AuthForm;
