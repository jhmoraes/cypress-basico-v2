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
//    EXEMPLOS DE FUNÇÕES COSTUMIZADAS
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

//1º argumento é o nome da funçãi e o 2ºargumento é a função em si.
Cypress.Commands.add('fillMandatoryFieldsAndSubmit',(nome, sobrenome, email, tel, msg)=>{
    cy.get('#firstName').type(nome)
    cy.get('#lastName').type(sobrenome)
    cy.get('#email').type(email)
    cy.get('#phone').type(tel)
    cy.get('#open-text-area').type(msg, {delay: 0})
    //cy.get('button[type="submit"]').click()
    cy.contains('button','Enviar').click()
    // também posso usar o contains
    // ele vai procurar 1 seletor css button com a palavra Enviar
    // não pode ter vários na mesma página
    // estou identificando porque é o unico button com a palavra Enviar
})


