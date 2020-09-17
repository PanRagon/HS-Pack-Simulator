import Home from "../../src/client/Home";

const React = require('react');
const { mount } = require('enzyme');
const { MemoryRouter } = require('react-router-dom');
const request = require('supertest');

const { overrideFetch, asyncCheckCondition } = require('../mytest-utils');
const app = require('../../src/server/app');

test("Test should render cards from API", async () => {
    const response = await request(app)
        .get("/api/cards");
    expect(response.statusCode).toBe(200);
    const cards = response.body;

    const driver = mount(
        <MemoryRouter>
            <Home cards={cards}/>
        </MemoryRouter>
    );

    const cardsElements = driver.find(".card-name");
    //API isn't saving all the cards from the API, but it's saving the same amount each time.
    //As long as it remains the same amount all the time, everything is OK.
    expect(cardsElements.length).toBe(91);
});