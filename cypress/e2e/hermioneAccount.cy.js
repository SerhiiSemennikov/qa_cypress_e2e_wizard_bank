/* eslint-disable cypress/no-assigning-return-values */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { faker } from '@faker-js/faker';
/// <reference types='cypress' />
import { getBalance } from '../support/generateUser.js';
describe('Bank app', () => {
  // const balance = 0;
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  // let labelText;
  const user = 'Hermoine Granger';
  const accountNumber = ['1001', '1002', '1003'];
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.title().should('eq', 'XYZ Bank');
    cy.assertPageUrl('#/login');
    cy.contains('.btn', 'Customer Login').click();
    cy.get('select[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();
    cy.assertPageUrl('#/account');
    cy.get('#accountSelect').select(accountNumber[0]);
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong.ng-binding', accountNumber[0])
      .should('be.visible');

    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .invoke('text')
      .then((text) => {
        const startBalance = Number(text.trim());
        cy.log(startBalance);
        cy.contains('[ng-hide="noAccount"]', 'Balance')
          .contains('strong.ng-binding', startBalance)
          .should('be.visible').should('have.text', startBalance.toString());
      });

    cy.contains('[ng-hide="noAccount"]', 'Currency').contains('strong.ng-binding', 'Dollar').should('be.visible');
    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .invoke('text')
      .then((text) => {
        const beforeDeposit = Number(text.trim());
        cy.log(beforeDeposit);

        cy.get('[ng-click="deposit()"]').click();
        cy.get('[placeholder="amount"]').type(depositAmount);

        cy.contains('[type="submit"]', 'Deposit').click();

        cy.get('.borderM > :nth-child(3) > :nth-child(2)')
          .invoke('text')
          .then((text) => {
            const afterDeposit = Number(text.trim());
            cy.log(afterDeposit);
            expect(afterDeposit - beforeDeposit).to.equal(Number(depositAmount));
          });
      });

    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance').should('be.visible');

    /* cy.get(".borderM > :nth-child(3) > :nth-child(2)").as("myInputField");
    // Later in the test
    cy.get("@myInputField").then(($input) => {
      const value = $input.val();
      cy.log(`Value from alias: ${value}`);
    }); */

    // Example: Get input value and store in a const

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');

    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .invoke('text')
      .then((text) => {
        const beforeWithdraw = Number(text.trim());
        cy.log(beforeWithdraw);

        cy.get('[placeholder="amount"]').type(withdrawAmount);
        cy.contains('[type="submit"]', 'Withdraw').click();

        cy.get('.borderM > :nth-child(3) > :nth-child(2)')
          .invoke('text')
          .then((text) => {
            const afterWithdraw = Number(text.trim());
            cy.log(afterWithdraw);
            expect(beforeWithdraw - afterWithdraw).to.equal(Number(withdrawAmount));
          });
      });

    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance').should('be.visible');
    cy.get('.borderM > :nth-child(3) > :nth-child(2)').should('be.visible');

    cy.get('[ng-class="btnClass1"]').should('include.text', 'Transactions').click();
    cy.assertPageUrl('#/listTx');
    cy.get(':nth-child(2) > a').should('have.text', 'Amount');

    cy.get('table.table.table-bordered.table-striped tr').should('have.length.greaterThan', 1);

    cy.get(':nth-child(3) > a').should('have.text', 'Transaction Type');
    cy.get(':nth-child(1) > a').should('include.text', 'Date-Time');
    cy.get('.fixedTopBox > [style="float:left"]').click();
    cy.assertPageUrl('#/account');

    cy.get('#accountSelect').select(accountNumber[1]);
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong.ng-binding', accountNumber[1])
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .contains('strong.ng-binding', 'Pound')
      .should('be.visible');
    cy.get('[ng-class="btnClass1"]').should('include.text', 'Transactions').click();
    cy.get('table.table.table-bordered.table-striped tr').should(
      'have.length',
      1
    );

    cy.get('.logout').click();
    cy.assertPageUrl('#/customer');
  });
});
