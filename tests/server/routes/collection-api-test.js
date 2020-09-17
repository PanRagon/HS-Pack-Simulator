const Collection = require("../../../src/server/db/collection");
const Users = require("../../../src/server/db/users");
const request = require('supertest');
const app = require('../../../src/server/app');

beforeEach(() => {
    Users.createInitialUsers();
});

afterEach(() => {
    Users.deleteAllUsers();
});

test("Test get user cards", async () =>{
    const agent = request.agent(app);

    let response = await agent
        .post('/api/login')
        .send({id: "tomas", password:"FizzBuzz"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);

    response = await agent.get("/api/collection/tomas");
    expect(response.statusCode).toBe(200);
});

test("Test user can mill card", async () => {
    const agent = request.agent(app);
    Collection.makeRichieRich();

    let response = await agent
        .post('/api/login')
        .send({id: "richie_rich", password:"cashmoney"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);

    const cardId = 2542;

    response = await agent.delete("/api/collection/richie_rich/mill")
        .send({cardId})
        .set("Content-Type", "application/json");
    expect(response.statusCode).toBe(200);
});

test("Test user can buy card", async () => {
    const agent = request.agent(app);
    Collection.makeRichieRich();

    let response = await agent
        .post('/api/login')
        .send({id: "richie_rich", password:"cashmoney"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);

    const cardId = 2542;

    response = await agent.post("/api/collection/richie_rich/buy")
        .send({cardId})
        .set("Content-Type", "application/json");
    expect(response.statusCode).toBe(201);
})