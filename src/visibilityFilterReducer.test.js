// SHOW_ALL
// SHOW_ACTIVE
// SHOW_COMPLETED

function visibilityFilterReducer(state = "SHOW_ALL", action) {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
}

test("should returns default state", () => {
  expect(visibilityFilterReducer(undefined, {})).toBe("SHOW_ALL");
});

test("should returns set visibilityFilter SHOW_ACTIVE", () => {
  const action = {
    type: "SET_VISIBILITY_FILTER",
    filter: "SHOW_ACTIVE"
  };

  expect(visibilityFilterReducer("SHOW_ALL", action)).toBe("SHOW_ACTIVE");
});

test("should returns set visibilityFilter SHOW_COMPLETED", () => {
  const action = {
    type: "SET_VISIBILITY_FILTER",
    filter: "SHOW_COMPLETED"
  };

  expect(visibilityFilterReducer("SHOW_ALL", action)).toBe("SHOW_COMPLETED");
});
