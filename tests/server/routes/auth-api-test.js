//Tests are derived from Andrea Arcuri's auth api tests in the exercise solution.
//They make logical sense in this project, I've ensured that all the authentication endpoints work.
//https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/tests/server/routes/auth-api-test.js

const request = require('supertest');
const app = require('../../../src/server/app');
const Users = require("../../../src/server/db/users");

let counter = 0;

test("Test fail login", async () =>{

    const response = await request(app)
        .post('/api/login')
        .send({userId:"M. Night", password:"Shyamalan"})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(400);
});

test("Test fail to fetch non-existent user", async () =>{

    const response = await request(app)
        .get('/api/user');

    expect(response.statusCode).toBe(401);
});

test("Test create user, but fail fetch data", async () =>{

    const id = 'Foo_' + (counter++);

    let response = await request(app)
        .post('/api/register')
        .send({id, password:"bar"})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(201);


    //no use of cookies here, so auth fails
    response = await request(app)
        .get('/api/user');

    expect(response.statusCode).toBe(401);
});

test("Test create user, login in a different session and get data", async () =>{

    const id = 'Foo_' + (counter++);

    //create user, but ignore cookie set with the HTTP response
    let response = await request(app)
        .post('/api/register')
        .send({id, password:"bar"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);


    //use new cookie jar for the HTTP requests
    const agent = request.agent(app);

    //do login, which will get a new cookie
    response = await agent
        .post('/api/login')
        .send({id, password:"bar"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);


    //using same cookie got from previous HTTP call
    response = await agent.get('/api/user');

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(id);
    expect(response.body.password).toBeUndefined();
});



test("Test login after logout", async () =>{

    const id = 'Foo_' + (counter++);

    //use same cookie jar for the HTTP requests
    const agent = request.agent(app);

    //create user
    let response = await agent
        .post('/api/register')
        .send({id, password:"bar"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);


    //can get info
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(200);


    //now logout
    response = await agent.post('/api/logout');
    expect(response.statusCode).toBe(204);


    //after logout, should fail to get data
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(401);

    //do login
    response = await agent
        .post('/api/login')
        .send({id, password:"bar"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);


    //after logging in again, can get info
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(200);
});

test("Test user can fetch own information", async () => {
    const agent = request.agent(app);

    let response = await agent
        .post('/api/register')
        .send({id:"andrea", password:"42"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);

    response = await agent.get("/api/users/andrea");
    expect(response.statusCode).toBe(200);
});

test("Test attempt to create existing user", async () => {
    Users.createInitialUsers();
    let response = await request(app)
        .post('/api/register')
        .send({id: "andrea", password:"42"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
});

test("Test get non-existant user", async() => {

})