var knex = require('knex')
var pass = require('./password')


async function install(){
    console.log('Database Installer')
    console.log('Please wait...')
    console.log('Creating database...')
    let db = knex({
        client: 'mysql2',
        connection: {
            user: 'root',
            password: '',
            host: 'localhost'
        }
    })

    await db.raw('create database lebistro;')
    console.log('Database Created. Creating tables...')
    db = knex({
        client: 'mysql2',
        connection: {
            user: 'root',
            password: '',
            host: 'localhost',
            database: 'lebistro'
        }
    })

    db.schema.createTable('level', async (table) => {
        table.increments('id').notNullable().primary()
        table.string('nama').notNullable()
    })
    .createTable('masakan', async (table) => {
        table.increments('id').notNullable().primary()
        table.string('nama').notNullable()
        table.integer('harga').notNullable()
        table.enum('status', [
            'Hidangan Utama',
            'Minuman',
            'Hidangan Pembuka',
            'Makanan Ringan'
        ]).notNullable()
        table.string('picture').notNullable().defaultTo('default.png')
    })
    .createTable('user', async (table) => {
        table.increments('id').notNullable().primary()
        table.integer('level').notNullable().unsigned().references('id').inTable('level').onDelete('cascade').onUpdate('cascade')
        table.string('username').notNullable().unique()
        table.string('password').notNullable()
        table.string('nama').notNullable()
        table.string('picture').notNullable().defaultTo('default.png')
    })
    .createTable('order', async (table) => {
        table.increments('id').primary()
        table.integer('userId').nullable().unsigned().references('id').inTable('user').onDelete('set null').onUpdate('cascade')
        table.integer('noMeja').notNullable()
        table.dateTime('tanggal').notNullable().index()
        table.string('keterangan').nullable()
        table.enum('status', ['Belum Selesai', 'Selesai']).notNullable().defaultTo('Belum Selesai')
    })
    .createTable('detailOrder', async (table) => {
        table.increments('id').primary()
        table.integer('orderId').notNullable().unsigned().references('id').inTable('order').onDelete('cascade').onUpdate('cascade')
        table.integer('masakan').nullable().unsigned().references('id').inTable('masakan').onDelete('set null').onUpdate('cascade')
        table.integer('keterangan').notNullable()
        table.enum('status', [
            'Belum Siap',
            'Dimasak',
            'Siap',
            'Telah Diantar'
        ]).notNullable().defaultTo('Belum Siap')
    })
    .createTable('transaksi', async (table) => {
        table.increments('id').primary()
        table.integer('userId').nullable().unsigned().references('id').inTable('user').onDelete('set null').onUpdate('cascade')
        table.integer('orderId').nullable().unsigned().references('id').inTable('order').onDelete('set null').onUpdate('cascade')
        table.dateTime('tanggal').notNullable().index()
        table.integer('totalBayar').notNullable()
    })
    .then(async () => {
        console.log('Tables created. Filling data...')
        let level = [
            'Admin',
            'Kasir',
            'Pelayan',
            'Pemilik',
            'Pelanggan'
        ]
        for(let item of level)
            await db('level').insert({nama: item})
        let user = [
            {
                level: 1,
                username: 'admin',
                password: 'admin',
                nama: 'Administrator'
            },
            {
                level: 2,
                username: 'kasir',
                password: 'kasirman',
                nama: 'Kasir'
            },
            {
                level: 3,
                username: 'pelayan',
                password: 'pelayanpro',
                nama: 'Pelayan'
            },
            {
                level: 4,
                username: 'pemilik',
                password: 'lebistro',
                nama: 'Pemilik Le Bistro'
            },
            {
                level: 5,
                username: 'pembeli',
                password: 'pembeliraja',
                nama: 'Pembeli'
            },
            {
                level: 5,
                username: 'sumipe',
                password: 'x',
                nama: 'Sumire Uesaka'
            }
        ]
        for(let item of user)
            await db('user').insert({
                level: item.level,
                username: item.username,
                password: new pass.default(item.password).value,
                nama: item.nama
            })
        console.log('Database successfully installed. Press ctrl+c to quit')
    })
}

install()