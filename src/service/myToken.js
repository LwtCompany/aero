const jwt = require('jsonwebtoken');
const { 
    secretkey,
    keytime,
    refreshSecredKey,
    refreshKeyTime 
} = require('../config/env.config');

class TokenBuilder {
    constructor(){
        this.tokenList = {};
        this.userList = {};
    }

    verifyToken(req, res, next){
        const token = req.headers['token'];

        if (!token) return res.status(403).json({
             message: "Token not found",
             status: false,
             error_code: 0,
             data: {}
        });
        const sendData = (token, data) => this.userUpdate(token, data);

        const is_have = Object.values(this.tokenList).find((elem) => elem == token);
        if(!is_have)return res.status(401).json({
                message: "User not authorized",
                status: false,
                error_code: 0,
                data: {}
            });

        jwt.verify(token, secretkey, function (err, decoded) {
            if (err) return res.status(401).json({
                message: "User not authorized",
                status: false,
                error_code: 0,
                data: {}
            });
            sendData(token, decoded)
        
            next();
        });
    }

    signInToken(user){

        let token = jwt.sign(user, secretkey, { expiresIn: keytime });
        let refreshToken =  jwt.sign(user, refreshSecredKey, { expiresIn: refreshKeyTime });
        this.tokenList[refreshToken] = token;

        this.userUpdate(token, user);

        return {
            token,
            refreshToken
        }
    }

    refreshToken(refreshToken){
        const myxToken = this.tokenList[refreshToken];
        const user = this.userList[myxToken];
        if(!myxToken || !user)
            return `Error: sorry i don't find refreshing token`;

        const currentToken = jwt.verify(myxToken, secretkey, function(err,decoded)  {
            console.log(err)
        });
        if(currentToken){
            delete currentToken.iat;
            delete currentToken.exp;
            delete currentToken.nbf;
            delete currentToken.jti;
        }
     

        let token = jwt.sign(user, secretkey);
        this.tokenList[refreshToken] = token;
    
        return {
            refreshToken,
            token
        }
        
      
       
       
    }

    userUpdate(token, data){
        this.userList[token] = data;
    }
}

module.exports = new TokenBuilder();