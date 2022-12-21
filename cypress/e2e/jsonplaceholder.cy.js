/// <reference types="cypress" />

const { faker } = require('@faker-js/faker')
const userId = 1

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
        let postObject

        it('gets a post', () => {

            cy.api('GET', `https://jsonplaceholder.typicode.com/posts/${postId}`)
                .then((response) => {
                    postObject = response.body
                    expect(response.status).to.eq(200)
                    cy.wrap(postObject)
                })
        })
    
        it('creates a post', () => {
    
            const title = faker.random.words(2)
            const body = faker.random.words(4)
            
            cy.api('POST', 'https://jsonplaceholder.typicode.com/posts', {
                userId: 1,        
                title: title,
                body: body
            })
            .then((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.title).to.eq(title)
                expect(response.body.body).to.eq(body)
                expect(response.body.id).to.eq(101)
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
                expect(response.body.body.title).not.to.eq(postObject.title)
                expect(response.body.body.body).not.to.eq(postObject.body)
            })
        })

        it('patches a post', () => {

            cy.api('PATCH', `https://jsonplaceholder.typicode.com/posts/${postId}`, {
                body: {
                    title: 'foo',
                    body: 'bar'
                }
            })
            .then((response) => {
                expect(response.body.body.title).to.eq('foo')
                expect(response.body.body.body).to.eq('bar')
                expect(response.body.body.title).not.to.eq(postObject.title)
                expect(response.body.body.body).not.to.eq(postObject.body)
            })
        })
    
        it('deletes a post', () => {
    
            cy.api('DELETE', `https://jsonplaceholder.typicode.com/posts/${postId}`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.empty
                })
            })

        it('gets comments from a post', () => {

            cy.api('GET', `https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(5)
                })
        })
    })

    context('user tests', () => {
        let userObject

        it('gets an user', () => {

            cy.api('GET', `https://jsonplaceholder.typicode.com/users/${userId}`)
                .then((response) => {
                    userObject = response.body
                    expect(response.status).to.eq(200)
                    cy.wrap(userObject)
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
    
            const fakeUser = {
                name: faker.name.fullName(),
                username: faker.internet.userName(),
                email: faker.internet.email().toLowerCase(),
                address: {
                    street: faker.address.streetName(),
                    suite: faker.address.secondaryAddress(),
                    city: faker.address.cityName(),
                    zipcode: faker.address.zipCode(),
                    geo: {
                        lat: faker.address.latitude(),
                        lng: faker.address.longitude(),
                    }
                },
                phone: faker.phone.number(),
                website: faker.random.word().toLowerCase() + '.com',
                company: {
                    name: faker.random.words(2),
                    catchPhrase: faker.random.words(4),
                    bs: faker.random.words(3)
                }
            }
            
            cy.api('POST', 'https://jsonplaceholder.typicode.com/users', {
                    name: fakeUser.name,
                    username: fakeUser.username,
                    email: fakeUser.email,
                    address: {
                        street: fakeUser.address.street,
                        suite: fakeUser.address.suite,
                        city: fakeUser.address.city,
                        zipcode: fakeUser.address.zipcode,
                        geo: {
                        lat: fakeUser.address.geo.lat,
                        lng: fakeUser.address.geo.lng,
                        }
                    },
                    phone: fakeUser.phone,
                    website: fakeUser.website,
                    company: {
                        name: fakeUser.company.name,
                        catchPhrase: fakeUser.company.catchPhrase,
                        bs: fakeUser.company.bs
                    }
            })
            .then((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.name).to.eq(fakeUser.name)
                expect(response.body.id).to.eq(11)
            })
        })

        it('updates an user', () => {
    
            const editedName = userObject.name + ' edited'
    
            cy.api('PUT', `https://jsonplaceholder.typicode.com/users/${userId}`, {
                    id: 1,
                    name: editedName,
                    username: "Bret",
                    email: "Sincere@april.biz",
                    address: {
                        street: "Kulas Light",
                        suite: "Apt. 556",
                        city: "Gwenborough",
                        zipcode: "92998-3874",
                        geo: {
                        lat: "-37.3159",
                        lng: "81.1496"
                        }
                    },
                    phone: "1-770-736-8031 x56442",
                    website: "hildegard.org",
                    company: {
                        name: "Romaguera-Crona",
                        catchPhrase: "Multi-layered client-server neural-net",
                        bs: "harness real-time e-markets"
                    }
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.name).not.to.eq(userObject.name)
                expect(response.body.name).to.eq(editedName)
            })
        })

        it('patches an user', () => {

            cy.api('PATCH', `https://jsonplaceholder.typicode.com/users/${userId}`, {
                    username: 'foo',
                    website: 'bar'
            })
            .then((response) => {
                expect(response.body.username).to.eq('foo')
                expect(response.body.website).to.eq('bar')
                expect(response.body.username).not.to.eq(userObject.username)
                expect(response.body.website).not.to.eq(userObject.website)
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

    context('todo tests', () => {

        const todoId = 1
        let todoObject

        it('gets a todo', () => {

            cy.api('GET', `https://jsonplaceholder.typicode.com/todos/${todoId}`)
                .then((response) => {
                    todoObject = response.body
                    expect(response.status).to.eq(200)
                    expect(response.body.completed).to.eq(false)
                    cy.wrap(todoObject)
                })
        })

        it('gets all todos from an user', () => {

            let incompleteTodo = 0
            let completeTodo = 0

            cy.api('GET', `https://jsonplaceholder.typicode.com/todos?userId=${userId}`)
                .then((response) => {
                    console.log(response)

                    for(var index in response.body) {
                        if (response.body[index].completed == false) {
                            incompleteTodo = incompleteTodo +1;
                        }
                        else {
                            completeTodo = completeTodo +1;
                        }
                    }
                    expect(incompleteTodo).to.eq(9)
                    expect(completeTodo).to.eq(11)
                })
        })
    })
})