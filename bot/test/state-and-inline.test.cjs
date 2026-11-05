const assert = require("node:assert/strict");
const test = require("node:test");

process.env.BOT_TOKEN = process.env.BOT_TOKEN || "test-token";
process.env.GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || "test-sheet";

const { buildInlineResults } = require("../build/setInlineQueryMiddleware");
const { initArts } = require("../build/state/arts");
const { initRegistrations } = require("../build/state/registrations");

test("inline deep links keep sheet positions after filtering", () => {
  const results = buildInlineResults(
    [{ name: "First" }, { name: "Blue" }, { name: "Blue again" }],
    "art",
    "art blue"
  );
  assert.deepEqual(
    results.map(({ id, input_message_content }) => [id, input_message_content.message_text]),
    [["art_1", "/start art_1"], ["art_2", "/start art_2"]]
  );
});

test("sheet reload returns a fresh catalogue without duplicating rows", async () => {
  const sheets = {
    spreadsheets: {
      values: {
        get: async () => ({ data: { values: [["name"], ["First"], ["Second"]] } }),
      },
    },
  };
  const first = await initArts(sheets);
  const second = await initArts(sheets);
  assert.equal(first.length, 2);
  assert.equal(second.length, 2);
  assert.notStrictEqual(first, second);
});

test("registration list stays current for state references", () => {
  const state = initRegistrations();
  state.startRegistration(42, "Event", [{ type: "input", question: "Name?", stageName: "name" }]);
  assert.equal(state.registrations.length, 1);
  state.nextRegistration(42, { data: "Visitor" });
  assert.equal(state.registrations[0].stageId, 1);
  assert.deepEqual(state.endRegistration(42), { name: "Visitor" });
  assert.equal(state.registrations.length, 0);
});
