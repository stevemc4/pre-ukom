import db from '../lib/db'

class Menu{
    constructor(data){
        this.id = data.id || undefined
        this.name = data.name
        this.price = data.price
        this.status = data.status
        this.picture = data.picture
    }
    static async fetch(limit=0, page=1){
        let temp = []
        let data = await db('masakan').select([
            'id',
            'nama as name',
            'harga as price',
            'status',
            'picture'
        ])
        for(let item of data){
            temp.push(new Menu(item))
        }
        return temp
    }
    static async findById(id){
        let data = await db('masakan').select([
            'id',
            'nama as name',
            'harga as price',
            'status',
            'picture'
        ]).where('id', id)
        return new Menu(data[0])
    }
    async save(){
        try{
            if(this.id == undefined){
                await db('masakan').insert({
                    nama: this.name,
                    harga: this.price,
                    status: this.status,
                    picture: this.picture || 'default.png'
                })
            }
            else{
                await db('masakan').update({
                    nama: this.name,
                    harga: this.price,
                    status: this.status,
                    picture: this.picture || 'default.png'
                }).where('id', this.id)
            }
            return true
        }
        catch(e){
            return false
        }
    }
}

export default Menu