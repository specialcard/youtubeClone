import React, { useEffect, useState } from 'react'
import { Card , Icon , Avatar , Col, Typography , Row} from 'antd'
import { FaCode } from "react-icons/fa";
import Axios from 'axios';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';


const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {

    const [Video, setVideo] = useState([]);

    useEffect(() => {
        Axios.get('/api/video/getVideos')
        .then( res => {
            if(res.data.success){
                console.log(res.data)
                setVideo(res.data.videos);
            }else{
                alert('비디오를 로드하는데 실패하였습니다')
            }
        })
    },[]);
    
    

    const renderCards = Video.map( (video,index) => {
        
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60))

    
        return <Col lg={6} md={8} xs={24} key={index} style={{margin: '0 5px'}}>
            <div style={{ position: 'relative' }}>
                <Link to={`/video/${video._id}`}>
                    <img style={{ width: '100%' }} alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
                    <div className="duration"
                        style={{ bottom: 0, right:0, position: 'absolute', margin: '4px', 
                        color: '#fff', backgroundColor: 'rgba(17, 17, 17, 0.8)', opacity: 0.8, 
                        padding: '2px 4px', borderRadius:'2px', letterSpacing:'0.5px', fontSize:'12px',
                        fontWeight:'500', lineHeight:'12px' }}>
                        <span>{minutes} : {seconds}</span>
                    </div>
                </Link>
            </div>
            <br />
            <Meta
                avatar={
                    <Avatar src={video.writer.image} />
                }
                title={video.title}
                description=""
            />
            <span style={{color: 'white'}}>{video.writer.name} </span><br />
            <span style={{ marginLeft: '3rem' }}> {video.views}</span>
            - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
        </Col>
    });

    return (
        <div style={{width: '85%', margin: '3rem auto'}}>
            <Title level={2}> Recommended </Title>
            <hr />
            {renderCards}
        </div>
    )
}

export default withRouter(LandingPage);
