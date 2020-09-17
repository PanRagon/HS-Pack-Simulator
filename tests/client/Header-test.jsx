const React = require('react');
const { mount } = require('enzyme');
const { MemoryRouter } = require('react-router-dom');

const { Header } = require('../../src/client/header');
const { overrideFetch, asyncCheckCondition } = require('../mytest-utils');
const app = require('../../src/server/app');

//These tests are derived from Andrea Arcuri's exercise solutions
//https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/tests/client/headerbar-test.jsx

test("Test should render not logged in", async () => {
    const driver = mount(
        <MemoryRouter>
            <Header />
        </MemoryRouter>
    );

    const element = driver.find(".header-user-info-container");

    expect(element.find(".header-user-info").length).toBe(0);
});

test("Test should render logged in", async () => {
    const user = {id: "1"};
    const userDetails = {id: "1", collection: [], gold: 100, packs: 3};
    const updateLoggedInUser = () => {};

    const driver = mount(
        <MemoryRouter>
            <Header user={user} userDetails={userDetails} updateLoggedInUser={updateLoggedInUser} />
        </MemoryRouter>
    );

    const element = driver.find(".header-user-info-container");

    expect(element.find(".header-user-info").length).toBe(3);
});

test("Test logout", async () => {
    overrideFetch(app);

    let user = {id: "1"};
    const userDetails = {id: "1", collection: [], gold: 100, packs: 3};
    const updateLoggedInUser = (id) => {user = id};
    let page = null;
    const history = {push: (h) => {page=h}};

    const driver = mount(
        <MemoryRouter>
            <Header user={user} userDetails={userDetails} updateLoggedInUser={updateLoggedInUser} history={history} />
        </MemoryRouter>
    );


    expect(user).toEqual(user);

    const logoutButton = driver.find("#logout-btn").at(0);
    expect(logoutButton.length).toBe(1);
    logoutButton.simulate("click");

    await asyncCheckCondition(
        () => {
            driver.update;
        },
        2000,
        200
    );

    expect(user).toEqual(null);
    expect(page).toEqual("/");
});