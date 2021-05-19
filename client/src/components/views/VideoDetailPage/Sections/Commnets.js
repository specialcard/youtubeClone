import React, { useState } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';


function Commnets(props) {
  const user = useSelector(state => state.user);

  const [commentValue, setCommentValue] = useState("");

  const handleClick = e => {
    setCommentValue(e.currentTarget.value);
  }
  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id,
      postId: props.videoId,
    }


    Axios.post('/api/comment/saveComment', variables)
    .then( res => {
      if(res.data.success){
        setCommentValue("")
        props.updateComment(res.data.result)
      }else{
        alert('댓글작성실패')
      }
    })
  }
  return (
    <div>
      <p>댓글</p>
      <hr />
      {props.commentList && props.commentList.map((comment , index)=>(
        (!comment.responseTo &&
          <React.Fragment key={index}>
            <SingleComment updateComment={props.updateComment} comment={comment} videoId={props.videoId} user={user}/>
            <ReplyComment updateComment={props.updateComment} parentCommentId={comment._id} commentList={props.commentList} videoId={props.videoId} user={user}/>
          </React.Fragment> 
        )
      ))}

      

      <form style={{ display: 'flex'}} onSubmit={onSubmit}>
        <textarea
          style={{width: '100%', borderRadius: '5px'}}
          onChange={handleClick}
          value={commentValue}
          placeholder= '댓글을 입력해주세요'
        >
        </textarea>
        <button 
          style={{width: '20%' , height: '52px', borderStyle: 'none', backgroundColor: '#1382e3', color: '#dbdbdb', cursor: 'pointer'}} 
          onClick={onSubmit}
        >
          작성
        </button>
      </form>
    </div>
  )
}

export default Commnets;
