import apiAuth from './api/auth'
import apiMenu from './api/menu'
import views from './view'

export default [
    ...apiAuth,
    ...apiMenu,
    ...views
]