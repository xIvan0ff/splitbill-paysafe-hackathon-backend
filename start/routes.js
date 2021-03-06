'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

// Authentication
Route.group(() => { 
    Route.post('/login', 'AuthController.login').middleware('guest')
    Route.post('/login/token', 'AuthController.loginToken').middleware('auth')
    Route.post('/register', 'AuthController.register').middleware('guest')
    Route.post('/password/update', 'AuthController.changePassword').middleware('auth')
    Route.get('/search', 'AuthController.search').middleware('auth')
}).prefix('/auth')

// Banks
Route.group(() => { 
    Route.get('/:bankId/authenticate', 'BankController.authenticate').middleware('auth')
    Route.get('/:bankId/success', 'BankController.success')
    Route.get('/:bankId/refresh', 'BankController.refresh').middleware('auth').middleware('token')
    Route.get('/:bankId/accounts', 'BankController.getAccounts').middleware('auth').middleware('token')
    Route.get('/transactions', 'BankController.getAllTransactions').middleware('auth').middleware('token')
}).prefix('/bank')

// Bills
Route.group(() => { 
    Route.post('/', 'BillController.create').middleware('auth')
    Route.get('/', 'BillController.read').middleware('auth')
    Route.get('/:billId', 'BillController.readBill').middleware('auth')
    Route.get('/:billId/transactions/eligible', 'BillController.getTransactions').middleware('auth').middleware('token')
    Route.get('/:billId/split', 'BillController.splitMoney').middleware('auth')
    Route.post('/:billId', 'BillController.addTransaction').middleware('auth')
}).prefix('/bills')