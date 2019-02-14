import db from '../lib/db'

class Level{
    constructor(data){
        this.id = data.id
        this.name = data.name
    }
    static async findById(id){
        let data = await db('level').select([
            'id',
            'nama as name'
        ]).where('id', id)
        return new Level(data[0])
    }
}

export default Level