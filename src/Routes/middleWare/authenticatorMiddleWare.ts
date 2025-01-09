import jwt from 'jsonwebtoken';
require('dotenv').config();
export function signJwt(payload: any) {

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables.');
    }

    return 'Bearer ' +  jwt.sign(payload, process.env.JWT_SECRET);
}

export function authTokenMiddleware(req:any , res : any , next : any) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables.');
    }
    if(!req.headers['authrization']){
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = req.headers['authrization'].split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });

}

