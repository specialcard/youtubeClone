import React, { useEffect, useState } from 'react';
import Axios from 'axios'


function SideVideo() {
  const [sideVidoes, setSideVideos] = useState([]);

  useEffect(() => {
    Axios.get('/api/video/getVideos')
        .then( res => {
            if(res.data.success){
                console.log(res.data)
                setSideVideos(res.data.videos);
            }else{
                alert('비디오를 로드하는데 실패하였습니다')
            }
        })
  },[]);

  const renderSideVideo = sideVidoes.map((video, index) =>  {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor((video.duration - minutes * 60))


    return <div key={index} style={{display: 'flex', marginBottom: '1rem', padding: '0 2rem'}}>
    <div style={{width: '40%', marginRight: '1rem'}}>
      <a href={`/video/${video._id}`}>
        <img style={{width: '100%', height: '100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt={video.title}/>

      </a>
    </div>
    <div style={{width: '50%'}}>
      <a href={`/video/${video._id}`} style={{color: 'white'}}>
        <span style={{fontSize: '1rem', color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}>{video.title}</span>
        <span>{video.writer.naem}</span><br />
        <span>{video.view} views</span><br />
        <span>{minutes} : {seconds}</span>
      </a>
    </div>
  </div>
  })

  return (
    <React.Fragment>
      <div style={{marginTop: '3rem'}}></div>
      {sideVidoes && renderSideVideo}
    </React.Fragment>
  )
}

export default SideVideo;
