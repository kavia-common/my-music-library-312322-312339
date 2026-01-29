import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders library by default (anonymous)", () => {
  render(<App />);
  expect(screen.getByText(/my music library/i)).toBeInTheDocument();
  expect(screen.getByText(/upload/i)).toBeInTheDocument();
  expect(screen.getByText(/library/i)).toBeInTheDocument();
});
