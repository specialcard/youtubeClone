import React,{useState} from 'react'
import { Typography , Button , Form, message, Input, Icon} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import {useSelector} from 'react-redux';
import { withRouter } from 'react-router-dom';

const Title = Typography;

const PrivateOptions = [
  {
    value: 0,
    label: 'private'
  },
  {
    value: 1,
    label: 'public'
  }
]

const CategoryOptions = [
  {
    value: 0,
    label: 'film & Animation',
  },
  {
    value: 1,
    label: 'Autos & Vehicles',
  },
  {
    value: 2,
    label: 'Music',
  },
  {
    value: 3,
    label: 'Pets & Animals',
  }
]

function VideoUploadPage({history}) {
  // redux useSelector => state에 있는 유저 정보가져오기
  const user = useSelector(state => state.user)
  const [state, setState] = useState({
    VideoTitle: '',
    Description: '',
  })
  const [Privicy, setPrivicy] = useState(0);
  const [Category, setCategory] = useState('Film & Animation');
  const [FilePath , setFilePath] = useState("");
  const [Duration , setDuration] = useState("");
  const [ThumbnailPath , setThumbnailPath] = useState("");

  const { VideoTitle, Description } = state;
  const onChange = text => e => {
    setState({
      ...state,
      [text]: e.target.value,
    })
  }
  const onSubmit = (e) => {
    e.preventDefault();

    let variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      pravicy: Privicy,
      filePath: FilePath,
      categroy: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    }
    console.log(variables.write)
    if(VideoTitle === '' && Description === ''){
      alert('타이틀과 설명을 적으세요')
    }else{
        Axios.post('/api/video/uploadVideo', variables)
        .then( res => {
        if(res.data.success){
          message.success('정상적으로 업로드를 하였습니다.')
          window.setTimeout(()=>{
            history.push('/');
          },2500)
        }else{

        }
      })
    }
    
  }

  const onDrop = (files) => {
    let formData = new FormData();

    const config = {
      header: { 'content-type' : 'multipart/form-data' }
    }
    formData.append('file', files[0])

    Axios.post('/api/video/uploadfiles', formData, config)
    .then(res => {
      if(res.data.success){
        console.log(res.data)
        let variable = {
          filePath: res.data.filePath,
          fileName: res.data.fileName
        }

        setFilePath(res.data.filePath)

        Axios.post('/api/video/thumbnail', variable)
        .then( res => {
          if(res.data.success){
            console.log(res.data);
            setDuration(res.data.fileDuration);
            setThumbnailPath(res.data.thumbsFilePath);
          }else{
            alert('썸네일 생성에 실패 하셨습니다.')
          }
        });
      }else{
        console.log('파일업로드의 실패하였습니다.');
      }
    }).catch(e => console.log('에러', e))
  }

  

  return (
    <div style={{maxWidth: '700px', margin: '2rem auto'}}>
      <div style={{ textAlign: 'center', marginBottom: '2rem'}}>
        <Title level={2}>Upload Your Video</Title>
        <Form onSubmit={onSubmit}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            {/* Drop zone */}
            <Dropzone 
              onDrop={onDrop}
              multiple={false}
              maxSzie={10000000000000}
            >
              {({getRootProps, getInputProps})=>(
                <div style={{
                  width: '300px', 
                  height: '240px', 
                  border: '1px solid lightgray', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  }} {...getRootProps()}>
                    <input {...getInputProps()}/>
                    <Icon type="plus" style={{fontSize: '3rem'}}/>
                </div>
              )}
            </Dropzone>
            {/* Thumbnail */}
            {ThumbnailPath && 
              <div>
                <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
              </div>
            }
            
          </div>
          <br />
          <br />
          <label>Title</label>
          <Input 
            onChange={onChange('VideoTitle')} 
            value={VideoTitle}
          />
          <br />
          <br />
          <label>Description</label>
          <TextArea
            onChange={onChange('Description')}
            value={Description}
          />
          <br />
          <br />
          <select onChange>
            {PrivateOptions.map((item ,index)=>(
              <option key={index} value={item.value}>{item.label}</option>
            ))}
          </select>
          <select onChange>
            {CategoryOptions.map((item , index)=>(
              <option key={index} value={item.value}>{item.label}</option>
            ))}
          </select>

          <Button type="primary" size="large" onClick={onSubmit}>
            Submit
          </Button>
        </Form>
      </div>
      
    </div>
  )
}

export default withRouter(VideoUploadPage);
