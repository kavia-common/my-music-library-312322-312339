import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders auth screen by default (protected route redirects to login)", () => {
  render(<App />);
  expect(screen.getByText(/sign in/i)).toBeInTheDocument();
});
