import { render, screen } from "@testing-library/react";
import { Signup } from "../pages";

describe("App", () => {
  beforeEach(() => {
    render(<Signup />);
  });

  it("renders the signup page", () => {
    expect(screen.getByText("Create an account")).toBeDefined();
  });
});
