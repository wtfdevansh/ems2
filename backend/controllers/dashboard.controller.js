const User = require("../models/user.model")

const user = async (req , res) =>{


    try{

       const email = req.param.email
       const user  = await User.findOne({"email" : email})

       if(!user){
         res.status(200).json(user)
       }

    }catch(error){

        res.status(400).json(error)

    }

}


const admin = (req , res) =>{

}

module.exports = {user , admin}