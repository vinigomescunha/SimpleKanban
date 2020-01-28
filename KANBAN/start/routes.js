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


// https://adonisjs.com/docs/4.1/routing

// https://adonisjs.com/docs/4.1/routing#_basic_routing
Route.on('/').render('kanbanboard')
// Route.on('/wo').render('wololo')
// Route.get('example', 'ExampleController.index')
// Route.on('/all').setHandler('KanbanTaskController.all')

// https://adonisjs.com/docs/4.1/routing#_required_parameters

// Route.get('posts/:id', ({
//   params
// }) => {
//   return `Post ${params.id}`
// })

// Route.get('/kanban','KanbanTaskController.all')

// https://adonisjs.com/docs/4.1/routing#_available_router_methods

Route.get('/kanban/tasks', 'KanbanTaskController.all');

Route.post('/kanban/config', 'KanbanTaskController.create');// TODO

Route.post('/kanban/task', 'KanbanTaskController.create');
Route.get('/kanban/task/:id', 'KanbanTaskController.get');
Route.post('/kanban/task/:id', 'KanbanTaskController.update');
Route.delete('/kanban/task/:id', 'KanbanTaskController.delete');
Route.post('/kanban/config_task', 'KanbanTaskController.create');// TODO


Route.post('/kanban/card', 'KanbanCardController.create');
Route.post('/kanban/card/:id', 'KanbanCardController.update');
Route.delete('/kanban/card/:id', 'KanbanCardController.delete');
Route.post('/kanban/config', 'KanbanTaskController.create');// TODO
