const express = require('express');
const router = express.Router();
const {Post, User} = require('../models')

router.get('/', async (req, res)=>{
  try{
      console.log("homepage loaded")
      res.render('homepage.handlebars', {})
  } catch(err){
    console.log(err)
  }

})



module.exports = router;