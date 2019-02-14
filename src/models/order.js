import db from '../lib/db'

import User from './user'
import OrderDetail from './orderDetail'

class Order{
    constructor(data){
        return new Promise(async (resolve, reject) => {
            this.id = data.id || undefined
            if((typeof data.user) == User)
                this.user = data.user
            else
                this.user = await User.findById(data.user)
            this.tableNo = data.tableNo
            this.date = data.date
            this.detail = data.detail
            this.status = data.status
            resolve(this)
        })
    }
    static async fetch(limit=0, page=1){
        let temp = []
        let data = await db('order').select([
            'id',
            'userId as \'user\'',
            'noMeja as tableNo',
            'tanggal as date',
            'keterangan as detail',
            'status'
        ])
        for(let item of data){
            temp.push(await new Order(item))
        }
        return temp
    }
    static async findById(id){
        let data = await db('order').select([
            'id',
            'userId as \'user\'',
            'noMeja as tableNo',
            'tanggal as date',
            'keterangan as detail',
            'status'
        ]).where('id', id)
        return await new Order(data[0])
    }
    static async findByDateRange(start, end){
        return 'NOT IMPLEMENTED'
    }
    async save(){
        try{
            if(this.id == undefined){
                await db('order').insert({
                    userId: this.user.id,
                    noMeja: this.tableNo,
                    tanggal: this.date,
                    keterangan: this.detail,
                    status: this.status
                })
            }
            else{
                await db('order').update({
                    userId: this.user.id,
                    noMeja: this.tableNo,
                    tanggal: this.date,
                    keterangan: this.detail,
                    status: this.status
                }).where('id', this.id)
            }
            return true
        }
        catch(e){
            return false
        }
    }
    async findOrderDetails(){
        return await OrderDetail.findByOrder(this)
    }
}

export default Order