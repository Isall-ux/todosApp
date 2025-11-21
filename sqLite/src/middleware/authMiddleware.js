import jwt from 'jsonwebtoken'

function authMiddleWare(req, res, next) {
    // access token that was given to the user on log in or account creation
    const token = req.headers['authorization']

    // dont bother responding when there is no token
    if (!token) {
        return res.status(401).json({message: "no token provided"})
    }

    // only bother to send back respond if the token match a user
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if (err) {
            return res.status(401).json({message:"invalid token"})
        }

        req.userId = decoded.id
        next()
    })
}

export default authMiddleWare