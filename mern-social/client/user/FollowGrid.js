import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  gridList: {
    width: '100%',
    height: 220,
  },
  tileText: {
    textAlign: 'center',
    marginTop: 10,
  },
  searchField: {
    margin: theme.spacing(1),
    width: '90%',
  },
}));

export default function FollowGrid(props) {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery(''); // Bersihkan teks pencarian
  };

  // Filter daftar berdasarkan teks pencarian
  const filteredPeople = props.people.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={classes.root}>
      <TextField
        label="Search followers/following"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        className={classes.searchField}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {searchQuery && (
                <IconButton onClick={clearSearch}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
      <GridList cellHeight={160} className={classes.gridList} cols={4}>
        {filteredPeople.map((person, i) => (
          <GridListTile style={{ height: 120 }} key={i}>
            <Link to={'/user/' + person._id}>
              <Avatar
                src={'/api/users/photo/' + person._id}
                className={classes.bigAvatar}
              />
              <Typography className={classes.tileText}>{person.name}</Typography>
            </Link>
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

FollowGrid.propTypes = {
  people: PropTypes.array.isRequired,
};
