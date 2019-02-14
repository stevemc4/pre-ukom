import hapi from 'hapi'
import boom from 'boom'
import joi from 'joi'
import accepts from 'accepts'

import Password from '../../lib/password'

import User from '../../models/user'

/**
 * @type {hapi.ServerRoute[]}
 */
var routes = [
    {
        path: '/api/auth/login',
        method: 'POST',
        async handler(req, h){
            let accept = accepts(req.raw.req)
            try{
                let user = await User.findByUsername(req.payload.username)
                if(user.password == new Password(req.payload.password).value){
                    req.yar.set('user', user.id)
                    switch(accept.type(['html', 'json'])){
                        case 'html': return h.redirect('/')
                        case 'json': return {
                                        statusCode: 200,
                                        error: '',
                                        message: 'Successful login',
                                        payload: {
                                            userId: user.id,
                                            username: user.username
                                        }
                                    }
                        default: return boom.notAcceptable()
                    }   
                }
                else{
                    switch(accept.type(['html', 'json'])){
                        case 'html': return h.redirect('/login?invalid')
                        case 'json': return boom.unauthorized('User or Password is invalid')
                        default: return boom.notAcceptable()
                    }
                }
            }
            catch(e){
                switch(accept.type(['html', 'json'])){
                    case 'html': return h.redirect('/login?invalid')
                    case 'json': return boom.unauthorized('User or Password is invalid')
                    default: return boom.notAcceptable()
                }
            }
        },
        options: {
            validate:{
                payload:{
                    username: joi.string().required(),
                    password: joi.string().required()
                }
            }
        },
    }
]

export default routes