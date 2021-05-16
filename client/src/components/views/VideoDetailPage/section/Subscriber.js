import { message } from 'antd'
import Axios from 'axios'
import React, { useEffect, useState } from 'react'

function Subscriber(props) {
  const [ Subscriber ,setSubscriber] = useState(0)
  const [ Subscribed ,setSubscribed] = useState(false)
  useEffect(()=>{
    //subscriberNumber
    let variable = {
      userTo: props.userTo,
    }

    Axios.post('/api/subscriber/subscriberNumber', variable)
    .then( res => {
      if(res.data.success){
        setSubscriber(res.data.subscriberNumber)
      }else{
        message.success('구독자수 정보를 가져오는데 실패하였습니다.')
      }
    })
    // subscribed
    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem('userId')
    }

    Axios.post('/api/subscriber/subscribed', subscribedVariable)
    .then( res => {
      if(res.data.success){
        setSubscribed(res.data.subscribed)
      }else{

      }
    }).catch(e => console.log(e))
  },[])  

  const onSubscribe = (e) => {
    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    }
    
    if(Subscribed){
      //이미 구독중이라면
      Axios.post('/api/subscriber/unSubscribe', subscribedVariable)
      .then(res=>{
        if(res.data.success){
          setSubscriber(Subscriber - 1)
          setSubscribed(!Subscribed)
        }else{
          alert('구독 취소를 실패하였습니다.')
        }
      })
    }else{
      //구독중이 아니라면
      Axios.post('/api/subscriber/subscribe', subscribedVariable)
      .then(res=>{
        if(res.data.success){
          setSubscriber(Subscriber + 1)
          setSubscribed(!Subscribed)
        }else{
          alert('구독에 실패하였습니다.')
        }
      })
    }
  }

  return (
    <div>
      <button 
        style={{background: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px', color: 'white', padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase', borderStyle: 'none'}}
        onClick={onSubscribe}
      >
        {Subscriber} {Subscribed ? 'subscribed' : 'subscribe'}
      </button>
    </div>
  )
}

export default Subscriber;
