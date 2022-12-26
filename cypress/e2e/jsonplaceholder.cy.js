/// <reference types="cypress" />

const { faker } = require('@faker-js/faker')
const userId = 9

describe('happy path api tests', () => {

    let lengths = {
        "postslength": 0,
        "userslength": 0,
        "commentslength": 0,
        "albumslength": 0,
        "photoslength": 0,
        "todoslength": 0
    }

    const ids = {
        "postId": 10,
        "userId": 1,
        "todoId": 1,
        "albumId": 1,
        "commentId": 1,
        "photoId": 1
    }

    let objects = {
        "postObject": {},
        "userObject": {},
        "todoObject": {},
        "albumObject": {},
        "commentObject": {},
        "photoObject": {}
    }
    
    context('post tests', () => {

        it('gets all posts', () => {

            let postsPerUser = 0;
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/posts')
                .then((response) => {

                    lengths.postslength = response.body.length

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

        it('gets a post', () => {

            cy.api('GET', `https://jsonplaceholder.typicode.com/posts/${ids.postId}`)
                .then((response) => {
                    objects.postObject = response.body
                    expect(response.status).to.eq(200)
                    cy.wrap(objects.postObject)
                })
        })
    
        it('creates a post', () => {
            
            const fakePost = {
                userId: faker.datatype.number({min: 1, max: 10}),
                id: lengths.postslength +1,
                title: faker.random.words(2),
                body: faker.random.words(4)
            }
            
            cy.api('POST', 'https://jsonplaceholder.typicode.com/posts', {
                userId: fakePost.userId,
                id: fakePost.id,
                title: fakePost.title,
                body: fakePost.body
            })
            .then((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.title).to.eq(fakePost.title)
                expect(response.body.body).to.eq(fakePost.body)
                expect(response.body.id).to.eq(fakePost.id)
            })
        })
    
        it('updates a post', () => {
    
            const editedPost = objects.postObject.title + ' edited'
    
            cy.api('PUT', `https://jsonplaceholder.typicode.com/posts/${ids.postId}`, {    
                userId: objects.postObject.userid,
                id: objects.postObject.id,
                title: editedPost,
                body: objects.postObject.body
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.title).to.eq(editedPost)
                expect(response.body.title).not.to.eq(objects.postObject.title)
            })
        })

        it('patches a post', () => {

            cy.api('PATCH', `https://jsonplaceholder.typicode.com/posts/${ids.postId}`, {
                title: 'foo',
                body: 'bar'
            })
            .then((response) => {
                expect(response.body.title).to.eq('foo')
                expect(response.body.body).to.eq('bar')
                expect(response.body.title).not.to.eq(objects.postObject.title)
                expect(response.body.body).not.to.eq(objects.postObject.body)
            })
        })
    
        it('deletes a post', () => {
    
            cy.api('DELETE', `https://jsonplaceholder.typicode.com/posts/${ids.postId}`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.empty
                })
            })

        it('gets comments from a post', () => {

            cy.api('GET', `https://jsonplaceholder.typicode.com/posts/${ids.postId}/comments`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(5)
                })
        })
    })

    context('user tests', () => {

        it('gets all users', () => {
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/users')
                .then((response) => {
                    lengths.userslength = response.body.length

                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(10)
                })
        })

        it('gets an user', () => {

            cy.api('GET', `https://jsonplaceholder.typicode.com/users/${ids.userId}`)
                .then((response) => {
                    objects.userObject = response.body
                    expect(response.status).to.eq(200)
                    cy.wrap(objects.userObject)
                })
        })

        it('gets all posts from an user', () => {
            
            cy.api('GET', `https://jsonplaceholder.typicode.com/users/${ids.userId}/posts`)
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
                expect(response.body.id).to.eq(lengths.userslength+1)
            })
        })

        it('updates an user', () => {
    
            const editedName = objects.userObject.name + ' edited'
    
            cy.api('PUT', `https://jsonplaceholder.typicode.com/users/${ids.userId}`, {
                    id: objects.userObject.id,
                    name: editedName,
                    username: objects.userObject.username,
                    email: objects.userObject.email,
                    address: {
                        street: objects.userObject.address.street,
                        suite: objects.userObject.address.suite,
                        city: objects.userObject.address.city,
                        zipcode: objects.userObject.address.zipcode,
                        geo: {
                            lat: objects.userObject.address.geo.lat,
                            lng: objects.userObject.address.geo.lng
                        }
                    },
                    phone: objects.userObject.phone,
                    website: objects.userObject.website,
                    company: {
                        name: objects.userObject.company.name,
                        catchPhrase: objects.userObject.company.catchPhrase,
                        bs: objects.userObject.company.bs
                    }
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.name).not.to.eq(objects.userObject.name)
                expect(response.body.name).to.eq(editedName)
            })
        })

        it('patches an user', () => {

            cy.api('PATCH', `https://jsonplaceholder.typicode.com/users/${ids.userId}`, {
                    username: 'foo',
                    website: 'bar'
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.username).to.eq('foo')
                expect(response.body.website).to.eq('bar')
                expect(response.body.username).not.to.eq(objects.userObject.username)
                expect(response.body.website).not.to.eq(objects.userObject.website)
            })
        })

        it('deletes an user', () => {
    
            cy.api('DELETE', `https://jsonplaceholder.typicode.com/users/${ids.userId}`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.empty
                })
        })
    })

    context('todo tests', () => {

        it('gets all todos', () => {
            let todosPerUser = 0
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/todos')
                .then((response) => {
                    lengths.todoslength = response.body.length

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

        it('gets a todo', () => {

            cy.api('GET', `https://jsonplaceholder.typicode.com/todos/${ids.todoId}`)
                .then((response) => {
                    objects.todoObject = response.body
                    expect(response.status).to.eq(200)
                    cy.wrap(objects.todoObject)
                })
        })

        it('gets all todos from an user', () => {
            
            let userObject
            let userObjectincompletedTodo = 0
            let userObjectcompletedTodo = 0
            let incompleteTodo = 0
            let completeTodo = 0

            cy.request('GET', `https://jsonplaceholder.typicode.com/users/${ids.userId}/todos`)
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

            cy.api('GET', `https://jsonplaceholder.typicode.com/todos?userId=${ids.userId}`)
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
                expect(response.body.id).to.eq(lengths.todoslength+1)
            })
        })

        it('updates a todo', () => {
    
            const editedTodo = objects.todoObject.title + ' edited'
    
            cy.api('PUT', `https://jsonplaceholder.typicode.com/todos/${ids.todoId}`, {
                    userId: objects.todoObject.userId,
                    title: editedTodo,
                    completed: objects.todoObject.completed
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.title).not.to.eq(objects.todoObject.title)
                expect(response.body.title).to.eq(editedTodo)
            })
        })

        it('patches a todo', () => {
            let completed
            if (objects.todoObject.completed === false) {
                completed = true
            } 
            else {
                completed = false
            }

            cy.api('PATCH', `https://jsonplaceholder.typicode.com/todos/${ids.todoId}`, {
                    title: 'foo',
                    completed: completed
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.title).to.eq('foo')
                expect(response.body.completed).to.eq(completed)
                expect(response.body.completed).not.to.eq(objects.todoObject.completed)
            })
        })

        it('deletes a todo', () => {
    
            cy.api('DELETE', `https://jsonplaceholder.typicode.com/todos/${ids.todoId}`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.empty
                })
        })
    })

    context('album tests', () => {

        it('gets all albums', () => {
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/albums')
                .then((response) => {
                    lengths.albumslength = response.body.length

                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(100)
                })
        })
        
        it('gets an album', () => {
            cy.api('GET', `https://jsonplaceholder.typicode.com/albums/${ids.albumId}`)
                .then((response) => {
                    objects.albumObject = response.body
                    expect(response.status).to.eq(200)
                    cy.wrap(objects.albumObject)
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
                expect(response.body.id).to.eq(lengths.albumslength+1)
            })
        })

        it('updates an album', () => {
    
            const editedAlbum = objects.albumObject.title + ' edited'
    
            cy.api('PUT', `https://jsonplaceholder.typicode.com/albums/${ids.albumId}`, {
                    id: objects.albumObject.id,
                    userId: objects.albumObject.userId,
                    title: editedAlbum
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.title).not.to.eq(objects.albumObject.title)
                expect(response.body.title).to.eq(editedAlbum)
            })
        })

        it('patches an album', () => {
            
            cy.api('PATCH', `https://jsonplaceholder.typicode.com/albums/${ids.albumId}`, {
                    title: 'foo'
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.title).to.eq('foo')
            })
        })

        it('deletes an album', () => {
    
            cy.api('DELETE', `https://jsonplaceholder.typicode.com/albums/${ids.albumId}`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.empty
                })
        })
    })

    context('comment tests', () => {
        
        it('gets all comments', () => {
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/comments')
                .then((response) => {
                    lengths.commentslength = response.body.length

                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(500)
                })
        })

        it('gets a comment', () => {

            cy.api('GET', `https://jsonplaceholder.typicode.com/comments/${ids.commentId}`)
                .then((response) => {
                    objects.commentObject = response.body
                    expect(response.status).to.eq(200)
                    cy.wrap(objects.commentObject)
                })
        })
    
        it('creates a comment', () => {
            
            const fakeComment = {
                id: lengths.commentslength + 1,
                name: faker.random.words(4),
                email: faker.internet.email().toLowerCase(),
                body: faker.random.words(6)
            }

            
            cy.api('POST', 'https://jsonplaceholder.typicode.com/comments', {     
                id: fakeComment.id,
                name: fakeComment.name,
                email: fakeComment.email,
                body: fakeComment.body
            })
            .then((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.name).to.eq(fakeComment.name)
                expect(response.body.id).to.eq(lengths.commentslength+1)
            })
        })
    
        it('updates a comment', () => {
    
            const commentEdited = objects.commentObject.body + ' edited'
    
            cy.api('PUT', `https://jsonplaceholder.typicode.com/comments/${ids.commentId}`, {    
                id: objects.commentObject.id,
                name: objects.commentObject.name,
                email: objects.commentObject.email,
                body: commentEdited
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.body).to.eq(commentEdited)
                expect(response.body.body).not.to.eq(objects.commentObject.body)
            })
        })

        it('patches a comment', () => {

            cy.api('PATCH', `https://jsonplaceholder.typicode.com/comments/${ids.commentId}`, {
                body: 'foo'
            })
            .then((response) => {
                expect(response.body.body).to.eq('foo')
                expect(response.body.body).not.to.eq(objects.commentObject.body)
            })
        })
    
        it('deletes a comment', () => {
    
            cy.api('DELETE', `https://jsonplaceholder.typicode.com/comments/${ids.commentId}`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.empty
                })
            })

        it.only('counts comments from a post', () => {
            cy.api('GET', `https://jsonplaceholder.typicode.com/posts/${ids.postId}/comments`)
                .then((response) => {
                    expect(response.body.length).to.eq(5)
                })
        })
    })

    context('photo tests', () => {

        it('gets all photos', () => {
            
            cy.api('GET', 'https://jsonplaceholder.typicode.com/photos')
                .then((response) => {
                    lengths.photoslength = response.body.length

                    expect(response.status).to.eq(200)
                    expect(response.body.length).to.eq(5000)
                })
        })

        it('gets a photo', () => {

            cy.api('GET', `https://jsonplaceholder.typicode.com/photos/${ids.photoId}`)
                .then((response) => {
                    objects.photoObject = response.body
                    expect(response.status).to.eq(200)
                    cy.wrap(objects.photoObject)
                })
        })

        it('creates a photo', () => {

            const color = faker.color.rgb({format: 'hex'}).slice(1)
    
            const fakePhoto = {
                albumId: faker.datatype.number({min: 1, max: 100}),
                id: lengths.photoslength + 1,
                title: faker.random.words(4),
                url: 'https://via.placeholder.com/600/' + color,
                thumbnailUrl: 'https://via.placeholder.com/150/' + color
            }
            
            cy.api('POST', 'https://jsonplaceholder.typicode.com/photos', {
                    albumId: fakePhoto.albumId,
                    id: fakePhoto.id,
                    title: fakePhoto.title,
                    url: fakePhoto.url,
                    thumbnailUrl: fakePhoto.thumbnailUrl
            })
            .then((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.title).to.eq(fakePhoto.title)
                expect(response.body.id).to.eq(lengths.photoslength+1)
            })
        })

        it('updates a photo', () => {
    
            const editedPhoto = objects.photoObject.title + ' edited'
    
            cy.api('PUT', `https://jsonplaceholder.typicode.com/photos/${ids.photoId}`, {
                albumId: objects.photoObject.albumId,
                id: objects.photoObject.id,
                title: editedPhoto,
                url: objects.photoObject.url,
                thumbnailUrl: objects.photoObject.thumbnailUrl
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.title).not.to.eq(objects.photoObject.title)
                expect(response.body.title).to.eq(editedPhoto)
            })
        })

        it('patches a photo', () => {

            cy.api('PATCH', `https://jsonplaceholder.typicode.com/photos/${ids.photoId}`, {
                    title: 'foo'
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.title).to.eq('foo')
                expect(response.body.title).not.to.eq(objects.photoObject.title)
            })
        })

        it('deletes a photo', () => {
    
            cy.api('DELETE', `https://jsonplaceholder.typicode.com/photos/${ids.photoId}`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.empty
                })
        })
    })
})