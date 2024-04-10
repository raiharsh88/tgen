// this file exposes routes
import { Router } from 'express';
import {Request} from 'express'
import { UserService } from './users.service';



const router = Router();


const userService = new UserService();

router.get('/', async (req:Request, res) => {
    // get user data
    try{
    const user = req.user;

    if(!user){
        throw new Error('Unauthenticated request')
    }
    return await userService.getUsers(user); 

    }catch(e){
        console.log(e)
        res.sendStatus(500);
    }
})

export const userRouter = router