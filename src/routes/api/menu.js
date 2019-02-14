import hapi from 'hapi'
import boom from 'boom'
import joi from 'joi'

import Menu from '../../models/menu'

/**
 * @type {hapi.ServerRoute[]}
 */

let menu = [
    {
        path: '/api/menu',
        method: 'GET',
        async handler(req, h){
            try{
                let data = await Menu.fetch()
                return data
            }
            catch(e){
                return boom.internal()
            }
        }
    }
]

 export default menu