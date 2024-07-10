import React, { useState } from 'react';
import auth from './../auth/auth-helper';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { comment, uncomment } from './api-post.js';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  smallAvatar: {
    width: 25,
    height: 25,
  },
  commentField: {
    width: '96%',
  },
  commentText: {
    backgroundColor: 'white',
    padding: theme.spacing(1),
    margin: `2px ${theme.spacing(2)}px 2px 2px`,
  },
  commentDate: {
    display: 'block',
    color: 'gray',
    fontSize: '0.8em',
  },
  commentDelete: {
    fontSize: '1.6em',
    verticalAlign: 'middle',
    cursor: 'pointer',
  },
}));

export default function Comments(props) {
  const classes = useStyles();
  const [text, setText] = useState('');
  const [replyIndex, setReplyIndex] = useState(-1); // Index komentar yang sedang dibalas
  const jwt = auth.isAuthenticated();

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const addComment = (event, parentId = null) => {
    if (event.keyCode === 13 && text) {
      event.preventDefault();
      const commentData = { text };
      if (parentId) {
        commentData.parentId = parentId;
      }
      comment(
        { userId: jwt.user._id },
        { t: jwt.token },
        props.postId,
        commentData
      ).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setText('');
          props.updateComments(data.comments);
          setReplyIndex(-1); // Reset replyIndex setelah komentar ditambahkan
        }
      });
    }
  };

  const deleteComment = (commentId) => () => {
    uncomment(
      { userId: jwt.user._id },
      { t: jwt.token },
      props.postId,
      commentId
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        props.updateComments(data.comments);
      }
    });
  };

  const startReply = (index) => {
    setReplyIndex(index);
  };

  const commentBody = (item, index) => {
    const isReplying = replyIndex === index;
    return (
      <div>
        <p className={classes.commentText}>
          <Link to={'/user/' + item.postedBy._id}>{item.postedBy.name}</Link>
          <br />
          {item.text}
          <span className={classes.commentDate}>
          {new Date(item.created).toDateString()} | {new Date(item.created).toLocaleTimeString()} |{' '}
            {auth.isAuthenticated().user._id === item.postedBy._id && (
              <Icon
                onClick={deleteComment(item._id)}
                className={classes.commentDelete}
              >
                delete
              </Icon>
            )}
            <Icon
              onClick={() => startReply(index)}
              className={classes.commentDelete}
            >
              reply
            </Icon>
            {isReplying && <span>replied</span>}
          </span>
        </p>
        {isReplying && (
          <TextField
            onKeyDown={(event) => addComment(event, item._id)}
            multiline
            value={text}
            onChange={handleChange}
            placeholder="Reply to this comment..."
            className={classes.replyField}
            margin="normal"
          />
        )}
        {item.comments &&
          item.comments.map((subItem, subIndex) => (
            <div key={subIndex}>
              {commentBody(subItem, subIndex)}
            </div>
          ))}
      </div>
    );
  };

  return (
    <div>
      <CardHeader
        avatar={
          <Avatar
            className={classes.smallAvatar}
            src={'/api/users/photo/' + auth.isAuthenticated().user._id}
          />
        }
        title={
          <TextField
            onKeyDown={addComment}
            multiline
            value={text}
            onChange={handleChange}
            placeholder="Write a comment..."
            className={classes.commentField}
            margin="normal"
          />
        }
        className={classes.cardHeader}
      />
      {props.comments.map((item, index) => (
        <CardHeader
          key={index}
          avatar={
            <Avatar
              className={classes.smallAvatar}
              src={'/api/users/photo/' + item.postedBy._id}
            />
          }
          title={commentBody(item, index)}
          className={classes.cardHeader}
        />
      ))}
    </div>
  );
}

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  updateComments: PropTypes.func.isRequired,
};
