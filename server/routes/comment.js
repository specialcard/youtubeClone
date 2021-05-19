const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");

router.post('/saveComment', (req,res) => {
  const comments = new Comment(req.body);

  comments.save((err, comment) => {
    if(err) return res.status(400).json({ success: false, err})
    Comment.find({'_id': comment._id})
    .populate('writer')
    .exec((err, result)=>{
      if(err) return res.status(400).json({ success: false, err})
      res.status(200).json({success: true, result})
    })
  });
});
router.post('/getComments', (req,res) => {

  Comment.find({'postId': req.body.videoId})
  .populate('writer')
  .exec((err,comments)=>{
    if(err) res.status(400).send(err)
    res.status(200).json({success: true, comments});
  })

});




module.exports = router;
