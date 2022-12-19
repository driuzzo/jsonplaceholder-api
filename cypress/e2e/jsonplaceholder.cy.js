/// <reference types="cypress" />

const { faker } = require('@faker-js/faker')
let postTitle
const postId = 100

describe('happy path api tests', () => {

    context('gets all resources', () => {

        it('gets all posts', () => {
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/posts')
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(100)
                })
        })
    
        it('gets all users', () => {
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/users')
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(10)
                })
        })
    
        it('gets all comments', () => {
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/comments')
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(500)
                })
        })
    
        it('gets all albums', () => {
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/albums')
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(100)
                })
        })
    
        it('gets all photos', () => {
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/photos')
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(5000)
                })
        })

        it('gets all todos', () => {
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/todos')
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(200)
                })
        })
    })
    
    context('post tests', () => {

        it('gets a post', () => {

            cy.api('GET', `https://jsonplaceholder.typicode.com/posts/${postId}`)
                .then((response) => {
                    postTitle = response.body.title
                    expect(response.status).to.eq(200)
                    cy.wrap(postTitle)
                })
        })
    
        it('creates a post', () => {
    
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
    
        it('updates a post', () => {
    
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
    
        it('deletes a post', () => {
    
            cy.api('DELETE', `https://jsonplaceholder.typicode.com/posts/${postId}`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.empty
                })
            })
    })
    
})