const Packs = require("../../../src/server/db/packs");
const Users = require("../../../src/server/db/users");

test("Test open pack without user", () => {
    expect(() => {
        Packs.openPack("notauser")
    }).toThrow();
});

test("Test get pack without user", () => {
    expect(() => {
        Packs.getPacks("notauser")
    }).toThrow();
})