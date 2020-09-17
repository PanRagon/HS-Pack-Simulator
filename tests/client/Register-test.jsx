//These tests are derived from Andrea Arcuri's exercise solutions
//https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/tests/client/signup-test.jsx

const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');

const {overrideFetch, asyncCheckCondition} = require('../mytest-utils');
const app = require('../../src/server/app');

const {Register} = require('../../src/client/register');
const {deleteAllUsers, getUser, createUser, createInitialUsers} = require('../../src/server/db/users');


beforeEach(createInitialUsers);

afterEach(deleteAllUsers);

function fillForm(driver, id, password, confirm){

    const userIdInput = driver.find("#username-input").at(0);
    const passwordInput = driver.find("#password-input").at(0);
    const confirmInput = driver.find("#confirm-input").at(0);
    const registerBtn = driver.find("#register-btn").at(0);


    userIdInput.simulate('change', {target: {value: id}});
    passwordInput.simulate('change', {target: {value: password}});
    confirmInput.simulate('change', {target: {value: confirm}});

    registerBtn.simulate('click');
}

test("Test password mismatch", async () => {

    const mismatch = "Passwords not matching";

    overrideFetch(app);

    const driver = mount(
        <MemoryRouter initialEntries={["/register"]}>
            <Register/>
        </MemoryRouter>
    );

    fillForm(driver, "Harold", "123", "456");

    const error = await asyncCheckCondition(
        () => {driver.update(); return driver.html().includes(mismatch)},
        2000 ,200);

    expect(error).toEqual(true);
});