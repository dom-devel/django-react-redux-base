// This file contains no code, but does seem like the logical place
// to talk about how this module works.

// React is created with building blocks. Each of these blocks might be
// making requests and requiring their own status updates and messages.

// But there are also plenty of pages which are just one single block, e.g. a
// user profile. This is the generic message block + status for any page with
// a single purpose and no single module.

// Other scenes/components can use this as a generic redux store to pull messages
// or the state of requests from.

// The messages will clear themselves everytime the path changes. That means if you want
// to pass a message when redirecting page you'll need to set the message post
// changing URL.

// Currently index.js is clearing the message between loads.
