import React, { useState } from 'react'
import { Comment,Avatar,Button,Input } from 'antd';
import {useSelector} from 'react-redux';
import Axios from 'axios';
import LikeDislike from './LikeDislike';

const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector(state => state.user);
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState('');

  const onClickReply = () => {
    setOpenReply(!OpenReply)
  }

  const onHandleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: CommentValue,
      writer: user.userData._id,
      postId: props.videoId,
      responseTo: props.comment._id,
    }


    Axios.post('/api/comment/saveComment', variables)
    .then( res => {
      if(res.data.success){
        setCommentValue("")
        setOpenReply(!OpenReply)
        props.updateComment(res.data.result)
      }else{
        alert('댓글작성실패')
      }
    })
  }

  const actions = [
    <LikeDislike userId={localStorage.getItem('userId')} commentId={props.comment._id} />
    ,
    <span 
      style={{color: 'white'}} 
      onClick={onClickReply} 
      key="comment-basic-reply-to"
    >
        Reply
    </span>
  ]

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt/>}
        content={<p>{props.comment.content}</p>}
      />
      {OpenReply && 
          <form style={{ display: 'flex'}} onSubmit={onSubmit}>
          <TextArea
            style={{width: '100%', borderRadius: '5px'}}
            onChange={onHandleChange}
            value={CommentValue}
            placeholder= '댓글을 입력해주세요'
          >
          </TextArea>
          <br />
          <button 
            style={{width: '20%' , height: '52px', borderStyle: 'none', backgroundColor: '#1382e3', color: '#dbdbdb', cursor: 'pointer'}} 
            onClick={onSubmit}
          >
            작성
          </button>
        </form>
      }
    </div>
  )
}

export default SingleComment;
