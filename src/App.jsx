import React, { createRef } from "react";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { connect, Provider } from "react-redux";
import logger from "redux-logger";
import "./styles.css";

// action types
const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const SET_VISIBILITY_FILTER = "SET_VISIBILITY_FILTER";

// action creators
const toggleTodo = id => {
  return { type: TOGGLE_TODO, id };
};
const addTodo = text => {
  return { type: ADD_TODO, text };
};

const setVisibilityFilter = filter => {
  return {
    type: SET_VISIBILITY_FILTER,
    filter
  };
};

function visibilityFilterReducer(state = "SHOW_ALL", action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
}

let nextTodoId = 0;
const todosInitialState = [
  { id: nextTodoId++, text: "Learn React", completed: true },
  { id: nextTodoId++, text: "Learn Redux", completed: true },
  { id: nextTodoId++, text: "Learn How to Love People", completed: false }
];
function todosReducer(state = todosInitialState, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        {
          id: nextTodoId++,
          text: action.text,
          completed: false
        }
      ];

    case "TOGGLE_TODO":
      return state.map(todo => {
        if (todo.id !== action.id) {
          return todo;
        }

        return {
          ...todo,
          completed: !todo.completed
        };
      });

    default:
      return state;
  }
}

const store = createStore(
  combineReducers({
    todos: todosReducer,
    visibilityFilter: visibilityFilterReducer
  }),
  applyMiddleware(logger)
);

/**
{
  todos: []
  visibilityFilter: "SHOW_ALL"
}
*/
console.log(store.getState());

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case "SHOW_ALL":
      return todos;
    case "SHOW_ACTIVE":
      return todos.filter(todo => !todo.completed);
    case "SHOW_COMPLETED":
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

const Todo = ({ completed, text, onClick }) => {
  return (
    <li
      onClick={onClick}
      style={{
        textDecoration: completed ? "line-through" : "none"
      }}
    >
      {text}
    </li>
  );
};

const TodoList = ({ todos, onTodoClick }) => {
  return (
    <ul>
      {todos.map(todo => (
        <Todo
          key={todo.id}
          completed={todo.completed}
          text={todo.text}
          onClick={() => onTodoClick(todo.id)}
        />
      ))}
    </ul>
  );
};
const mapStateToTodoListProps = state => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onTodoClick(id) {
      dispatch(toggleTodo(id));
    }
  };
};
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToProps
)(TodoList);

let AddTodo = ({ onSubmit }) => {
  const todoInput = createRef();

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(todoInput.current.value);
        todoInput.current.value = "";
      }}
    >
      <input ref={todoInput} type="text" />
      <button>Add todo</button>
    </form>
  );
};
const mapDispatchToAddTodoProps = dispatch => {
  return {
    onSubmit: text => {
      dispatch(addTodo(text));
    }
  };
};
AddTodo = connect(
  null,
  mapDispatchToAddTodoProps
)(AddTodo);

const Link = ({ active, children, onClick }) => {
  if (active) {
    return <span>{children}</span>;
  }

  return (
    <a href="#" onClick={onClick}>
      {children}
    </a>
  );
};
const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: state.visibilityFilter === ownProps.filter
  };
};
const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick() {
      dispatch(setVisibilityFilter(ownProps.filter));
    }
  };
};
const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);

const Footer = () => {
  return (
    <footer>
      <FilterLink filter="SHOW_ALL">All</FilterLink> |{" "}
      <FilterLink filter="SHOW_ACTIVE">Active</FilterLink> |{" "}
      <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
    </footer>
  );
};

const TodoApp = () => (
  <div>
    <VisibleTodoList />
    <AddTodo />
    <Footer />
  </div>
);

export default function App() {
  return (
    <Provider store={store}>
      <TodoApp />
    </Provider>
  );
}
