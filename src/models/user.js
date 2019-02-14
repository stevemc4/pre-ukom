import db from '../lib/db'

import Level from './level'
import Password from '../lib/password';


class User{
    constructor(data){
        return new Promise(async (resolve, reject) => {
            try{
                this.id = data.id || undefined
                this.level = await Level.findById(data.level)
                this.username = data.username
                this.password = data.password
                this.name = data.name
                this.picture = data.picture
                resolve(this)
            }
            catch(e){
                console.log(e)
                reject()
            }
        })
    }
    static async findById(id){
        try{
            let data = await db('user').select([
                'id',
                'level',
                'username',
                'password',
                'nama as name',
                'picture'
            ]).where('id', id)
            let user = await new User(data[0])
            return user
        }
        catch(e){
            console.log(e)
            return new User()
        }
    }
    static async findByUsername(username){
        try{
            let data = await db('user').select([
                'id',
                'level',
                'username',
                'password',
                'nama as name',
                'picture'
            ]).where('username', username)
            let user = await new User(data[0])
            return user
        }
        catch(e){
            console.log(e)
            return new User()
        }
    }
    static async findByLevel(level){
        try{
            let temp = []
            let data = await db('user').select([
                'id',
                'level',
                'username',
                'password',
                'nama as name',
                'picture'
            ]).where('level', level)
            for(let item of data)
            {
                temp.push(await new User(item))
            }
            return temp
        }
        catch(e){
            console.log(e)
            return new User()
        }
    }
    toObject(){
        return {
            id: this.id,
            level: this.level.name,
            username: this.username,
            name: this.name,
            picture: this.picture
        }
    }
    async save(disableSafeMode = false){
        try{
            if(this.id == undefined){
                await db('user').insert({
                    level: this.level.id,
                    username: this.username,
                    password: new Password(this.password).value,
                    nama: this.name,
                    picture: this.picture || 'default.png'
                })
            }
            else{
                await db('user').update({
                    level: this.level.id,
                    username: this.username,
                    nama: this.name,
                    picture: this.picture || 'default.png'
                }).where('id', this.id)
                if(disableSafeMode){
                    await db('user').update({
                        password: new Password(this.password).value
                    }).where('id', this.id)
                }
            }
            return true
        }
        catch(e){
            return false
        }
    }
}

export default User