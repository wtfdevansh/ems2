const bcrypt = require("bcryptjs")
const User = require("../models/user.model")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const generateToken = (user) => {
    return jwt.sign(
      { id: user._id, email: user.email , role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};


const login = async (req , res) =>{

    const {email , password} = req.body

    try{

        const user = await User.findOne({email})

        console.log(user)
        
        if(!user){
            return res.status(400).json({success: false , message: "invalid email or password"})
        }

        const isMatch = await bcrypt.compare(password , user.password)

        if(!isMatch){
            return res.status(400).json({success: false , message: "invalid email or password"})
        }

        const token = generateToken(user)
        res.json({success: true , token})

    }catch(error){

        console.log(error.message)
        res.status(500).json({message: error.message});

    }

}

const register = async (req , res) =>{

    const {firstname , lastname , email , password , role} = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);

    try{

        if(role === 'admin'){

            const newUser = await User.create({firstname: firstname , lastname: lastname , email , password: hashedPassword , role , canAccess: true , department : 'admin'});
            res.status(201).json({message: 'Admin created successfully', user: newUser});

        }else{

            const newUser = await User.create({firstname: firstname , lastname: lastname , email , password: hashedPassword , role , canAccess: false});
            res.status(201).json({message: 'User created successfully', user: newUser});

        }

    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message});
    }

}

module.exports = {login , register};