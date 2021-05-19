import React, { useEffect, useState } from 'react';
import SingleComment from './SingleComment';

function ReplyComment(props) {
  const [ state, setState ] = useState(0)
  const [ OpenReply, setOpenReply ] = useState(false)
  
  useEffect(()=>{
    let commentNumber = 0;
    props.commentList.map(comment => {
      if(comment.responseTo === props.parentCommentId){
        commentNumber++
      }

      setState(commentNumber);
    })



  },[props.commentList, props.parentCommentId])

  const renderReplyComment = (parentCommentId) => (
    props.commentList.map((comment, index) => (
      <React.Fragment>
      {
        comment.responseTo === parentCommentId &&

        <div style={{width: '80%', marginLeft: '30px'}}>
          <SingleComment updateComment={props.updateComment} comment={comment} videoId={props.videoId} />
          <ReplyComment updateComment={props.updateComment} parentCommentId={comment._id} commentList={props.commentList} videoId={props.videoId}/>
        </div>
      }
      </React.Fragment>
    ))
  )
  const onHandleChange = () => {
    setOpenReply(!OpenReply)
  }

  return (
    <div>
      {
        state > 0 &&
        <p style={{fontSize: '14px', color: 'white', margin: '0', cursor: 'pointer'}} onClick={onHandleChange}>
          view {state} more comment(s)
        </p>
      }
      
      {OpenReply && renderReplyComment(props.parentCommentId)}
    </div>
  )
}

export default ReplyComment;
