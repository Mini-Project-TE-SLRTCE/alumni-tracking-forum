import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import { getCircularAvatar } from '../utils/cloudinaryTransform';
import stringToColor from '../utils/stringtoColor';

import {
  Paper,
  Link
} from '@material-ui/core';
import { useUserCardStyles } from '../styles/muiStyles';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

const UserCard = ({ avatar, username, name, role, branch, batch, linkedinUsername }) => {
  const classes = useUserCardStyles();

  return (
    <Paper className={classes.root} variant='outlined'>
      <div className={classes.mainBox}>

        <div className={classes.userDetails}>
          <div className={classes.avatarContainer}>
            {avatar && avatar.exists ? (
              <Avatar
                alt={username}
                src={getCircularAvatar(avatar.imageLink)}
                className={classes.avatar}
              />
            ) : (
              <Avatar
                style={{ backgroundColor: stringToColor(username[0]) }}
                className={classes.avatar}
              >
                <h1>{username[0].toUpperCase()}</h1>
              </Avatar>
            )}
          </div>

          <div className={classes.details}>
            <div className={classes.name}>
              <Link component={RouterLink} to={`/u/${username}`}>
                {name}
              </Link>
            </div>

            {(role !== null && branch !== null && batch !== null) &&
              <div className={classes.subDetails}>
                {role} • {branch} • {batch}
              </div>
            }
          </div>
        </div>

        <div className={classes.linkedinUsername}>
          <Link
            component={RouterLink}
            to={{ pathname: `https://in.linkedin.com/in/${linkedinUsername}` }}
            target='_blank'
          >
            <LinkedInIcon className={classes.svgIcon} />
          </Link>
        </div>

      </div>
    </Paper>
  );
};

export default UserCard;
