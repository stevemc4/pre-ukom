import hapi from 'hapi'
import boom from 'boom'
import joi from 'joi'

/**
 * @type {hapi.ServerRoute[]}
 */

let views = [
    {
        path: '/',
        method: 'GET',
        handler(req, h){
            return h.view('index')
        }
    }
]

 export default views