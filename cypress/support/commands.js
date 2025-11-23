
/// <reference types="cypress" />

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

Cypress.Commands.add('findByTestId', (value) => {
  cy.get(`[data-cy=${value}]`);
});

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
