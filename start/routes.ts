/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

// import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
const UsersController = () => import('#controllers/users_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('signup', [UsersController, 'store'])
