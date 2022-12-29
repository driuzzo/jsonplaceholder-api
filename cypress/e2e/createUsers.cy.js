/// <reference types="cypress" />


it('creates todos', () => {
    
    const todos = require('../fixtures/example')

    for (var index in todos) {
        
        cy.api('POST', '/todos', {
            userid: todos[index].userid,
            title: todos[index].title,
            completed: todos[index].completed
        })
    }    
})