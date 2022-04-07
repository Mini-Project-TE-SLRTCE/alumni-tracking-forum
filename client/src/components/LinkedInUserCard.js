import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar } from '@material-ui/core';

import {
  Paper,
  Link,
} from '@material-ui/core';
import { useUserCardStyles } from '../styles/muiStyles';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

const LinkedInUserCard = ({ link, title }) => {
  const classes = useUserCardStyles();

  if (title.includes('|')) {
    title = title.slice(0, title.indexOf('|') - 1);
  }

  let splittedTitle, name, desc;

  if (title.includes(' - ')) {
    splittedTitle = title.split(' - ');

    name = splittedTitle.shift();

    if (splittedTitle.length >= 1) {
      desc = splittedTitle.join(' • ');
    }
    else {
      desc = '';
    }
  }
  else {
    name = title;
    desc = '';
  }

  return (
    <Paper className={classes.root} variant='outlined'>
      <div className={classes.mainBox}>

        <div className={classes.userDetails}>
          <div className={classes.avatarContainer}>
            <Avatar
              className={classes.avatar}
              style={{
                backgroundColor: 'transparent',
                borderRadius: '0'
              }}
            >
              <LinkedInIcon
                style={{
                  color: '#006192',
                  width: '2cm',
                  height: '2cm'
                }}
              />
            </Avatar>
          </div>

          <div className={classes.details}>
            <div className={classes.name}>
              <Link
                component={RouterLink}
                to={{ pathname: link }}
                target='_blank'
              >
                {name}
              </Link>
            </div>

            <div className={classes.subDetails}>
              {desc}
            </div>
          </div>
        </div>

      </div>
    </Paper>
  );
};

export default LinkedInUserCard;
