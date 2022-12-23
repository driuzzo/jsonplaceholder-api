/// <reference types="cypress" />

const { faker } = require('@faker-js/faker')
const userId = 9

describe('happy path api tests', () => {

    let postslength
    let userslength
    let commentslength
    let albumslength
    let photoslength
    let todoslength

    context('gets all resources', () => {

        it('gets all posts', () => {

            let postsPerUser = 0;
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/posts')
                .then((response) => {
                    postslength = response.body.length

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
                    userslength = response.body.length

                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(10)
                })
        })
    
        it('gets all comments', () => {
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/comments')
                .then((response) => {
                    commentslength = response.body.length

                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(500)
                })
        })
    
        it('gets all albums', () => {
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/albums')
                .then((response) => {
                    albumslength = response.body.length

                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(100)
                })
        })
    
        it('gets all photos', () => {
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/photos')
                .then((response) => {
                    photoslength = response.body.length

                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(5000)
                })
        })

        it('gets all todos', () => {
            let todosPerUser = 0
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/todos')
                .then((response) => {
                    todoslength = response.body.length

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
                expect(response.body.id).to.eq(postslength+1)
            })
        })
    
        it('updates a post', () => {
    
            const title = faker.random.words(2)
            const body = faker.random.words(4)
    
            cy.api('PUT', `https://jsonplaceholder.typicode.com/posts/${postId}`, {    
                userId: postObject.userId,
                id: postObject.id,
                title: title,
                body: body
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.title).to.eq(title)
                expect(response.body.body).to.eq(body)
                expect(response.body.title).not.to.eq(postObject.title)
                expect(response.body.body).not.to.eq(postObject.body)
            })
        })

        it('patches a post', () => {

            cy.api('PATCH', `https://jsonplaceholder.typicode.com/posts/${postId}`, {
                title: 'foo',
                body: 'bar'
            })
            .then((response) => {
                expect(response.body.title).to.eq('foo')
                expect(response.body.body).to.eq('bar')
                expect(response.body.title).not.to.eq(postObject.title)
                expect(response.body.body).not.to.eq(postObject.body)
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
            
            cy.api('GET', `https://jsonplaceholder.typicode.com/users/${userId}/posts`)
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
                expect(response.body.id).to.eq(userslength+1)
            })
        })

        it('updates an user', () => {
    
            const editedName = userObject.name + ' edited'
    
            cy.api('PUT', `https://jsonplaceholder.typicode.com/users/${userId}`, {
                    id: userObject.id,
                    name: editedName,
                    username: userObject.username,
                    email: userObject.email,
                    address: {
                        street: userObject.address.street,
                        suite: userObject.address.suite,
                        city: userObject.address.city,
                        zipcode: userObject.address.zipcode,
                        geo: {
                            lat: userObject.address.geo.lat,
                            lng: userObject.address.geo.lng
                        }
                    },
                    phone: userObject.phone,
                    website: userObject.website,
                    company: {
                        name: userObject.company.name,
                        catchPhrase: userObject.company.catchPhrase,
                        bs: userObject.company.bs
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
                expect(response.status).to.eq(200)
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
                    cy.wrap(todoObject)
                })
        })

        it('gets all todos from an user', () => {
            
            let userObject 
            let userObjectincompletedTodo = 0
            let userObjectcompletedTodo = 0
            let incompleteTodo = 0
            let completeTodo = 0

            cy.request('GET', `https://jsonplaceholder.typicode.com/users/${userId}/todos`)
                .then((response) => {
                    userObject = response.body

                    for(var index in userObject) {
                        if (userObject[index].completed == false) {
                            userObjectincompletedTodo = userObjectincompletedTodo +1;
                        }
                        else {
                            userObjectcompletedTodo = userObjectcompletedTodo +1;
                        }
                    }
                })

            cy.api('GET', `https://jsonplaceholder.typicode.com/todos?userId=${userId}`)
                .then((response) => {

                    for(var index in response.body) {
                        if (response.body[index].completed == false) {
                            incompleteTodo = incompleteTodo +1;
                        }
                        else {
                            completeTodo = completeTodo +1;
                        }
                    }
                    expect(incompleteTodo).to.eq(userObjectincompletedTodo)
                    expect(completeTodo).to.eq(userObjectcompletedTodo)
                })
        })

        it('creates a todo', () => {
    
            const fakeTodo = {
                userId: faker.datatype.number({min: 1, max: 10}),
                title: faker.random.words(4),
                completed: faker.datatype.boolean()
            }
            
            cy.api('POST', 'https://jsonplaceholder.typicode.com/todos', {
                    userId: fakeTodo.userId,
                    title: fakeTodo.title,
                    completed: fakeTodo.completed
            })
            .then((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.userId).to.eq(fakeTodo.userId)
                expect(response.body.title).to.eq(fakeTodo.title)
                expect(response.body.completed).to.eq(fakeTodo.completed)
                expect(response.body.id).to.eq(todoslength+1)
            })
        })

        it('updates a todo', () => {
    
            const editedTodo = todoObject.title + ' edited'
    
            cy.api('PUT', `https://jsonplaceholder.typicode.com/todos/${todoId}`, {
                    userId: todoObject.userId,
                    title: editedTodo,
                    completed: todoObject.completed
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.title).not.to.eq(todoObject.title)
                expect(response.body.title).to.eq(editedTodo)
            })
        })

        it('patches a todo', () => {
            let completed
            if (todoObject.completed === false) {
                completed = true
            } 
            else {
                completed = false
            }

            cy.api('PATCH', `https://jsonplaceholder.typicode.com/todos/${todoId}`, {
                    title: 'foo',
                    completed: completed
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.title).to.eq('foo')
                expect(response.body.completed).to.eq(completed)
                expect(response.body.completed).not.to.eq(todoObject.completed)
            })
        })

        it('deletes a todo', () => {
    
            cy.api('DELETE', `https://jsonplaceholder.typicode.com/todos/${todoId}`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.empty
                })
        })
    })

    context('album tests', () => {

        const albumId = 1
        let albumObject
        
        it('gets an album', () => {
            cy.api('GET', `https://jsonplaceholder.typicode.com/albums/${albumId}`)
                .then((response) => {
                    albumObject = response.body
                    expect(response.status).to.eq(200)
                    cy.wrap(albumObject)
                })
        })

        it('creates an album', () => {
    
            const fakeAlbum = {
                userId: faker.datatype.number({min: 1, max: 10}),
                title: faker.random.words(4)
            }
            
            cy.api('POST', 'https://jsonplaceholder.typicode.com/albums', {
                    userId: fakeAlbum.userId,
                    title: fakeAlbum.title
            })
            .then((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.userId).to.eq(fakeAlbum.userId)
                expect(response.body.title).to.eq(fakeAlbum.title)
                expect(response.body.id).to.eq(albumslength+1)
            })
        })

        it('updates an album', () => {
    
            const editedAlbum = albumObject.title + ' edited'
    
            cy.api('PUT', `https://jsonplaceholder.typicode.com/albums/${albumId}`, {
                    id: albumObject.id,
                    userId: albumObject.userId,
                    title: editedAlbum
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.title).not.to.eq(albumObject.title)
                expect(response.body.title).to.eq(editedAlbum)
            })
        })

        it('patches an album', () => {
            
            cy.api('PATCH', `https://jsonplaceholder.typicode.com/albums/${albumId}`, {
                    title: 'foo'
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.title).to.eq('foo')
            })
        })

        it('deletes an album', () => {
    
            cy.api('DELETE', `https://jsonplaceholder.typicode.com/albums/${albumId}`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.empty
                })
        })
    })
})