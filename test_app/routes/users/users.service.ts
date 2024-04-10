// this files performs logical operations and formats data before querying and formats result after querying

import { UserRepository } from "./users.repository"

interface User{
    name:string;
    email:string;
    user_id:string;
}
export class UserService{
    private userRepository:UserRepository;
    constructor(){
        this.userRepository = new UserRepository();
    }


    async getUsers(user:User){
        const {email , user_id} = user;
        if(email){
            return await this.userRepository.getUserByEmail(email);
        }else if(user_id){
            return await this.userRepository.getUserById(user_id);
        }
        throw Error('No identifier found for the user')
    }
}
