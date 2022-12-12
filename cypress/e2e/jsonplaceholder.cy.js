/// <reference types="cypress" />

describe("happy path api tests", () => {
    
    it('get a todo', () => {
        //cy.visit('https://on.cypress.io/request')
    
        cy.request('GET', 'https://jsonplaceholder.typicode.com/todos/1')
            .then((response) => {
                console.log(response)
                expect(response.status).to.eq(200)
                expect(response.body.userId).to.eq(1)
            })    
    })
})

