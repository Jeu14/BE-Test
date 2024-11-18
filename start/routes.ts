import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')

router.post('signup', [UsersController, 'store'])
router.post('/login', [AuthController, 'login'])
