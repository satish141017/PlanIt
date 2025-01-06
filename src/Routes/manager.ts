import express from 'express';
const router = express.Router();
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

interface Manager {
    username: number;
    email : string;
    firstName: string;
    lastName: string;
    passsword: string;
    
}
// Example route to get all managers
router.get('/', async ( req : any , res : any) => {
    const user : Manager = req.body.user;
    const data = await prisma.manager.findUnique({
        where: {
            email: user.email
        },
        select : {
            username: true,
            email: true,
            firstName: true,
            lastName: true
        }
    });
    res.json(data);
       

  
});



export default router;