import { message } from 'antd'
import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom';

function Subscriber(props) {
  const userTo = props.userTo
  const userFrom = props.userFrom
  const [ SubscriNumber ,setSubscriNumber] = useState(0)
  const [ Subscribed ,setSubscribed] = useState(false)
  
  

  useEffect(()=>{
    const subscribeNumberVariables = { userTo: userTo, userFrom: userFrom }
    Axios.post('/api/subscriber/subscriberNumber', subscribeNumberVariables)
    .then( res => {
      if(res.data.success){
        setSubscriNumber(res.data.subscriberNumber)
      }else{
        message.success('구독자수 정보를 가져오는데 실패하였습니다.')
      }
    })
    // subscribed

    Axios.post('/api/subscriber/subscribed', subscribeNumberVariables)
    .then( res => {
      if(res.data.success){
        setSubscribed(res.data.subscribed)
      }else{

      }
    }).catch(e => console.log(e))
  },[])

  const onSubscribe = () => {
    const userLogin = window.localStorage.getItem('userId');
    let subscribedVariable = {
      userTo: userTo,
      userFrom: userFrom,
    }
    
    if(userLogin){
      if(Subscribed){
        //이미 구독중이라면
        Axios.post('/api/subscriber/unSubscribe', subscribedVariable)
        .then( res => {
          if(res.data.success){
            setSubscriNumber(SubscriNumber - 1)
            setSubscribed(!Subscribed)
          }else{
            alert('구독 취소를 실패하였습니다.')
          }
        })
      }else{
        //구독중이 아니라면
        Axios.post('/api/subscriber/subscribe', subscribedVariable)
        .then( res => {
          if(res.data.success){
            setSubscriNumber(SubscriNumber + 1)
            setSubscribed(!Subscribed)
          }else{
            alert('구독에 실패하였습니다.')
          }
        })
      }
    }else{
      message.success('구독을 하실려면 로그인이 필요합니다.');
      setTimeout(()=>{
        props.history.push('/login');
      }, 2000);
    }
  }

 

  
  return (
    <div>
      <span style={{fontSize: '1rem', fontWeight:'bold', color: 'white', marginRight: '1rem'}}>
        구독자 {SubscriNumber} 명
      </span>
      <button 
        style={{background: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px', color: 'white', padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase', borderStyle: 'none'}}
        onClick={onSubscribe}
      >
        {SubscriNumber === 1 ? '':'이컨텐츠를'} {!Subscribed ? '구독' : '구독중'}
      </button>
    </div>
  )
}

export default withRouter(Subscriber);
