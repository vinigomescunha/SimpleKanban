  "use strict";

  const currentURL = new URL("/", location);
  const txtToRGBAString = (color) => {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    const [r, g, b, alpha] = context.getImageData(0, 0, 1, 1).data;
    return `rgba(${r},${g},${b}, .5)`;
  }
  const hexToRGBAString = (hex) => {
    hex = hex.replace('#', '');
    if ([3, 6].indexOf(hex.length) === -1) {
      console.log('Tem que ter entre 3 e 6 caracteres para uma cor #RRGGBB #RGB valida!', hex);
      return;
    }
    let r, g, b;
    if (hex.length === 3) {
      r = parseInt(hex.slice(0, 1).repeat(2), 16), g = parseInt(hex.slice(1, 2).repeat(2), 16), b = parseInt(hex.slice(2, 3).repeat(2), 16);
    } else {
      r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
    }
    return `rgba(${r},${g},${b}, .5)`;
  }
  const convertToRGBAString = (stringOrHex) => {
    // Primeiro verifico se e hexadecimal valido
    if(/^#[0-9A-F]{6}$/i.test(stringOrHex) === false) {
      return txtToRGBAString(stringOrHex);
    } else {
      return hexToRGBAString(stringOrHex);
    }
  };
  // prevent all default drag
  document.addEventListener('dragover', (ev) => {
    ev.preventDefault();
  });
  /**
   * Requests
   */
  class Requests {
    static request(url, options) {
      return fetch(url, options ? options : {}).then(r => r.json());
    }
    static getAllTasksCards() {
      return this.request(`${currentURL}kanban/tasks`);
    }
    static moveCard(taskid, cardid) {
      const opts = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'task_id': taskid
        }),
        cache: 'default'
      };
      return this.request(`${currentURL.href}kanban/card/${cardid}`, opts);
    }
    static configTask(taskid, data) {
      const opts = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        cache: 'default'
      };
      return this.request(`${currentURL.href}kanban/task/${taskid}`, opts);
    }
    static newTask(data) {
      const opts = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        cache: 'default'
      };
      return this.request(`${currentURL.href}kanban/task`, opts);
    }
    static newCard(data) {
      const opts = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        cache: 'default'
      };
      return this.request(`${currentURL.href}kanban/card`, opts);
    }
    static editCard(cardid, data) {
      const opts = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        cache: 'default'
      };
      return this.request(`${currentURL.href}kanban/card/${cardid}`, opts);
    }
    static deleteCard(id) {
      const opts = {
        method: 'DELETE',
        mode: 'cors',
        cache: 'default'
      };
      return this.request(`${currentURL.href}kanban/card/${id}`, opts);
    }
  }
  /**
   * Subs
   */
  class Subs {
    static on(topic, callback, context) {
      if (!this.topics) {
        this.topics = {};
      }
      if (!this.topics[topic]) {
        this.topics[topic] = [];
      }
      if (topic && callback && context) {
        this.topics[topic].push({
          topic,
          callback,
          context
        });
      }
    }
    static publish(topic, args) {
      if (!this.topics) {
        throw new Error('Dont exist topics on subscribe');
      }
      if (!this.topics[topic]) {
        throw new Error('Dont exist topic');
      }
      this.topics[topic].forEach(t => {
        t.callback.apply(t.context, args);
      });
    }
  }
  /**
   * KanbanFormType
   */
  const KanbanFormType = {
    FORM_CONFIG_TASK: 'form_config_task',
    FORM_NEW_TASK: 'form_new_task',
    FORM_NEW_CARD: 'form_new_card',
    FORM_EDIT_CARD: 'form_edit_card',
    FORM_DELETE_CARD: 'form_delete_card',
  }
  /**
   * KanbanFormDialog
   */
  class KanbanFormDialog extends HTMLDialogElement {
    constructor(formType, context) {
      super();
      this.formType = formType;
      this.context = context;
    }
    get form() {
      return this.querySelector('form');
    }
    connectedCallback() {
      this.innerHTML = '';
      this.appendForm();
      switch (this.formType) {
        case KanbanFormType.FORM_CONFIG_TASK:
          this.createFormConfigTask();
          break;
        case KanbanFormType.FORM_NEW_TASK:
          this.createFormNewTask();
          break;
        case KanbanFormType.FORM_NEW_CARD:
          this.createFormNewCard();
          break;
        case KanbanFormType.FORM_EDIT_CARD:
          this.createFormEditCard();
          break;
        case KanbanFormType.FORM_DELETE_CARD:
          this.createFormDeleteCard();
          break;
        default:
          throw new Error('Form not found!');
      }
      this.innerHTML = "<span class='fa fa-times' onclick='this.parentNode.form.reset();this.parentNode.close()'></span>" + this.innerHTML;
      this.createFormListener();
    }
    appendForm() {
      this.appendChild(document.createElement('form'));
    }
    createFormConfigTask() {
      this.form.innerHTML = `
      <div>
        <h2> Config Task (id=${this.context.taskid})</h2>
      </div>
      <div>
          <input type=text name=title placeholder=Title value='${this.context.title}'>
        </div>
        <div>
          <input type=text name=description placeholder=Description value='${this.context.description}'>
        </div>
      <div>
        <input type=text name=color placeholder="#rrggbb" value=${this.context.color||this.context.getRandomHexColor()}>
      </div>
      <div>
        <input type=submit value=Config>
      </div>
    `;
    }
    createFormNewTask() {
      this.form.innerHTML = `
        <div>
          <h2> New Task</h2>
        </div>
        <div>
          <input type=text name=title placeholder=Title>
        </div>
        <div>
          <input type=text name=description placeholder=Description>
        </div>
        <div>
          <input type=text name=color placeholder=#RRGGBB>
        </div>
        <div>
          <input type=submit value=Create>
        </div>
      `;
    }
    createFormNewCard() {
      this.form.innerHTML = `
        <div>
          <h2> New Card</h2>
        </div>
        <div>
          <input type=text name=title placeholder=Title>
        </div>
        <div>
          <input type=text name=description placeholder=Description>
        </div>
        <div>
          <input type=submit value=Create>
        </div>
      `;
    }
    createFormEditCard() {
      this.form.innerHTML = `
        <div>
          <h2> Edit Card</h2>
        </div>
        <div>
          <input type=text name=title placeholder=Title value='${this.context.title}'>
        </div>
        <div>
          <input type=text name=description placeholder=Description value='${this.context.description}'>
        </div>
        <div>
          <input type=submit value=Submit>
        </div>
      `;
    }
    createFormDeleteCard() {
      this.form.innerHTML = `
        <div>
          <h2> Delete ${this.context.title} (id=${this.context.cardid}) ?</h2>
        </div>
        <div>
          <input type=submit value=Ok>
          <input type=reset onclick='this.parentNode.parentNode.parentNode.close()' value=Cancelar></button>
        </div>
      `;
    }
    createFormListener() {
      if (!this.form) {
        throw new Error('Form not found!')
      }
      this.form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        let json = {};
        for (const [key, value] of (new FormData(this.form).entries())) {
          json[key] = value;
        }
        this.processHandlerRequest(json)
          .then(() => {
            this.form.reset();
            this.close();
          })
          .catch(e => {
            console.log(e, 'error!!'); // MWAHAHA Que sujo nao tratar isso aqui....
          });
      });
    }
    async processHandlerRequest(values) {
      switch (this.formType) {
        case KanbanFormType.FORM_CONFIG_TASK:
          const taskEdit = await Requests.configTask(this.context.taskid, values);
          // set form values
          this.form.querySelector('[name=title]').setAttribute('value', taskEdit.title);
          this.form.querySelector('[name=description]').setAttribute('value', taskEdit.description);
          this.form.querySelector('[name=color]').setAttribute('value', taskEdit.color);
          // set "context" Task
          Subs.publish('editTask', [taskEdit]);
          return true;
        case KanbanFormType.FORM_NEW_TASK:
          const task = await Requests.newTask(values);
          const scrollX = document.querySelector('[is=kanban-load]').scrollWidth;
          Subs.publish('appendNewTask', [task]);
          document.querySelector('[is=kanban-load]').scrollTo(scrollX, 0);
          return true;
        case KanbanFormType.FORM_NEW_CARD:
          values.task_id = this.context.taskid;
          const card = await Requests.newCard(values);
          Subs.publish('appendNewCard', [card]);
          return true;
        case KanbanFormType.FORM_EDIT_CARD:
          const cardEdit = await Requests.editCard(this.context.cardid, values);
          // set form values
          this.form.querySelector('[name=title]').setAttribute('value', cardEdit.title);
          this.form.querySelector('[name=description]').setAttribute('value', cardEdit.description);
          // set "context" Card
          Subs.publish('editCard', [cardEdit]);
          return true;
        case KanbanFormType.FORM_DELETE_CARD:
          await Requests.deleteCard(this.context.cardid);
          Subs.publish('removeCard', [{
            id: this.context.cardid
          }]);
          return true;
        default:
          throw new Error('Form not found!');
      }
    }
  }
  /**
   * KanbanTaskBar
   */
  class KanbanTaskBar extends HTMLDivElement {
    constructor(context) {
      super();
      this.context = context;
    }
    connectedCallback() {
      this.className = "task-bar";
      this.style.textAlign = "right";
      if (this.context && this.context.props && this.context.props.color) {
        let rgbaColor = convertToRGBAString(this.context.props.color);
        if (rgbaColor) {
          this.style.backgroundColor = convertToRGBAString(this.context.props.color);
        }
      }
      this.appendNewCard();
      this.appendConfigTask();
    }
    appendNewCard() {
      let dialog = new KanbanFormDialog(KanbanFormType.FORM_NEW_CARD, this.context);
      let newTask = document.createElement('span');
      newTask.innerHTML = "<i class='bar-item fa fa-plus' aria-hidden='true'></i>"
      newTask.addEventListener('click', () => {
        dialog.showModal();
      });
      this.appendChild(dialog);
      this.appendChild(newTask);
    }
    appendConfigTask() {
      let dialog = new KanbanFormDialog(KanbanFormType.FORM_CONFIG_TASK, this.context);
      let config = document.createElement('span');
      config.innerHTML = "<i class='bar-item fa fa-wrench' aria-hidden='true'></i>"
      config.addEventListener('click', () => {
        dialog.showModal();
      });
      this.appendChild(dialog);
      this.appendChild(config);
    }
  }
  /**
   * KanbanTask
   */
  class KanbanTask extends HTMLDivElement {
    constructor(taskid, title, description, color, cards) {
      super();
      this.taskid = taskid;
      this.cards = cards;
      this.props = {};
      this.props.title = title ? title : '-';
      this.props.description = description ? description : '-';
      this.props.color = color ? color : this.getRandomHexColor();
      this.addEventListener('drop', ev => {
        ev.stopPropagation();
        ev.preventDefault();
        // get the reference by mesg
        let referenceId = ev.dataTransfer.getData('reference');
        let el = document.querySelector(`[data-id="${referenceId}"]`);
        let target = this.getTargetToDrop(ev.target);
        if (!target) {
          return;
        }
        this.moveCard(el.cardid).then(() => {
          target.appendChild(new KanbanCard(el.cardid, el.title, el.description, this.taskid));
          el.remove();
        });
      });
    }
    get title() {
      return this.props.title
    }
    set title(title) {
      this.props.title = title;
      this.querySelector('.kanban-task-title').innerHTML = title;
    }
    get description() {
      return this.props.description
    }
    set description(description) {
      this.props.description = description;
      this.querySelector('.kanban-task-title').setAttribute('title', description);
    }
    get color() {
      return this.props.color;
    }
    set color(color) {
      this.props.color = color;
      this.style.borderTopColor = color;
      let rgbaColor = convertToRGBAString(color);
      if (rgbaColor) {
        this.querySelector('.task-bar').style.backgroundColor = rgbaColor;
      }
    }
    connectedCallback() {
      this.setAttribute('isdrop', true);
      this.style.borderTopColor = this.color ? this.color : '#000000';
      this.style.borderTopStyle = "solid";
      this.style.borderTopWidth = "6px";
      this.className = "kanban-task-list";
      this.appendChild(new KanbanTaskBar(this));
      this.appendTitle()
      this.createAppendSubs();
      if (this.cards) {
        this.cards.forEach(c => {
          Subs.publish(`appendNewCard`, [c]);
        });
      }
    }
    appendTitle() {
      const title = document.createElement('div');
      title.innerHTML = `
        <div style="text-align:center">
          <h2 class="kanban-task-title" title="${this.description}" style="margin: .8rem 0; font-size: 1.2rem;">${this.title}</h2>
        </div>
      `;
      this.appendChild(title);
    }
    moveCard(cardid) {
      return new Promise((resolve, reject) => {
        Requests.moveCard(this.taskid, cardid).then((json) => {
            resolve(json);
          })
          .catch(e => {
            reject("Error!");
          });
      });
    }
    getTargetToDrop(target) {
      const isTrue = (v) => v === true || v === String(true);
      let returnTarget = target;
      let count = 0;
      // verifico nos 5 elementos parentes se tem atributo isdrop pra dropar o elemento, evito dropar em fragment
      while (count < 5 && returnTarget.getAttribute && !isTrue(returnTarget.getAttribute('isdrop'))) {
        if (!returnTarget.parentNode) break;
        returnTarget = returnTarget.parentNode;
      }
      return returnTarget.getAttribute && isTrue(returnTarget.getAttribute('isdrop')) ? returnTarget : null;
    }
    getRandomHexColor() {
      return '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
    }
    createAppendSubs() {
      Subs.on(`appendNewCard`, (c) => {
        if (this.taskid === c.task_id)
          this.appendChild(new KanbanCard(c.id, c.title, c.description, c.task_id));
      }, this);
      Subs.on('editTask', (kt) => {
        if (kt && this.taskid === kt.id) {
          this.title = kt.title
          this.description = kt.description;
          this.color = kt.color;
        }
      }, this);
    }
  }
  /**
   * KanbanCard
   */
  class KanbanCard extends HTMLDivElement {
    constructor(cardid, title, description, taskid) {
      super();
      this.cardid = cardid;
      this.taskid = taskid;
      this.props = {};
      this.props.title = title ? title : '-';
      this.props.description = description ? description : '-';
      this.addEventListener('dragstart', (ev) => {
        const id = this.generateID();
        ev.target.dataset.id = id;
        // add reference by mesg
        ev.dataTransfer.setData('reference', id);
      });
    }
    get title() {
      return this.props.title;
    }
    set title(title) {
      this.props.title = title;
      this.querySelector('.title').innerHTML = title;
    }
    get description() {
      return this.props.description;
    }
    set description(description) {
      this.props.description = description;
      this.querySelector('.description').innerHTML = description;
    }
    connectedCallback() {
      this.innerHTML = "";
      this.className = "kanban-card";
      this.setAttribute('draggable', true);
      this.appendTitle();
      this.appendDescription();
      this.appendFooter();
      this.createAppendSubs();
    }
    generateID() {
      return `#${Math.random().toString(36).substr(2, 9).toUpperCase()}#`;
    }
    appendTitle() {
      let title = document.createElement('div');
      title.className = 'title';
      title.innerHTML = this.title;
      this.appendChild(title);
    }
    appendDescription() {
      let description = document.createElement('div');
      description.className = 'description';
      description.innerHTML = this.description;
      this.appendChild(description);
    }
    appendFooter() {
      let footer = document.createElement('div');
      footer.className = 'footer';
      footer.style.textAlign = "right";
      let footerAction = document.createElement('span');
      footerAction.className = "footer-action";
      let dialogEditCard = new KanbanFormDialog(KanbanFormType.FORM_EDIT_CARD, this);
      let editCard = document.createElement('span');
      editCard.innerHTML = "<i class='bar-item fa fa-pencil-square-o' aria-hidden='true'></i>"
      editCard.addEventListener('click', () => {
        dialogEditCard.showModal();
      });
      let dialogDeleteCard = new KanbanFormDialog(KanbanFormType.FORM_DELETE_CARD, this);
      let deleteCard = document.createElement('span');
      deleteCard.innerHTML = "<i class='bar-item fa fa-times' aria-hidden='true'></i>"
      deleteCard.addEventListener('click', () => {
        dialogDeleteCard.showModal();
      });
      footerAction.appendChild(dialogEditCard);
      footerAction.appendChild(editCard);
      footerAction.appendChild(dialogDeleteCard);
      footerAction.appendChild(deleteCard);
      footer.appendChild(footerAction);
      this.appendChild(footer);
    }
    createAppendSubs() {
      Subs.on('removeCard', (kc) => {
        if (this.cardid === kc.id) {
          this.remove();
        }
      }, this);
      Subs.on('editCard', (kc) => {
        if (this.cardid === kc.id) {
          this.title = kc.title
          this.description = kc.description;
        }
      }, this);
    }
  }
  /**
   * KanbanConfig
   */
  class KanbanConfig extends HTMLDivElement {
    constructor() {
      super()
    }
    connectedCallback() {
      this.innerHTML = "";
      this.className = "kanban-config";
      this.appendNewTask();
    }
    appendNewTask() {
      let dialog = new KanbanFormDialog(KanbanFormType.FORM_NEW_TASK, this);
      let newTask = document.createElement('span');
      newTask.innerHTML = "<i class='bar-item fa fa-plus' aria-hidden='true'></i>"
      newTask.addEventListener('click', () => {
        dialog.showModal();
      });
      this.appendChild(dialog);
      this.appendChild(newTask);
    }
  }
  /**
   * KanbanLoad
   */
  class KanbanLoad extends HTMLDivElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.createAppendSubs();
      this.createSpinner();
      this.createLoader();
    }
    createAppendSubs() {
      Subs.on('appendNewTask', (kt) => {
        this.appendChild(new KanbanTask(kt.id, kt.title, kt.description, kt.color, kt.cards));
      }, this);
    }
    createSpinner() {
      this.innerHTML = "";
      this.className = "loader";
      let div = document.createElement('div');
      div.className = "spinner";
      this.appendChild(div);
    }
    createLoader() {
      Requests.getAllTasksCards().then((all) => {
        this.className = "tracks";
        this.innerHTML = "";
        all.forEach(kt => {
          Subs.publish('appendNewTask', [kt]);
        });
      });
    }
  }
  customElements.define('kanban-form-dialog', KanbanFormDialog, {
    extends: 'dialog'
  });
  customElements.define('kanban-task-bar', KanbanTaskBar, {
    extends: 'div'
  });
  customElements.define('kanban-task', KanbanTask, {
    extends: 'div'
  });
  customElements.define('kanban-card', KanbanCard, {
    extends: 'div'
  });
  customElements.define('kanban-config', KanbanConfig, {
    extends: 'div'
  });
  customElements.define('kanban-load', KanbanLoad, {
    extends: 'div'
  });
