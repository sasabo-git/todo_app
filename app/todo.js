var STORAGE_KEY = 'todo-app'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  },
}

const app = new Vue({
  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    },
  },

  data: function () {
    return {
      todos: todoStorage.fetch(),
      editedTodo: null,
      visibility: 'all',
    }
  },

  // todosのデータが変化したらセーブを実行
  watch: {
    todos: {
      handler: function (todos) {
        todoStorage.save(todos)
      },
      deep: true,
    },
  },

  methods: {
    createTodo: function (event, value) {
      var title = this.$refs.title
      if (!title.value.length) {
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        title: title.value,
        completed: false,
      })
      title.value = ''
    },

    deleteTodo: function (item) {
      const index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    },

    editTodo: function (todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    doneEdit: function (todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      todo.title = todo.title.trim()
      if (!todo.title) {
        this.deleteTodo(todo)
      }
    },

    cancelEdit: function (todo) {
      this.editedTodo = null
      todo.title = this.beforeEditCache
    },
  },
})

app.$mount('.todoapp')
