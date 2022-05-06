import * as path from "path";
import * as fs from "fs";
import { serialize } from "../../src/lib/serialize";
import { deserialize } from "../../src/lib/deserialize";

describe("serialize/deserialize", () => {
  ["simple", "blockquote"].map((fixture) =>
    it("should work", (cb) => {
      fs.readFile(
        path.resolve(__dirname, `./fixtures/${fixture}.md`),
        (err, data) => {
          const text = String(data);
          expect(serialize(deserialize(text))).toBe(text);
          cb();
        }
      );
    })
  );
});
