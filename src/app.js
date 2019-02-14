import dotenv from 'dotenv'
import chalk from 'chalk'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import fs from 'fs'

import hapi from 'hapi'
import vision from 'vision'
import inert from 'inert'
import yar from 'yar'
import ejs from 'ejs'

import routes from './routes/routes'

dotenv.config()
var css = fs.readFileSync(process.cwd() + '/static/styles/tailwind.css').toString()


const server = new hapi.Server({
    port: process.env.PORT
})

server.route({
    path: '/static/{path*}',
    method: 'GET',
    handler(req, h){
        return h.file(process.cwd() + '/static/' + req.params.path)
    }
})

server.route({
    path: '/static/styles/main.css',
    method: 'GET',
    handler(req, h){
        return h.response(css).type('text/css')
    }
})

server.route(routes)

async function provision(){
    console.log('Le Bistro Server')
    console.log(`${chalk.bgGreen('PRV')}\t compiling css...`)
    css = await postcss([tailwindcss(process.cwd()+'/tailwind.js')]).process(css, {
        from: '../static/styles/tailwind.css',
        to: '../static/styles/main.css'
    })
    css = css.css
    console.log(`${chalk.bgGreen('PRV')}\t registering plugins...`)
    await server.register({
        plugin: vision,
        options: {
            engines: {
                ejs: ejs
            },
            relativeTo: process.cwd() + '/views',
            path: process.cwd() + '/views',
            isCached: false
        }
    })
    await server.register({
        plugin: inert
    })
    await server.register({
        plugin: yar,
        options:{
            storeBlank: false,
            cookieOptions:{
                password: 'NTCfzeGC7XtpBpDiWvSbyy2NUt0gEDji',
                isSecure: false
            }
        }
    })
    server.start()
    console.log(`${chalk.bgGreen('PRV')}\t ${chalk.bold.green('OK')}`)
    console.log(`${chalk.bgBlue('MSG')}\t Server started on port ${chalk.bold.green(server.settings.port)}`)
}

provision()