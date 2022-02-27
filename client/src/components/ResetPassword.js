import React, { useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPwd } from '../reducers/userReducer';
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
import LockIcon from '@material-ui/icons/Lock';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';

const validationSchemaPassword = yup.object({
  password: yup
    .string()
    .required('Required')
    .min(6, 'Must be at least 6 characters')
});

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const classes = useAuthStyles('login')();

  const handleResetPwd = async (values, { setSubmitting }) => {
    try {
      values.token = token;
      setSubmitting(true);
      await dispatch(resetPwd(values));
      dispatch(
        notify(
          `Password updated. Kindly login.`,
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: 'calc(100vh - 150px)'
        }}
      >
        <Formik
          validateOnChange={true}
          initialValues={{ password: '' }}
          onSubmit={handleResetPwd}
          validationSchema={validationSchemaPassword}
        >
          {({ isSubmitting }) => (
            <Form
              className={classes.form}
            >
              <Typography
                variant="h5"
                color="secondary"
                className={classes.formTitle}
              >
                Update password
              </Typography>

              <div
                className={classes.input}
                style={{ marginTop: '10px' }}
              >
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
                    )
                  }}
                />
              </div>

              <Button
                type="submit"
                color="secondary"
                variant="contained"
                size="large"
                className={classes.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Updating Password'
                  : 'Update Password'}
              </Button>
            </Form>
          )}
        </Formik>
      </div>

      <div
        style={{
          width: '10cm',
          position: 'fixed',
          left: 'calc(50% - 5cm)',
          right: 'calc(50% - 5cm)',
          bottom: '0'
        }}
      >
        <AlertMessage
          error={error}
          severity="error"
          clearError={() => setError(null)}
        />
      </div>
    </div>
  );
}

export default ResetPassword;