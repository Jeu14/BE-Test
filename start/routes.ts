import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const ClientsController = () => import('#controllers/clients_controller')
const ProductsController = () => import('#controllers/products_controller')

router.post('signup', [UsersController, 'store'])
router.post('/login', [AuthController, 'login'])

router.post('/store', [ClientsController, 'store'])
router.get('/index', [ClientsController, 'index'])
router.get('/show/:id', [ClientsController, 'show'])
router.put('/update/:id', [ClientsController, 'update'])
router.delete('/delete/:id', [ClientsController, 'delete'])

router.post('/product/store', [ProductsController, 'store'])
router.get('/product/index', [ProductsController, 'index'])