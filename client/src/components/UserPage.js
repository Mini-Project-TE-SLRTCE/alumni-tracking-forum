import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, loadUserPosts } from '../reducers/userPageReducer';
import { notify } from '../reducers/notificationReducer';
import { getCircularAvatar } from '../utils/cloudinaryTransform';
import UpdateUser from './UpdateUser';
import UserPostCard from './UserPostCard';
import ErrorPage from './ErrorPage';
import LoadMoreButton from './LoadMoreButton';
import LoadingSpinner from './LoadingSpinner';
import getErrorMsg from '../utils/getErrorMsg';
import stringToColor from '../utils/stringtoColor';

import {
  Container,
  Paper,
  useMediaQuery,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent
} from '@material-ui/core';
import { useUserPageStyles } from '../styles/muiStyles';
import { useTheme } from '@material-ui/core/styles';
import CakeIcon from '@material-ui/icons/Cake';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';

import '../styles/profile.css';

const UserPage = () => {
  const classes = useUserPageStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const { username } = useParams();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userPage);
  const user = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [updateDialog, setUpdateDialog] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        await dispatch(fetchUser(username));
        setPageLoading(false);
      } catch (err) {
        setPageError(getErrorMsg(err), 'error');
      }
    };
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  if (pageError) {
    return (
      <Container disableGutters>
        <Paper variant="outlined" className={classes.mainPaper}>
          <ErrorPage errorMsg={pageError} />
        </Paper>
      </Container>
    );
  }

  if (!userInfo || pageLoading) {
    return (
      <Container disableGutters>
        <Paper variant="outlined" className={classes.mainPaper}>
          <LoadingSpinner text="Fetching user data..." />
        </Paper>
      </Container>
    );
  }

  const {
    avatar,
    name,
    email,
    phoneNumber,
    username: userName,
    batch,
    branch,
    role,
    createdAt,
    posts,
    totalComments,
    karmaPoints,
  } = userInfo.userDetails;

  const handleLoadPosts = async () => {
    try {
      setLoadingMore(true);
      await dispatch(loadUserPosts(username, page + 1));
      setPage((prevState) => prevState + 1);
      setLoadingMore(false);
    } catch (err) {
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  return (
    <Container disableGutters>
      <Paper elevation={0} className={classes.mainPaper}>
        <div className='p-cnt'>
          <div className='p-edit-btn'>
            <Button
              variant="contained"
              color="secondary"
              style={{ textTransform: "initial" }}
              onClick={() => setUpdateDialog(!updateDialog)}
            >
              Edit Profile
            </Button>
          </div>

          <center>
            {avatar && avatar.exists ? (
              <Avatar
                alt={userName}
                src={getCircularAvatar(avatar.imageLink)}
                className={classes.avatar}
              />
            ) : (
              <Avatar
                style={{ backgroundColor: stringToColor(username[0]) }}
                className={classes.avatar}
              >
                <h1>{userName[0].toUpperCase()}</h1>
              </Avatar>
            )}
          </center>

          <h1>{name}</h1>

          {(role !== null && branch !== null && batch !== null) &&
            <Typography variant="subtitle2">
              {role[0].toUpperCase() + role.slice(1,)} •&nbsp;
              {branch.toUpperCase()} •&nbsp;
              {batch}
            </Typography>
          }

          <div className='profile-details-1-cnt'>
            <div className='profile-details-1'>
              <CakeIcon />&nbsp;
              Joined on {String(new Date(createdAt)).split(' ').slice(1, 4).join(' ')}
            </div>
            <div className='profile-details-1'>
              <EmailIcon />&nbsp;
              <a href={`mailto:${email}`}>{email}</a>
            </div>
            <div className='profile-details-1'>
              <PhoneIcon />&nbsp;
              <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
            </div>
          </div>

          <div className='profile-details-2-cnt'>
            <div className='profile-details-2'>
              <strong>{posts.length}</strong><br />
              Posts
            </div>

            <div className='profile-details-2'>
              <strong>{totalComments}</strong><br />
              Comments
            </div>

            <div className='profile-details-2'>
              <strong>{karmaPoints.commentKarma + karmaPoints.postKarma}</strong><br />
              Karma
            </div>

            <div className='profile-details-2'>
              <strong>{karmaPoints.postKarma}</strong><br />
              Post Karma
            </div>

            <div className='profile-details-2'>
              <strong>{karmaPoints.commentKarma}</strong><br />
              Comment Karma
            </div>
          </div>
        </div>

        <div className={classes.postsPaper}>
          {userInfo.posts.results.length !== 0 ? (
            userInfo.posts.results.map((p) => (
              <UserPostCard
                key={p.id}
                post={p}
                user={user}
                isMobile={isMobile}
              />
            ))
          ) : (
            <div className={classes.noPosts}>
              <PersonIcon color="primary" fontSize="large" />
              <Typography variant="h5" color="secondary">
                <strong>u/{userName}</strong> has not made any posts yet
              </Typography>
            </div>
          )}
        </div>

        {'next' in userInfo.posts && (
          <LoadMoreButton
            handleLoadPosts={handleLoadPosts}
            loading={loadingMore}
          />
        )}
      </Paper>

      {/* dialog box to update user details */}
      <Dialog open={updateDialog} onClose={() => setUpdateDialog(false)}>
        <DialogTitle>Update Details</DialogTitle>

        <DialogContent>
          <UpdateUser userDetails={userInfo.userDetails} />
        </DialogContent>
      </Dialog>
    </Container >
  );
};

export default UserPage;
