import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignUpForm from "./SignUpForm";

// Mock navigate()
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock fetch + alert
global.fetch = jest.fn();
window.alert = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

test("Test #1: renders signup form and button", () => {
    render(<SignUpForm />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
});

test("Test #2: shows error when passwords do not match", () => {
    render(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "user@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "abc123" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "wrong" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(window.alert).toHaveBeenCalledWith("Passwords do not match!");
    expect(fetch).not.toHaveBeenCalled();
});

test("Test #3: successful signup (201) alerts and navigates home", async () => {
    fetch.mockResolvedValueOnce({
        status: 201,
        json: async () => ({ message: "Created" }),
    });

    render(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "pass" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "pass" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Account created successfully!");
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
});

test("Test #4: username already exists (409) shows message", async () => {
    fetch.mockResolvedValueOnce({
        status: 409,
        json: async () => ({ message: "Username already exists" }),
    });

    render(<SignUpForm />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "pass" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "pass" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Username already exists!");
    });

    expect(mockNavigate).not.toHaveBeenCalled();
});

test("Test #5: failed test shows status message", async () => {
    fetch.mockResolvedValueOnce({
        status: 500,
        json: async () => ({ message: "Something went wrong" }),
    });

    render(<SignUpForm />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "pass" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "pass" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
        "Failed to create account. Please try again. Status: 500"
        );
    });

    expect(mockNavigate).not.toHaveBeenCalled();
});

test("Test #6: network failed", async () => {
    fetch.mockRejectedValueOnce(new Error("Network down"));
    render(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "pass" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "pass" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));
    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Error connecting to server.");
    });

    expect(mockNavigate).not.toHaveBeenCalled();
});

test("Test #7: Back to Login link navigates to /", () => {
  render(<SignUpForm />);
  fireEvent.click(screen.getByText("Back to Login"));
  expect(mockNavigate).toHaveBeenCalledWith("/");
});
