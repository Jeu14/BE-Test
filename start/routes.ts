import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const ClientsController = () => import('#controllers/clients_controller')
const ProductsController = () => import('#controllers/products_controller')

router.post('signup', [UsersController, 'store'])
router.post('/login', [AuthController, 'login'])

router.post('/client/store', [ClientsController, 'store'])
router.get('/client/index', [ClientsController, 'index'])
router.get('/client/show/:id', [ClientsController, 'show'])
router.put('/client/update/:id', [ClientsController, 'update'])
router.delete('/client/delete/:id', [ClientsController, 'delete'])

router.post('/product/store', [ProductsController, 'store'])
router.get('/product/index', [ProductsController, 'index'])
router.get('/product/show/:id', [ProductsController, 'show'])
router.put('/product/update/:id', [ProductsController, 'update'])
router.delete('/product/delete/:id', [ProductsController, 'delete'])