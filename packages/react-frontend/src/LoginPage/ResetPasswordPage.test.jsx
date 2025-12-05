/* eslint-env jest */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ResetPasswordPage from "./ResetPasswordPage";

// Mock react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock fetch + alert
global.fetch = jest.fn();
window.alert = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  // Set URL to include ?token=reset-token-123
  window.history.pushState({}, "", "/reset?token=reset-token-123");
});


test("Test #1: renders password fields and reset button", () => {
    render(<ResetPasswordPage />);

    expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
    expect(
    screen.getByRole("button", { name: "Reset Password" })
    ).toBeInTheDocument();
});

test("Test #2: shows alert when passwords do not match and does not call fetch", async () => {
    render(<ResetPasswordPage />);

    fireEvent.change(screen.getByPlaceholderText("New password"), {
    target: { value: "password1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
    target: { value: "password2" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Passwords do not match!");
    });

    expect(fetch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
});

test("Test #3: reset calls API with token + password, alerts success and navigates home", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Password reset successfully!" }),
    });

    render(<ResetPasswordPage />);

    fireEvent.change(screen.getByPlaceholderText("New password"), {
        target: { value: "new-secret" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
        target: { value: "new-secret" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Password reset successfully!");
    });

    // Check fetch was called correctly
    expect(fetch).toHaveBeenCalledWith(
        "https://crashlab-backend-cga7hqa8f6cbbage.westus3-01.azurewebsites.net/accounts/reset-password",
        expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token: "reset-token-123",
            newPassword: "new-secret",
        }),
        })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
});

test("Test #4: shows backend error message when response is not ok", async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Invalid or expired token" }),
    });

    render(<ResetPasswordPage />);

    fireEvent.change(screen.getByPlaceholderText("New password"), {
        target: { value: "new-secret" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
        target: { value: "new-secret" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Invalid or expired token");
    });

    expect(mockNavigate).not.toHaveBeenCalled();
});

test("Test #5: shows 'Server error' when fetch throws", async () => {
    fetch.mockRejectedValueOnce(new Error("Network down"));

    render(<ResetPasswordPage />);

    fireEvent.change(screen.getByPlaceholderText("New password"), {
        target: { value: "new-secret" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
        target: { value: "new-secret" },
    });


    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Server error");
    });

    expect(mockNavigate).not.toHaveBeenCalled();
});
