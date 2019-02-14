import db from '../lib/db'

import Order from './order'
import Menu from './menu'

class OrderDetail{
    constructor(data){
        return new Promise(async (resolve, reject) => {
            this.id = data.id || undefined
            if((typeof data.order) == Order)
                this.order = data.order
            else
                this.order = await Order.findById(data.order)
            
            if((typeof data.menu) == Menu)
                this.menu = data.menu
            else
                this.menu = await Menu.findById(data.menu)
            this.qty = data.qty
            this.status = data.status
            resolve(this)
        })
    }
    static findById(id){
        let data = await db('detailOrder').select([
            'id',
            'orderId as \'order\'',
            'masakan as menu',
            'keterangan as qty',
            'status'
        ]).where('id', id)
        return await new OrderDetail(data[0])
    }

    /**
     * 
     * @param {Order} order 
     */
    static async findByOrder(order){
        let temp = []
        let data = await db('detailOrder').select([
            'id',
            'orderId as \'order\'',
            'masakan as menu',
            'keterangan as qty',
            'status'
        ])
        .where('orderId', order.id)
        for(let item of data){
            temp.push(await new OrderDetail(item))
        }
        return temp
    }
    async save(){
        try{
            if(this.id == undefined){
                await db('detailOrder').insert({
                    orderId: this.order.id,
                    masakan: this.menu.id,
                    keterangan: this.qty,
                    status: this.status
                })
            }
            else{
                await db('detailOrder').update({
                    orderId: this.order.id,
                    masakan: this.menu.id,
                    keterangan: this.qty,
                    status: this.status
                }).where('id', this.id)
            }
            return true
        }
        catch(e){
            return false
        }
    }
    
}

export default OrderDetail