const Users = require("../../../src/server/db/users");

beforeEach(Users.createInitialUsers);

afterEach(Users.deleteAllUsers);

test("Test initial Users should exist", () => {
    let richie = Users.getUser("richie_rich");
    let tomas = Users.getUser("tomas");
    let andrea = Users.getUser("andrea");
    expect(richie.id).toBe("richie_rich");
    expect(tomas.id).toBe("tomas");
    expect(andrea.id).toBe("andrea");
});

test("Test delete user", () => {
    Users.deleteUser("andrea");
    let users = Users.getAllUsers();
    let deleted = users.has("andrea");
    expect(deleted).toBe(false);
});