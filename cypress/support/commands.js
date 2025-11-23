// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/// <reference types="cypress" />
const { generateUser } = require('../support/generateUser');

Cypress.Commands.add('findByPlaceholder', (placeholder) => {
  cy.get(`[placeholder=${placeholder}]`);
});
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  originalFn(url);
});
Cypress.Commands.add('assertPageUrl', (url) => {
  // cy.hash().should("eq", "#" + url);
  cy.url().should('eq', Cypress.config().baseUrl + url);
});

Cypress.Commands.add('registerNewUser', () => {
  const { userName, email, password } = generateUser();
  cy.request('POST', Cypress.config().baseUrl + '/users', {
    user: {
      username: userName,
      email,
      password
    }
  }).then((response) => ({ ...response.body.user, password }));
});
Cypress.Commands.add('findByTestId', (value) => {
  cy.get(`[data-cy=${value}]`);
});
// Usage:
// cy.registerNewUser().then(({ userName, email, password }) => {
//   // use userName, email, password
// });

Cypress.Commands.add('checkAuthorization', (username) => {
  cy.findByTestId('header-username').should('contain.text', username);
});

Cypress.Commands.add('login', (user) => {
  cy.request('POST', 'users/login', {
    user
  }).then((response) => {
    cy.setCookie('drash_sess', response.body.user.token);
  });
});
Cypress.Commands.add('logout', () => {
  cy.clearCookie('drash_sess');
});
