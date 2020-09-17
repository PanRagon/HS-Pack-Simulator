import Collection from "../../src/client/Collection";
import Users from "../../src/server/db/users";
import Cards from "../../src/server/db/cards/cards";
import CollectionDB from "../../src/server/db/collection";

const React = require('react');
const { mount } = require('enzyme');
const { MemoryRouter } = require('react-router-dom');
const request = require('supertest');

const { overrideFetch, asyncCheckCondition } = require('../mytest-utils');
const app = require('../../src/server/app');

beforeEach(() => {
    Users.createInitialUsers();
    CollectionDB.makeRichieRich();
});

test("Test should show user's cards", async () => {
    let user = Users.getUser("richie_rich");
    let cards = Cards.getAllCards();
    let driver = mount(
        <MemoryRouter>
            <Collection user={user.id} userDetails={user} cards={cards}/>
        </MemoryRouter>
    );

    let ownedCards = driver.find(".owned-card-holder");
    expect(ownedCards.length).toBe(100);
    let unownedCardContainer = driver.find(".unowned-card-holder");
    expect(unownedCardContainer.length).toBe(0);

    user = Users.getUser("andrea");
    driver = mount(
        <MemoryRouter>
            <Collection user={user.id} userDetails={user} cards={cards}/>
        </MemoryRouter>
    );

    ownedCards = driver.find(".owned-card-holder");
    expect(ownedCards.length).toBe(0);
    unownedCardContainer = driver.find(".unowned-card-holder");
    expect(unownedCardContainer.length).toBe(100)
});

/*test("Test milling should reduce card count", async () => {
    let user = Users.getUser("richie_rich");
    let cards = Cards.getAllCards();
    const getUserDetails = () => new Promise(resolve => resolve());
    const driver = mount(
        <MemoryRouter>
            <Collection getUserDetails={Index.getUserDetails} user={user.id} userDetails={user} cards={cards}/>
        </MemoryRouter>
    );

    const cardCount = user.totalCards;
    let ownedCards = driver.find(".owned-card-holder");
    expect(ownedCards.length).toBeGreaterThan(20);
    const renderedCards = ownedCards.length;

    const millBtn = driver.find(".mill-btn").at(0);
    millBtn.simulate("click");
    await asyncCheckCondition(
        () => {
            ownedCards = driver.find(".owned-card-holder");
        },
        2000,
        200
    );

    expect(ownedCards.length).toBeLessThan(renderedCards);
}); */

test("Test should render not logged in", async () => {
    const driver = mount(
        <MemoryRouter>
            <Collection />
        </MemoryRouter>
    );

    const text = "You need to login to see your collection!";

    expect(driver.html().includes(text)).toBe(true);
})