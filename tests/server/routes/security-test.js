const request = require('supertest');
const app = require('../../../src/server/app');
const Collection = require("../../../src/server/db/collection");
const Users = require("../../../src/server/db/users");

//To ensure the previous sessions are dead when we start testing.
beforeEach(() => {
    return Users.createInitialUsers();
});

afterEach(() => {
    return Users.deleteAllUsers();
});

test("Test opening pack with no auth", async () =>{

    const response = await request(app).put('/api/packs/andrea/open');

    expect(response.statusCode).toBe(401);
});

test("Test can't buy packs if not logged in", async () => {
    let response = await request(app).post("/api/packs/richie_rich/buy");
    expect(response.statusCode).toBe(401);
});

test("Test can't get users' packs if not logged in", async () => {
    let response = await request(app).get("/api/packs/andrea");
    expect(response.statusCode).toBe(401);
});

test("Test shouldn't get other users' packs", async () => {
    const agent = request.agent(app);
    let response = await agent
        .post('/api/login')
        .send({id: "tomas", password:"FizzBuzz"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);

    response = await agent.get("/api/packs/andrea");
    expect(response.statusCode).toBe(403);
});

test("Test can't get users' cards if not logged in", async () => {
    let response = await request(app).get("/api/collection/richie_rich");
    expect(response.statusCode).toBe(401);
});

test("Test shouldn't get other users' cards", async () => {
    const agent = request.agent(app);
    let response = await agent
        .post('/api/login')
        .send({id: "andrea", password:"42"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);

    response = await agent.get("/api/collection/tomas");
    expect(response.statusCode).toBe(403);
});

test("Test can't mill if not logged in", async () => {
    let response = await request(app).delete("/api/collection/richie_rich/mill");
    expect(response.statusCode).toBe(401);
});

test("Test can't mill other users' cards", async () => {
    const agent = request.agent(app);
    let response = await agent
        .post('/api/login')
        .send({id: "tomas", password:"FizzBuzz"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);


    let fakeCard = {id: "2702", name: "Flame Lance"};
    response = await agent.delete("/api/collection/andrea/mill")
        .send(JSON.stringify(fakeCard)).set("Content-Type", "application/json");
    expect(response.statusCode).toBe(403);
});

test("Test user who isn't logged in can't authenticate", async () => {
    let response = await request(app).get("/api/packs/andrea");
    expect(response.statusCode).toBe(401);
});

test("Test get user info when not logged in", async () => {
    let response = await request(app).get("/api/users/andrea");
    expect(response.statusCode).toBe(401)
});

test("Test get other user's info", async () => {
    const agent = request.agent(app);
    let response = await agent
        .post('/api/login')
        .send({id: "tomas", password:"FizzBuzz"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);

    response = await agent.get("/api/users/andrea");
    expect(response.statusCode).toBe(403)
});

test("Test purchase card unauthenticated", async () => {
    let response = await request(app).post("/api/collection/andrea/buy");
    expect(response.statusCode).toBe(401);
});

test("Test purchase card for another user", async () => {
    const agent = request.agent(app);
    let response = await agent
        .post('/api/login')
        .send({id: "tomas", password:"FizzBuzz"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);

    response = await agent.post("/api/collection/andrea/buy");
    expect(response.statusCode).toBe(403);
});

test("Test not logged in getting airdrop", async () => {
    let response = await request(app).post("/api/packs/andrea/airdrop");
    expect(response.statusCode).toBe(401);
});

test("Test user open airdrops for other users", async () => {
    const agent = request.agent(app);
    let response = await agent
        .post('/api/login')
        .send({id: "tomas", password:"FizzBuzz"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);

    response = await agent.post("/api/packs/andrea/airdrop");
    expect(response.statusCode).toBe(403);
});
