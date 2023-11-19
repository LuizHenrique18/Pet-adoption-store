const getToken = require('./get-token')
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next)=>{
    //if token was null, will be return this message
    if(!req.headers.authorization){
        res.status(400).json({message:'Usuário não tem token!'})
        return
    }

    // here is to read the token and confirm if it exist or not
    let token = getToken(req)
    try{
        const verified = jwt.verify(token, 'secretreserve12345')
        req.user = verified
        next()
    }catch(err){
        return res.status(401).json({message:'Token inválido'})
    }
}

module.exports = verifyToken