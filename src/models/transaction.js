import db from '../lib/db'

import User from './user'
import Order from './order'

class Transaction{
    constructor(data){
        return new Promise(async (resolve, reject) => {
            this.id = data.id || undefined
            if((typeof data.user) == User )
                this.user = data.user
            else
                this.user = await User.findById(data.user)

            if((typeof data.order) == Order)
                this.order = data.order
            else
                this.order = await Order.findById(data.orderId)
            this.date = data.date
            this.total = data.total
            resolve(this)
        })
    }
    static async fetch(limit=0, page=1){
        let temp = []
        let data = await db('transaksi').select([
            'id',
            'userId as user',
            'orderId as \'order\'',
            'tanggal as date',
            'totalBayar as total'
        ])
        for(let item of data){
            temp.push(await new Transaction(item))
        }
        return temp
    }
    static async findById(id){
        let data = await db('transaksi').select([
            'id',
            'userId as user',
            'orderId as \'order\'',
            'tanggal as date',
            'totalBayar as total'
        ]).where('id', id)
        return await new Transaction(data[0])
    }
    static async findByDateRange(start, end){
        return 'NOT IMPLEMENTED'
    }
    async save(){
        try{
            if(this.id == undefined){
                await db('transaksi').insert({
                    userId: this.user.id,
                    orderId: this.order.id,
                    tanggal: this.date,
                    totalBayar: this.total
                })
            }
            else{
                await db('transaksi').update({
                    userId: this.user.id,
                    orderId: this.order.id,
                    tanggal: this.date,
                    totalBayar: this.total
                }).where('id', this.id)
            }
            return true
        }
        catch(e){
            return false
        }
    }
}

export default Transaction