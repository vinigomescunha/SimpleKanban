'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KanbanCardsSchema extends Schema {
  up () {
    this.create('kanban_cards', (table) => {
      table.increments('id')
      table.timestamps()
      table.string('title');
      table.string('description');
      table.decimal('order');
      table.integer('task_id');
    })
  }

  down () {
    this.drop('kanban_cards')
  }
}

module.exports = KanbanCardsSchema
