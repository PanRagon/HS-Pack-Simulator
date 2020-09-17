import Packs from "../../src/client/Packs";
import Users from "../../src/server/db/users";
import Cards from "../../src/server/db/cards/cards";
import CollectionDB from "../../src/server/db/collection";
import { shallow } from 'enzyme';

const React = require('react');
const { mount } = require('enzyme');
const { MemoryRouter } = require('react-router-dom');

const { overrideFetch, asyncCheckCondition } = require('../mytest-utils');
const app = require('../../src/server/app');
const request = require('supertest');

beforeEach(() => {
    Users.createInitialUsers();
});

test("Test should show user's packs", async () => {
    const getUserDetails = () => new Promise(resolve => resolve());
    let user = Users.getUser("andrea");
    const driver = mount(
        <MemoryRouter>
        <Packs user={user.id} getUserDetails={getUserDetails} userDetails={user}/>
    </MemoryRouter>
    );

    expect(driver.html().includes(user.packs)).toBe(true);
});

test("Test should render not logged in", async () => {
    const getUserDetails = () => new Promise(resolve => resolve());

    const driver = mount(
        <MemoryRouter>
            <Packs getUserDetails={getUserDetails}/>
        </MemoryRouter>
    );
    const text = "You need to login to see your packs!";
    expect(driver.html().includes(text)).toBe(true);
});