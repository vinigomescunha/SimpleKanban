'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const KanbanCard = use('App/Models/KanbanCard')

/**
 * Resourceful controller for interacting with kanbancards
 */
class KanbanCardController {

  async create({
    request,
    response,
    view
  }) {
    const body = request.post();
    if (body) {
      try {
        let kc = new KanbanCard();
        if (body.description) {
          kc.description = body.description;
        }
        if (body.title) {
          kc.title = body.title;
        }
        if (body.order) {
          kc.order = body.order;
        }
        if (body.task_id) {
          kc.task_id = body.task_id;
        }
        await kc.save();
        return kc;
      } catch (e) {
        throw new Error(e.message);
      }
    }
  }


  async update({
    params,
    request,
    response
  }) {
    const body = request.post();
    if (body) {
      try {
        let kc = await KanbanCard.find(params.id);
        if (body.description) {
          kc.description = body.description;
        }
        if (body.title) {
          kc.title = body.title;
        }
        if (body.order) {
          kc.order = body.order;
        }
        if (body.task_id) {
          kc.task_id = body.task_id;
        }
        await kc.save();
        return kc;
      } catch (e) {
        throw new Error(e.message);
      }
    }
  }

  async delete({
    params,
    request,
    response
  }) {
    try {
      let kc = await KanbanCard.find(params.id);
      await kc.delete();
      response.status(200).send('{}')
    } catch (e) {
      response.status(404).send('{}')
    }
  }
}

module.exports = KanbanCardController
