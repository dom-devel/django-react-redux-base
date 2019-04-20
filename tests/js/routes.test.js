import React from "react";
// import { withRouter } from "react-router";
import { Provider } from "react-redux";
// import { Link, Route, Router, Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { createMemoryHistory } from "history";
import {
  render,
  // fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";

// import history from "utils/history";
import configureStore from "store/configureStore";

import Root from "scenes/Root/Root";

// Ok, so here's what your tests might look like
afterEach(cleanup);

// Render element with connected router if needed. Left in here for example,
// because we're only testing the routes we are just using the root element,
// which needs to have history & store submitted to it.
// function renderWithRouter(
//   ui,
//   {
//     route = "/",
//     history = createMemoryHistory({ initialEntries: [route] })
//   } = {}
// ) {
//   // let store;
//   const initialState = {};
//   const store = configureStore(initialState, history);
//   return {
//     ...render(
//       <Provider store={store}>
//         <ConnectedRouter history={history}>{ui}</ConnectedRouter>
//       </Provider>
//     ),
//     // adding `history` to the returned utilities to allow us
//     // to reference it in our tests (just try to avoid using
//     // this to test implementation details).
//     history
//   };
// }

function prepareConnectedComponents(route) {
  const history = createMemoryHistory({ initialEntries: [route] });
  const initialState = {};
  const store = configureStore(initialState, history);
  return {
    store,
    history
  };
}

// test("full app rendering/navigating", () => {
//   const { container, getByText } = renderWithRouter(<App />);
//   // normally I'd use a data-testid, but just wanted to show this is also possible
//   expect(container.innerHTML).toMatch("You are home");
//   const leftClick = { button: 0 };
//   fireEvent.click(getByText(/about/i), leftClick);
//   // normally I'd use a data-testid, but just wanted to show this is also possible
//   expect(container.innerHTML).toMatch("You are on the about page");
// });

// test("landing on a bad page", () => {
//   const { container } = renderWithRouter(<App />, {
//     route: "/something-that-does-not-match"
//   });
//   // normally I'd use a data-testid, but just wanted to show this is also possible
//   expect(container.innerHTML).toMatch("No match");
// });

test("rendering a scene that uses withRouter", async () => {
  const setup = prepareConnectedComponents("/login/");

  const { getByText } = render(
    <Root store={setup.store} history={setup.history} />
  );
  // expect(getByTestId("location-display").textContent).toBe(route);
  await waitForElement(() => getByText(/login/i));
});
