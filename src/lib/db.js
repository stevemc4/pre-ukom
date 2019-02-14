import knex from 'knex'
import env from 'dotenv'

env.config()

const db = knex({
    client: 'mysql2',
    connection: {
        user: process.env.DBUSER,
        password: process.env.DBPASS,
        database: process.env.DB,
        host: 'localhost'
    }
})

export default db