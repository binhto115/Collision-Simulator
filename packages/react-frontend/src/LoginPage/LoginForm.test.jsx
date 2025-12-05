import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "./LoginForm";

// Mock react-router-dom navigate()
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock fetch + alert
global.fetch = jest.fn();
window.alert = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
});

test("Test #1: renders email, password, and login button", () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
});

test("Test #2: login stores token in sessionStorage and navigates", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
            token: "new-token",
            message: "Login successful",
        }),
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "user@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "mypassword" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Login successful");
    });

    // Test local-stored token
    expect(sessionStorage.getItem("token")).toBe("new-token");
    expect(localStorage.getItem("token")).toBe(null);

    expect(mockNavigate).toHaveBeenCalledWith("/simHub", {
    state: { email: "user@example.com" },
    });
});

test("Test #3: shows backend error message on failed login", async () => {
    fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ message: "Invalid credentials" }),
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "wrong@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "wrong" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Invalid credentials");
    });

    expect(mockNavigate).not.toHaveBeenCalled();
});

test("Test #4: shows generic error when fetch throws", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "someone@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "pass" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith(
        "An error occured while logging in."
    );
    });

    expect(mockNavigate).not.toHaveBeenCalled();
});

test("Test #5: clicking Create Account navigates to /signup", () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByText("Create Account"));

    expect(mockNavigate).toHaveBeenCalledWith("/signup");
});

test("clicking Forgot Password? navigates to /forgotpass", () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByText("Forgot Password?"));
    expect(mockNavigate).toHaveBeenCalledWith('/forgotpass');
});
