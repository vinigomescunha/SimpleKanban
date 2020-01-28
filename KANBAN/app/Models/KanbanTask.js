'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const KanbanCards = use('App/Models/KanbanCard')

class KanbanTask extends Model {

  async withCardsAsJSON() {
    this.$attributes.cards = [];
    await Object.assign(
      this.$attributes.cards,
      (
        await KanbanCards.query().where('task_id', this.$attributes.id).fetch()
      ).toJSON())
    return this.$attributes;
  }

  static async allTasksCardsAsJSON() {
    let allTasks = ((await this.query().where('active', 1).fetch()).toJSON())
    for (let t of allTasks) {
      t.cards = (await KanbanCards.query().where('task_id', t.id).fetch()).toJSON();
    }
    return allTasks;
  }
}

module.exports = KanbanTask
