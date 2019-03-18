# Django React/Redux Base Project

This is a forked version of the Django Seedstars based project. It uses Django as backend and React as frontend.

I've made a number of re-factoring decisions here:

- I've updated to later versions of react, redux and other dependencies. 
- I've re-architected the structure to the [react philosophy outlined here](https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1) which I really enjoyed.
- I've re-written it to use `redux-saga` over `redux-thunk` because I find it easier to follow and better to avoid callback hell. 
- I've re-written it to use functional components where state wasn't required.

There are a number of other decisions which happened on upgrading the various libraries:

- Login barriers are now implemented with a component which uses error boundaries as described here.  I found I had to `setState` along with my redirect for reasons unknown. (See below.)
- I've overridden some of the default BS4 form styling, because it was less work to do that, than to alter `tcomb-forms` to work with BS4. (See below.)
- If you use basic auth with fetch/axios and the server returns a 401, then it endlessly re-prompts for basic auth until cancelled. To get around that, I've set-up Django to return a 403. This isn't technically correct, but it prevents the UI jankiness and it all works fine.

There have been a number of package updates as well as, re-architecting it to be more modular.

What follows is some painfully detailed documentation as I worked through to understand this project. This is my first experience with React so feel free to skip over a lot of what is below if you're experienced.

## Frontend

*The documentation on this will undoubtedly be more fully featured than the Django section with which I already have a lot more comfort.*

### Index.js -- Pulling everything together

`Index.js` is the first file that runs. It:

- Pulls in the base template from `index.html`
- Creates a redux store in `store.js`
- Imports the app from `scenes/Root`
- Checks if a session exists and if it does, log the user in.
- Renders the app.

### How is the app built

- `Root.js` contains the base of the app. It basically exists for the purposes of optionally pulling in a React DevTools component. It includes the base app and the routes.
- `App.js` this then contains the main layout of the app. Header, footer etc. At this point we then move into individual scenes.

### Absolute imports

I've changed everything to use absolute imports, because I personally find it easier to understand where everything is importing from (rather than trying to unpick dots`../..` etc.).

Because I began the project by re-factoring it also made it notably easier.

We're not using `create-react-app` for our builds so in order to have absolute imports we can't use the default solution, you'll see listed all over the internet, instead we need to alter our webpack config.

In our main common webpack config we add in the root of our folder:

```javascript
resolve: {
	// We add in the directory of our application
    modules: ["node_modules", "src/static"]
},
```

ESlint doesn't recognise absolute imports by default so we then have to install a plugin so it understands what is going on `eslint-plugin-import`  and then alter our `.eslintrc` accordingly. ([Source SO](https://stackoverflow.com/questions/50234858/how-to-change-eslint-settings-to-understand-absolute-import)).

### How do we link to other pages?

## Backend

### Authentication

This is worth spending some time explaining. As someone learning this, this system was one of the more confusing parts and helpfully for learning it touches most of our react installation.

The actual authentication process is as follows:

- First login: A user authenticates with basic authentication (user + pass)
- They receive a token which is stored in local storage.
- This token has a 10 hour expiration timer (customisable in Django settings).
- When a user makes a request with authentication that fails, the token & expiration time are checked and the user is logged out if necessary.



## Dev Things

### Build scripts

All the `npm` commands (e.g. `npm run dev`) and any other scripts mentioned here are all defined in `package.json`.

Both of the build commands are built of `webpack` .

### Hot reloading for sagas & reducers

You might notice, I'm not doing anything clever here, basically I couldn't get this to work :(

Unsure why as no obvious error messages, I suspect there is some subtly that a more experienced JS dev than myself could dig out of here. 

It was taking a lot of time to debug and wasn't a must have for me, so pull requests welcome!

### Debugging react & redux

We'll be using the Chrome/Firefox extension for both React and Redux dev tools.

Using them is as simple as installing them.

**Changes from base**

Doing this simplifies some of the configuration going on inside the app. The previous version of this installed redux dev tools as an in-app component. 

As a result the layout of the both `store` folder and `Root` component no longer require the triple file for production version development. 



