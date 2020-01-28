'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const KanbanTask = use('App/Models/KanbanTask')
const KanbanCard = use('App/Models/KanbanCard')

/**
 * Resourceful controller for interacting with kanbantasks
 */
class KanbanTaskController {

  async create({
    request,
    response,
    view
  }) {
    const body = request.post();
    if (body) {
      try {
        let kt = new KanbanTask();
        if (body.description) {
          kt.description = body.description;
        }
        if (body.title) {
          kt.title = body.title;
        }
        if (body.color) {
          kt.color = body.color;
        }
        await kt.save();
        return kt;
      } catch (e) {
        throw new Error(e.message);
      }
    }
  }

  async all({
    params,
    request,
    response,
    view
  }) {
    return await KanbanTask.allTasksCardsAsJSON();
  }

  async get({
    params,
    request,
    response,
    view
  }) {
    return (await KanbanTask.find(params.id)).withCardsAsJSON();
  }


  async update({
    params,
    request,
    response
  }) {
    const body = request.post();
    if (body) {
      try {
        let kt = await KanbanTask.find(params.id);
        if (body.description) {
          kt.description = body.description;
        }
        if (body.title) {
          kt.title = body.title;
        }
        if (body.color) {
          kt.color = body.color;
        }
        await kt.save();
        return kt;
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
      let kt = await KanbanTask.find(params.id);
      kt.active = false;
      await kt.save();
      response.status(200).send('{}');
    } catch (e) {
      response.status(404).send('{}');
    }
  }
}

module.exports = KanbanTaskController
