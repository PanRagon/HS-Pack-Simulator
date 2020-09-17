const Collection = require("../../../src/server/db/collection");
const Users = require("../../../src/server/db/users");

beforeAll(() => {
    Users.createInitialUsers();
    Collection.makeRichieRich();
});

test("Test Richie should be rich", () => {
    let richie = Users.getUser("richie_rich");
    expect(richie.packs).toBe(250);
    expect(richie.collection.length).toBe(100);
    expect(richie.gold).toBe(1000000);
});

test("Test mill values are correct", () => {
    let richie = Users.getUser("richie_rich");
    let gold = richie.gold;
    //Test Common
    Collection.millCard(richie.id, 2539);
    expect(richie.gold).toBe(gold + 10);
    gold = richie.gold;
    //Test Rare
    Collection.millCard(richie.id, 2541);
    expect(richie.gold).toBe(gold + 25);
    gold = richie.gold;
    //Test Epic
    Collection.millCard(richie.id, 2572);
    expect(richie.gold).toBe(gold + 50);
    gold = richie.gold;
    //Test Legendary
    Collection.millCard(richie.id, 2546);
    expect(richie.gold).toBe(gold + 100);
});

test("Test purchase prices are correct", () => {
    let richie = Users.getUser("richie_rich");
    let gold = richie.gold;
    //Test Common
    Collection.buyCard(richie.id, 2539);
    expect(richie.gold).toBe(gold - 20);
    gold = richie.gold;
    //Test Rare
    Collection.buyCard(richie.id, 2541);
    expect(richie.gold).toBe(gold - 50);
    gold = richie.gold;
    //Test Epic
    Collection.buyCard(richie.id, 2572);
    expect(richie.gold).toBe(gold - 100);
    gold = richie.gold;
    //Test Legendary
    Collection.buyCard(richie.id, 2546);
    expect(richie.gold).toBe(gold - 200);
});

test("Test get cards of no user", () => {
   let error = Collection.getUserCards("notarealid");
   expect(error).toEqual(false);
});