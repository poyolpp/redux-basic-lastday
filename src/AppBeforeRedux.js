import React, { useState, createRef } from "react";
import "./styles.css";

/**
App (todos, visibilityFilter, onSubmit)
  - TodoList (todos)
  - AddTodo (onSubmit)
  - Footer (setVisibilityFilter)
*/

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

const AddTodo = ({ onSubmit }) => {
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

const Link = ({ filter, children, onClick }) => {
  return (
    <a href="#" onClick={() => onClick(filter)}>
      {children}
    </a>
  );
};

const Footer = ({ setVisibilityFilter }) => {
  return (
    <footer>
      <Link filter="SHOW_ALL" onClick={setVisibilityFilter}>
        All
      </Link>{" "}
      |{" "}
      <Link filter="SHOW_ACTIVE" onClick={setVisibilityFilter}>
        Active
      </Link>{" "}
      |{" "}
      <Link filter="SHOW_COMPLETED" onClick={setVisibilityFilter}>
        Completed
      </Link>
    </footer>
  );
};

let nextTodoId = 0;
export default function App() {
  const [todos, setTodos] = useState([
    {
      id: nextTodoId++,
      text: "Learn React",
      completed: true
    },
    {
      id: nextTodoId++,
      text: "Learn Redux",
      completed: false
    }
  ]);

  // filter: 'SHOW_ALL', 'SHOW_ACTIVE', 'SHOW_COMPLETED'
  const [visibilityFilter, setVisibilityFilter] = useState("SHOW_ALL");

  const onSubmit = text => {
    setTodos([
      ...todos,
      {
        id: ++nextTodoId,
        text: text,
        completed: false
      }
    ]);
  };

  const onTodoClick = id => {
    setTodos(
      todos.map(todo => {
        if (todo.id !== id) {
          return todo;
        }

        todo.completed = !todo.completed;
        return todo;
      })
    );
  };

  return (
    <div className="App">
      <TodoList
        todos={getVisibleTodos(todos, visibilityFilter)}
        onTodoClick={onTodoClick}
      />
      <AddTodo onSubmit={onSubmit} />
      <Footer setVisibilityFilter={setVisibilityFilter} />
    </div>
  );
}
