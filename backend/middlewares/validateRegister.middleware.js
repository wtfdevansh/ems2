

const validateRegister = (req , res , next) => {
    const {email , password} = req.body

    if(!email || !password){
        return res.status(400).json({message: 'Email and password are required'});
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if(!emailRegex.test(email)){
        return res.status(400).json({message: 'Invalid email address'});
    }

    if(!passwordRegex.test(password)){
        return res.status(400).json({message: 'Invalid password'});
    }

    next();
}

module.exports = validateRegister;