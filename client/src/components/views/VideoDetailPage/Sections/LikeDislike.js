import React, { useEffect, useState } from 'react'
import {Tooltip, Icon }  from 'antd';
import Axios from 'axios';


function LikeDislike(props) {

  const [Likes , setLikes] = useState(0);
  const [Dislikes , setDislikes] = useState(0);

  const [LikeAction , setLikeAction] = useState(null);
  const [DislikeAction , setDislikeAction] = useState(null);

  let variable = {}

  if(props.video){
    variable = { videoId: props.videoId, userId: props.userId }
  }else{
    variable = { commentId: props.commentId, userId: props.userId }
  }

  useEffect(()=>{
    //좋아요정보
    Axios.post('/api/like/getLikes', variable)
    .then( res => {
      if(res.data.success){
        //얼마나 많은 좋아요를 받았는지 
        setLikes(res.data.likes.length);
        console.log(res.data.likes.length);
        // 내가 이미 그 좋아요를 눌렀는지

        res.data.likes.map(like =>{
          if(like.userId === props.userId){
            setLikeAction('liked');
          }
        });
      }else{
        alert('Likes에 정보를 가져오는데 실패하였습니다');
      }
    })
    
    //싫어요 정보
    Axios.post('/api/like/getDislikes', variable)
    .then( res => {
      if(res.data.success){
        //얼마나 많은 싫어요를 받았는지 
        setDislikes(res.data.dislikes.length);
        console.log(res.data.dislikes.length);
        // 내가 이미 그 싫어요를 눌렀는지

        res.data.dislikes.map(dislike =>{
          if(dislike.userId === props.userId){
            setDislikeAction('Disliked');
          }
        });
      }else{
        alert('DisLikes에 정보를 가져오는데 실패하였습니다');
      }
    })
    console.log('ihd')
  },[LikeAction,DislikeAction])

  const onLike = () => {
    if(LikeAction === null){
      Axios.post('/api/like/upLike', variable)
      .then( res =>{
        if(res.data.success){
          setLikes(Likes + 1);
          setLikeAction('Liked');
          if(DislikeAction !== null){
            setDislikeAction(null)
            setDislikes(Dislikes - 1);
          }
        }else{
          alert('좋아요 실패')
        }
      })
    }else{
      Axios.post('/api/like/unLike', variable)
      .then( res =>{
        if(res.data.success){
          setLikes(Likes - 1);
          setLikeAction(null)
        }else{
          alert('좋아요 실패')
        }
      })
    }
  }


  const onDislike = () => {
    if(DislikeAction !== null){
      Axios.post('/api/like/unDislike', variable)
      .then( res => {
        if(res.data.success){
          setDislikes(Dislikes - 1);
          setDislikeAction(null)
        }else{
          alert('싫어요를 지우지 못하였습니다')
        }
      });
    }else{
      Axios.post('/api/like/upDislike', variable)
      .then( res => {
        if(res.data.success){
          setDislikes(Dislikes + 1);
          setDislikeAction('disliked')

          if(LikeAction !== null){
            setLikeAction(null)
            setLikes(Likes - 1);
          }

        }else{
          alert('좋아요를 지우지 못하였습니다')
        }
      });
    }
  }

  return (
    <React.Fragment>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            
            type="like"
            theme={LikeAction === 'liked' ? 'filled': 'outlined'}
            onClick={onLike}
          />
        <span style={{padding: '8px', cursor: 'auto'}}> {Likes} </span>
        </Tooltip>
      </span>
      &nbsp;&nbsp;
      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={DislikeAction === 'Disliked' ? 'filled': 'outlined'}
            onClick={onDislike}
          />
        <span style={{padding: '8px', cursor: 'auto'}}> {Dislikes} </span>
        </Tooltip>
      </span>
    </React.Fragment>
  )
}

export default LikeDislike
