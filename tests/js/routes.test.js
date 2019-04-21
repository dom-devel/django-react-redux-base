// React imports
import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { createMemoryHistory } from "history";

// Testing helpers
import {
    render,
    // fireEvent,
    cleanup,
    waitForElement
} from "react-testing-library";

// Local imports
import configureStore from "store/configureStore";
import Root from "scenes/Root/Root";
import auth from "services/auth/auth";
import * as urls from "routesConstants";

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

test("Check that login page that can be reached", async () => {
    // Setup full test
    const setup = prepareConnectedComponents(urls.AUTH_LOGIN);
    const { getByTestId } = render(
        <Root store={setup.store} history={setup.history} />
    );

    await waitForElement(() => getByTestId(/loginForm/i));
});

test("Check that restricted page can't be reached on for unauthed user.", async () => {
    const authLoggedInMock = jest
        .spyOn(auth, "loggedIn")
        .mockImplementation(() => {
            return false;
        });

    // Setup full test
    const setup = prepareConnectedComponents(urls.EXAMPLE_RESTRICTED);
    const { getByTestId } = render(
        <Root store={setup.store} history={setup.history} />
    );

    await waitForElement(() => getByTestId(/loginForm/i));

    // Reset jest mock
    authLoggedInMock.mockRestore();
});

test("Check that restricted page can't be reached on for unauthed user.", async () => {
    const authLoggedInMock = jest
        .spyOn(auth, "loggedIn")
        .mockImplementation(() => {
            return true;
        });

    // Setup full test
    const setup = prepareConnectedComponents(urls.EXAMPLE_RESTRICTED);
    const { getByTestId } = render(
        <Root store={setup.store} history={setup.history} />
    );

    await waitForElement(() => getByTestId(/loginForm/i));

    // Reset jest mock
    authLoggedInMock.mockRestore();
});
