/// <reference types="cypress" />

const { faker } = require('@faker-js/faker')



describe('happy path api tests', () => {

    context('gets all resources', () => {

        it('gets all posts', () => {

            let postsPerUser = 0;            
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/posts')
                .then((response) => {

                    for(var index in response.body) {
                        if (response.body[index].userId == 1) {
                            postsPerUser = postsPerUser +1;
                        }
                    }
                    
                    expect(postsPerUser).to.eq(10)
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
            let todosPerUser = 0
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/todos')
                .then((response) => {

                    for(var index in response.body) {
                        if (response.body[index].userId == 1) {
                            todosPerUser = todosPerUser +1;
                        }
                    }
                    
                    expect(todosPerUser).to.eq(20)
                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(200)
                })
        })
    })
    
    context('post tests', () => {
        const postId = 100
        let postTitle

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

        it('gets a post comments', () => {

            cy.api('GET', `https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(5)
                })
        })
    })

    context('user tests', () => {
        const userId = 1
        let userName = ''

        it('gets an user', () => {

            cy.api('GET', `https://jsonplaceholder.typicode.com/users/${userId}`)
                .then((response) => {
                    userName = response.body.name
                    expect(response.status).to.eq(200)
                    cy.wrap(userName)
                })
        })

        it('gets all posts from an user', () => {
            
            cy.api('GET', `https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(10)
                })
        })

        it('creates an user', () => {
    
            const name = faker.name.fullName()
            
            cy.api('POST', 'https://jsonplaceholder.typicode.com/users', {
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: {
                    name: name
                }
            })
            .then((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.body.name).to.eq(name)
            })
        })

        it('updates an user', () => {
    
            const editedName = userName + ' edited'
    
            cy.api('PUT', `https://jsonplaceholder.typicode.com/users/${userId}`, {
                body: {
                    name: editedName
                }
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.body.name).not.to.eq(userName)
                expect(response.body.body.name).to.eq(editedName)
            })
        })

        it('deletes an user', () => {
    
            cy.api('DELETE', `https://jsonplaceholder.typicode.com/users/${userId}`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.empty
                })
        })
    })
})