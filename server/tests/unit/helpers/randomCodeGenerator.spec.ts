import { RandomCodeGenerator } from "../../../src/helpers";

describe("Random Code Generator", () => {
  it("[PASS] Get Random code without a specified length", async () => {
    const randomCode: string = RandomCodeGenerator.get();
    expect(randomCode.length).toEqual(40);
  });

  it("[PASS] Get Random code with a valid specified length", async () => {
    const LENGTH = 250;
    const randomCode = RandomCodeGenerator.get(LENGTH);
    expect(randomCode.length).toEqual(LENGTH);
  });

  it("[PASS] Get Random code with a valid minimum length", async () => {
    const LENGTH = 1;
    const randomCode = RandomCodeGenerator.get(LENGTH);
    expect(randomCode.length).toEqual(LENGTH);
  });

  it("[FAIL] Get Random code with an invalid (negative number) specified length", async () => {
    const LENGTH = -12;
    expect(() => RandomCodeGenerator.get(LENGTH)).toThrow("Minimum length of token is 1");
  });

  it("[FAIL] Get Random code with an invalid (boundary) less than minimum length", async () => {
    const LENGTH = 0;
    expect(() => RandomCodeGenerator.get(LENGTH)).toThrow("Minimum length of token is 1");
  });
});
