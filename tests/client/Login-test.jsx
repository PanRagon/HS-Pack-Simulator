//These tests are derived from Andrea Arcuri's exercise solutions
//https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/tests/client/login-test.jsx

const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');

const {overrideFetch, asyncCheckCondition} = require('../mytest-utils');
const app = require('../../src/server/app');


const {Login} = require('../../src/client/Login');
const {deleteAllUsers, createUser, createInitialUsers} = require('../../src/server/db/users');


beforeEach(deleteAllUsers);


function fillForm(driver, id, password){

    const usernameInput = driver.find("#username-input").at(0);
    const passwordInput = driver.find("#password-input").at(0);
    const loginBtn = driver.find("#login-btn").at(0);

    usernameInput.simulate('change', {target: {value: id}});
    passwordInput.simulate('change', {target: {value: password}});

    loginBtn.simulate('click');
}


test("Test fail login", async () => {

    overrideFetch(app);

    const driver = mount(
        <MemoryRouter initialEntries={["/login"]}>
            <Login/>
        </MemoryRouter>
    );

    fillForm(driver, "foo", "123");

    const error = await asyncCheckCondition(
        () => {driver.update(); return driver.html().includes("Invalid")},
        2000 ,200);

    expect(error).toEqual(true);
});


test("Test valid login", async () =>{

    createInitialUsers();
    const userId = "andrea";
    const password = "42";
    createUser(userId, password);

    overrideFetch(app);

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    let page = null;
    const history = {push: (h) => {page=h}};

    const driver = mount(
        <MemoryRouter initialEntries={["/login"]}>
            <Login fetchAndUpdateUserInfo={fetchAndUpdateUserInfo} history={history} />
        </MemoryRouter>
    );

    fillForm(driver, userId, password);

    const redirected = await asyncCheckCondition(
        () => {return page === "/"},
        2000 ,200);

    expect(redirected).toEqual(true);
});

