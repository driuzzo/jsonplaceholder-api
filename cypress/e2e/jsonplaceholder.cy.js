/// <reference types="cypress" />

describe("happy path api tests", () => {

    it('gets all resources', () => {
            
        cy.api('GET', 'https://jsonplaceholder.typicode.com/posts')
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.length).to.eq(100)
            })
    })

    it('gets a todo', () => {

        cy.api('GET', 'https://jsonplaceholder.typicode.com/todos/1')
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.userId).to.eq(1)
            })
    })

    it('creates a resource', () => {
        
        cy.api('POST', 'https://jsonplaceholder.typicode.com/posts', {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: {
                title: 'QA',
                body: 'Driuzzo',
                userId: 1
            }
        })
        .then((response) => {
            console.log(response)
            expect(response.status).to.eq(201)
            expect(response.body.body.title).to.eq('QA')
            expect(response.body.body.body).to.eq('Driuzzo')
        })
    })
})