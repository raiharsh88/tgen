// this file does database calls
const db = {
    query:(q:string , args:any[])=> {''}
}
export class UserRepository{
    constructor(){}

    async getUserByEmail(email:string ){
        return db.query('selct * from users where email_id = $1', [email])
    }

    async getUserById(id:string){
        return db.query('select * from users where id = $1', [id])
    }
}