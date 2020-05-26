import React from "react";
import { createStore } from "redux";
import { connect, Provider } from "react-redux";

function counterReducer(state = 999, action) {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;

    case "DECREMENT":
      return state - 1;

    case "RESET":
      return 0;

    default:
      break;
  }
  return state;
}

const store = createStore(counterReducer);
store.subscribe(() => {
  console.log(store.getState());
});

let App = props => {
  console.log(props);
  return (
    <div>
      <p>Count: {props.count}</p>
      <button onClick={() => props.increment()}>+1</button>
      <button onClick={() => props.decrement()}>-1</button>
      <button onClick={() => props.reset()}>reset</button>
    </div>
  );
};

// https://react-redux.js.org/using-react-redux/connect-mapstate
const mapStateToProps = state => {
  return {
    count: state
  };
};
// https://react-redux.js.org/using-react-redux/connect-mapdispatch
const mapDispatchToProps = dispatch => {
  return {
    increment: function() {
      dispatch({ type: "INCREMENT" });
    },
    decrement: function() {
      dispatch({ type: "DECREMENT" });
    },
    reset: function() {
      dispatch({ type: "RESET" });
    }
  };
};
App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

const TodoApp = () => {
  return (
    <Provider store={store} /* react-redux */>
      <App />
    </Provider>
  );
};

export default TodoApp;
