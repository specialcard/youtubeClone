const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

router.post('/subscriberNumber', (req,res) => {
  Subscriber.find({'userTo': req.body.userTo})
  .exce((err, subscriber) => {
    if(err) return res.status(400).send(console.log(err));
    return res.status(200).json({success: true, subscriberNumber: subscriber.length})
  });
});

router.post('/subscribed', (req,res) => {
  Subscriber.find({'userTo': req.body.userTo, 'userFrom': req.body.userFrom})
  .exce( (err, subscribed) => {
    if(err) return res.status(400).send(console.log(err))
    let result = false
    if(subscribed.length !== 0){
      result = true
    }
    res.status(200).json({ success: true, subscribed: result});
  });
});

router.post('/unSubscribe' , (req,res)=>{
  
  Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom })
        .exec((err, doc)=>{
            if(err) return res.status(400).json({ success: false, err});
            res.status(200).json({ success: true, doc })
        })
});

router.post('/subscribe' , (req,res)=>{

  const subscribe = new Subscriber(req.body)
  subscribe.save((err,doc)=>{
    if(err) return res.status(400).json({success: false, err})
    res.status(200).json({success: true})
  });

});

module.exports = router;
