import React,{ useEffect, useState } from 'react'
import { Row ,Col, List, Avatar, message } from 'antd';
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscriber from './Sections/Subscriber';
import Comments from './Sections/Commnets';
import LikeDislike from './Sections/LikeDislike';
import './VideoDetail.css';

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  
  
  
  const [Video, setVideo] = useState([]);

  const [CommentList,setCommentList] = useState([]);

  const variable = { videoId: videoId }

  useEffect(() => {
    axios.post('/api/video/getVideoDetail', variable)
    .then( res => {
      if(res.data.success){
        console.log(res.data.video)
        setVideo(res.data.videoDetail)
      }else{
        message.success('비디오정보를 가져오는데 실패하였습니다.')
      }
    })
    
    axios.post('/api/comment/getComments', variable)
    .then( res => {
      if(res.data.success){
        console.log(res.data.comments)
        setCommentList(res.data.comments)
      }else{
        alert('정보가져오기 실패');
      }
    })
    
    
  }, [])

  const updateComment = (newComment) => {
    setCommentList(CommentList.concat(newComment))
  }

  if(Video.writer){

    const subscribeButton =  Video.writer._id !== localStorage.getItem('userId') && <Subscriber userTo={Video.writer._id} userFrom={localStorage.getItem('userId')}/>

    return (
      <Row gutter={[16 ,16]}>
        <Col lg={18} xs={24}>
          <div style={{width: '100%', padding: '3rem 4rem'}}>
            <video style={{width: '100%'}} src={`http://localhost:5000/${Video.filePath}`} controls/>
            <List.Item 
              actions={[<LikeDislike video userId={localStorage.getItem('userId')} videoId={videoId} />, subscribeButton]}
            >
              <List.Item.Meta 
                avatar={<Avatar src={Video.writer.image} />}
                title={Video.writer.name}
                description={Video.description}
              />
            </List.Item>

            <Comments updateComment={updateComment} commentList={CommentList} refreshFunction videoId={videoId}/>
          </div>
        </Col>

        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    )
  }else{
    return (
      <div style={{width:'100%', height: '100vh' ,display: 'flex', justifyContent: 'center', alignItems: 'center' , fontSize: '6rem'}}>loading</div>
    )
  }
}

export default VideoDetailPage;
