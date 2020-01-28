'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KanbanTasksSchema extends Schema {
  up () {
    this.create('kanban_tasks', (table) => {
      table.increments('id')
      table.timestamps()
      table.string('title');
      table.string('description');
      table.string('color');
      table.boolean('active').defaultTo(true);
    })
  }

  down () {
    this.drop('kanban_tasks')
  }
}

module.exports = KanbanTasksSchema
