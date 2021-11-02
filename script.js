function createStore(reducer, initialState) {
  let state = reducer(initialState, { type: '__INIT__' });

  return {
    dispatch(action) {
      state = reducer(state, action);
    },
    getState() {
      return state;
    }
  }
};

function rootReducer(state, action) {
  switch (action.type) {
    case 'SAVE_TODOS': {
      const newTodos = [...state.todos, { label: action.payload, id: Date.now() }]
      return {
        todos: newTodos
      };
    }
    case 'DELETE_TODO': {
      const target = state.todos.find(item => item.id == action.payload);
      const idx = state.todos.indexOf(target);
      const newArr = [...state.todos.slice(0, idx), ...state.todos.slice(idx + 1)];
      return {
        todos: newArr
      }
    }
  }
  return state;
};

const store = createStore(rootReducer, { todos: [{ label: 'Create to do', id: 1 }] });

function onPageLoaded() {
  const input = document.querySelector("input[type='text']");
  const ul = document.querySelector("ul.todos");
  const saveButton = document.getElementById("save");

  function createTodo(updateHTML = false, value) {
    const li = document.createElement("li");
    const textSpan = document.createElement("span");
    textSpan.classList.add("todo-text");
    const data = store.getState().todos;
    data.length && !updateHTML && textSpan.append(data[data.length - 1].label);

    const deleteBtn = document.createElement("span");
    deleteBtn.classList.add("todo-trash");
    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-trash-alt");
    icon.id = data.length && data[data.length - 1].id;
    data.length && deleteBtn.appendChild(icon);

    if (data.length && updateHTML) {
      textSpan.append(value.label);
      icon.id = value.id;
      ul.appendChild(li).append(textSpan, deleteBtn);
    }
    
    !updateHTML && ul.appendChild(li).append(textSpan, deleteBtn);
    input.value = "";
    listenDeleteTodo(deleteBtn);
  };

  createTodo();

  function listenDeleteTodo(element) {
    element.addEventListener("click", (event) => {
      store.dispatch({ type: "DELETE_TODO", payload: event.target.id });
      ul.innerHTML = '';
      const data = store.getState().todos;
      data.forEach(item => createTodo(true, item));
    });
  };

  input.addEventListener("keypress", (keyPressed) => {
    const keyEnter = 13;
    if (keyPressed.which == keyEnter && input.value !== "") {
      store.dispatch({ type: "SAVE_TODOS", payload: input.value });
      createTodo();
    }
  });

  saveButton.addEventListener("click", () => {
    if(input.value !== "") {
      store.dispatch({ type: "SAVE_TODOS", payload: input.value });
      createTodo();
    }
  });
}

document.addEventListener("DOMContentLoaded", onPageLoaded);
