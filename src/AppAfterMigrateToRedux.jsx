import React, { useState, createRef } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import "./styles.css";
import logger from "redux-logger";
import { connect, Provider } from "react-redux";

let nextTodoId = 0;
function todosReducer(
  state = [
    {
      id: nextTodoId++,
      text: "Learn React",
      completed: false
    }
  ],
  action
) {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        {
          id: nextTodoId++,
          text: action.text,
          completed: action.completed
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

function visibilityFilterReducer(state = "SHOW_ALL", action) {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
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

store.subscribe(() => {
  console.log(store.getState());
});

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
const mapDispatchToTodoListProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch({ type: "TOGGLE_TODO", id });
    }
  };
};
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
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
      dispatch({ type: "ADD_TODO", text });
    }
  };
};
AddTodo = connect(
  null,
  mapDispatchToAddTodoProps
)(AddTodo);

const Link = ({ children, onClick, active }) => {
  if (active) {
    return <p>{children}</p>;
  }

  return (
    <a href="#" onClick={onClick}>
      {children}
    </a>
  );
};
const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: state === ownProps.filter
  };
};
const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch({ type: "SET_VISIBILITY_FILTER", filter: ownProps.filter });
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

export default function App() {
  return (
    <Provider store={store}>
      <VisibleTodoList />
      <AddTodo />
      <Footer />
    </Provider>
  );
}
