const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({message: 'Access denied, token is required'});
    
    try{
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
        req.user = verified; //decode token
        next();
    }catch(err){
        res.status(400).json({message: 'Invalid token'});
    }
}

module.exports = authenticateToken;