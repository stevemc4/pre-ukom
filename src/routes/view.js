import hapi from 'hapi'
import boom from 'boom'
import joi from 'joi'

/**
 * @type {hapi.ServerRoute[]}
 */

let views = [
    {
        path: '/login',
        method: 'GET',
        async handler(req, h){
            return h.view('pages/login')
        }
    },
    {
        path: '/',
        method: 'GET',
        async handler(req, h){
            return h.view('index', {
                page: 'overview'
            })
        }
    },
    {
        path: '/menu',
        method: 'GET',
        async handler(req, h){
            return h.view('index', {
                page: 'menu'
            })
        }
    },
    {
        path: '/employees',
        method: 'GET',
        async handler(req, h){
            return h.view('index', {
                page: 'employees'
            })
        }
    },
    {
        path: '/customers',
        method: 'GET',
        async handler(req, h){
            return h.view('index', {
                page: 'customers'
            })
        }
    },
]

 export default views