import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, signupUser, updateUser } from '../reducers/userReducer';
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
import EmailIcon from '@material-ui/icons/Email';
import FaceIcon from '@material-ui/icons/Face';
import CallIcon from '@material-ui/icons/Call';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import LabelIcon from '@material-ui/icons/Label';
import BookIcon from '@material-ui/icons/Book';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import UpdateIcon from '@material-ui/icons/Update';

const validationSchemaUpdate = yup.object({
  username: yup
    .string()
    .max(20, 'Must be at most 20 characters')
    .min(3, 'Must be at least 3 characters')
    .matches(
      /^[a-zA-Z0-9-_]*$/,
      'Only alphanumeric characters allowed, no spaces/symbols'
    )
    .required(),
  name: yup
    .string()
    .required(),
  email: yup
    .string()
    .email('Invalid email')
    .required(),
  phoneNumber: yup
    .string()
    .matches(/^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/, "Invalid phone number")
    .required(),
  // TODO: fix phone validation
  linkedinUsername: yup
    .string()
    .required(),
  role: yup
    .string()
    .required(),
  branch: yup
    .string()
    .required(),
  batch: yup
    .string()
    .required(),
  password: yup
    .string()
    .min(6, 'Must be at least 6 characters')
});

const UpdateUser = ({ userDetails }) => {
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const classes = useAuthStyles("signup")();

  // arrays to store "option" of "select" elments
  const roleOptions = ["Faculty", "Alumni", "Student"];
  const branchOptions = ["CMPN", "IT", "MECH", "EXTC"];
  const batchOptions = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014"];

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      await dispatch(updateUser(values));
      dispatch(
        notify(
          'Your details have been successfully updated.',
          'success',
          window.location.reload() // after successfull update, it will reload the profile page
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
          initialValues={{
            id: userDetails.id,
            username: userDetails.username,
            name: userDetails.name,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber,
            linkedinUsername: userDetails.linkedinUsername,
            role: userDetails.role,
            branch: userDetails.branch,
            batch: userDetails.batch,
            password: ''
          }}
          onSubmit={handleUpdate}
          validationSchema={validationSchemaUpdate}
        >
          {({ isSubmitting }) => (
            <Form className={classes.form}>
              <div className={classes.input}>
                <PersonIcon className={classes.inputIcon} color="primary" />
                <TextInput
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  label="Username"
                  fullWidth
                  required
                />
              </div>

              <div className={classes.input}>
                <FaceIcon className={classes.inputIcon} color="primary" />
                <TextInput
                  name="name"
                  type="text"
                  placeholder="Enter name"
                  label="Name"
                  fullWidth
                  required
                />
              </div>

              <div className={classes.input}>
                <EmailIcon className={classes.inputIcon} color="primary" />
                <TextInput
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  label="Email"
                  fullWidth
                  required
                />
              </div>

              <div className={classes.input}>
                <CallIcon className={classes.inputIcon} color="primary" />
                <TextInput
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  label="Phone number"
                  fullWidth
                  required
                />
              </div>

              <div className={classes.input}>
                <LinkedInIcon className={classes.inputIcon} color="primary" />
                <TextInput
                  name="linkedinUsername"
                  type="text"
                  placeholder="Enter LinkedIn username"
                  label="LinkedIn username"
                  fullWidth
                  required
                />
              </div>

              <div className={classes.input}>
                <LabelIcon className={classes.inputIcon} color="primary" />
                <TextInput
                  select
                  name="role"
                  type="text"
                  placeholder="Choose your role"
                  label="Role"
                  fullWidth
                  required
                  options={roleOptions}
                />
              </div>

              <div className={classes.input}>
                <BookIcon className={classes.inputIcon} color="primary" />
                <TextInput
                  select
                  name="branch"
                  type="text"
                  placeholder="Choose your branch"
                  label="Branch"
                  fullWidth
                  required
                  options={branchOptions}
                />
              </div>

              <div className={classes.input}>
                <CalendarTodayIcon className={classes.inputIcon} color="primary" />
                <TextInput
                  select
                  name="batch"
                  type="text"
                  placeholder="Choose your batch"
                  label="Batch"
                  fullWidth
                  required
                  options={batchOptions}
                />
              </div>

              <div className={classes.input}>
                <LockIcon className={classes.inputIcon} color="primary" />
                <TextInput
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  label="Password"
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

              <Button
                type="submit"
                color="secondary"
                variant="contained"
                size="large"
                startIcon={<UpdateIcon />}
                className={classes.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating" : "Update"}
              </Button>
            </Form>
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
