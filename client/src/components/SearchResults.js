import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchResults,
  toggleUpvote,
  toggleDownvote,
  loadSearchPosts,
} from '../reducers/searchReducer';
import { notify } from '../reducers/notificationReducer';
import PostCard from './PostCard';
import UserCard from './UserCard';
import LinkedInUserCard from './LinkedInUserCard';
import LoadMoreButton from './LoadMoreButton';
import LoadingSpinner from './LoadingSpinner';
import getErrorMsg from '../utils/getErrorMsg';

import { Container, Paper, Typography, Tab, Tabs } from '@material-ui/core';
import { useSearchPageStyles } from '../styles/muiStyles';
import SearchIcon from '@material-ui/icons/Search';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

const SearchResults = () => {
  const classes = useSearchPageStyles();
  const { query } = useParams();
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.search);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showSearchResultsOf, setShowSearchResultsOf] = useState('all');
  const [value, setValue] = useState(0);

  useEffect(() => {
    const getSearchResults = async () => {
      try {
        setPageLoading(true);
        await dispatch(setSearchResults(query));
        setPageLoading(false);
      } catch (err) {
        dispatch(notify(getErrorMsg(err), 'error'));
      }
    };
    getSearchResults();
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  if (!searchResults || pageLoading) {
    return (
      <Container disableGutters>
        <Paper variant="outlined" className={classes.mainPaper}>
          <LoadingSpinner text={'Searching for matches...'} />
        </Paper>
      </Container>
    );
  }

  const handleLoadPosts = async () => {
    try {
      setLoadingMore(true);
      await dispatch(loadSearchPosts(query, page + 1));
      setPage((prevState) => prevState + 1);
      setLoadingMore(false);
    } catch (err) {
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  document.title = `${query} - Search Results - Alumni Community`;

  return (
    <Container disableGutters>
      <Paper variant="outlined" className={classes.mainPaper}>
        <Paper variant="outlined">
          <Typography
            variant="h6"
            color="secondary"
            className={classes.infoPaper}
          >
            <SearchIcon fontSize="large" style={{ marginRight: '7px' }} />
            Showing search results for "{query}"
          </Typography>
        </Paper>

        <Paper className={classes.root}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab
              label="All"
              onClick={() => setShowSearchResultsOf('all')}
            />
            <Tab
              label="Registered"
              onClick={() => setShowSearchResultsOf('registered')}
            />
            <Tab
              label="LinkedIn"
              onClick={() => setShowSearchResultsOf('linkedin')}
            />
            <Tab
              label="Posts"
              onClick={() => setShowSearchResultsOf('posts')}
            />
          </Tabs>
        </Paper>

        <span className={classes.spanStyle} />

        {(showSearchResultsOf === 'all' || showSearchResultsOf === 'registered') && (searchResults.userResults.length !== 0 ? (
          searchResults.userResults.map((s) => (
            <UserCard
              avatar={s.avatar}
              username={s.username}
              name={s.name}
              role={s.role}
              branch={s.branch}
              batch={s.batch}
              linkedinUsername={s.linkedinUsername}
            />
          ))
        ) : (
          <Typography variant="h5" className={classes.noResults}>
            <SentimentVeryDissatisfiedIcon
              className={classes.sorryIcon}
              color="primary"
            />
            Sorry, there are no users registered with name "{query}".
          </Typography>
        ))}

        {
          (showSearchResultsOf === 'all' || showSearchResultsOf === 'registered') &&
          <span className={classes.spanStyle} />
        }

        {(showSearchResultsOf === 'all' || showSearchResultsOf === 'linkedin') && (searchResults.googleUserResults.length !== 0 ? (
          searchResults.googleUserResults.map((s) => (
            <LinkedInUserCard
              link={s.link}
              title={s.title}
            />
          ))
        ) : (
          <Typography variant="h5" className={classes.noResults}>
            <SentimentVeryDissatisfiedIcon
              className={classes.sorryIcon}
              color="primary"
            />
            Sorry, we are unable fetch results from LinkedIn for "{query}".
          </Typography>
        ))}

        {
          (showSearchResultsOf === 'all' || showSearchResultsOf === 'linkedin') &&
          <span className={classes.spanStyle} />
        }

        {(showSearchResultsOf === 'all' || showSearchResultsOf === 'posts') && (searchResults.postResults.length !== 0 ? (
          searchResults.postResults.map((s) => (
            <PostCard
              key={s.id}
              post={s}
              toggleUpvote={toggleUpvote}
              toggleDownvote={toggleDownvote}
            />
          ))
        ) : (
          <Typography variant="h5" className={classes.noResults}>
            <SentimentVeryDissatisfiedIcon
              className={classes.sorryIcon}
              color="primary"
            />
            Sorry, there were no post results for "{query}".
          </Typography>
        ))}

        {'next' in searchResults && (
          <LoadMoreButton
            handleLoadPosts={handleLoadPosts}
            loading={loadingMore}
          />
        )}
      </Paper>
    </Container>
  );
};

export default SearchResults;
