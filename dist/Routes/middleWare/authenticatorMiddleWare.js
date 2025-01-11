"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.authTokenMiddleware = authTokenMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
function signJwt(payload) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables.');
    }
    return 'Bearer ' + jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
}
function authTokenMiddleware(req, res, next) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables.');
    }
    if (!req.headers['authorization']) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
}
