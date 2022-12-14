/// <reference types="cypress" />

const { faker } = require('@faker-js/faker')
let postTitle
const postId = 1

describe("happy path api tests", () => {

    it('gets all resources', () => {
            
        cy.api('GET', 'https://jsonplaceholder.typicode.com/posts')
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.length).to.eq(100)
            })
    })

    it('gets a todo', () => {

        cy.api('GET', `https://jsonplaceholder.typicode.com/posts/${postId}`)
            .then((response) => {
                postTitle = response.body.title
                expect(response.status).to.eq(200)
                expect(response.body.userId).to.eq(1)
                cy.wrap(postTitle)
            })
    })

    it('creates a resource', () => {

        const title = faker.random.words(2)
        const body = faker.random.words(4)
        
        cy.api('POST', 'https://jsonplaceholder.typicode.com/posts', {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: {
                title: title,
                body: body,
                userId: 1
            }
        })
        .then((response) => {
            console.log(response)
            expect(response.status).to.eq(201)
            expect(response.body.body.title).to.eq(title)
            expect(response.body.body.body).to.eq(body)
        })
    })

    it('updates a resource', () => {

        const title = faker.random.words(2)
        const body = faker.random.words(4)

        cy.api('PUT', `https://jsonplaceholder.typicode.com/posts/${postId}`, {
            body: {
                title: title,
                body: body,
                userId: 1
            }
        })
        .then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.body.title).to.eq(title)
            expect(response.body.body.body).to.eq(body)
            expect(response.body.body.title).not.to.eq(postTitle)
        })
    })

    it('deletes a resource', () => {

        cy.api('DELETE', `https://jsonplaceholder.typicode.com/posts/${postId}`)
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.empty
            })
        })
})