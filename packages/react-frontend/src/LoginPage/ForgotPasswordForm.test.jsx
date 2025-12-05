/* eslint-env jest */
/* global global */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgotPasswordForm from "./ForgotPasswordForm";

// Mock react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

// Mock fetch globally
global.fetch = jest.fn();
window.alert = jest.fn();

test("Test #1: input and button", () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByText("Send Reset Link")).toBeInTheDocument();
});

test("Test #2: Submission form and navigates home", async () => {
    fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: "Success" }),
    });

    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByText("Send Reset Link"));

    await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith(
        "A reset link has been emailed to you!"
    );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
});

test("Test #3: Shows error message when Backend returns an error", async () => {
    fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ message: "User not found" }),
    });

    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "bad@example.com" },
    });

    fireEvent.click(screen.getByText("Send Reset Link"));

    await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("User not found");
    });
});

test("Test #4: Shows error alert when fetch throws", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByText("Send Reset Link"));

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Error connecting to server.");
    });
});
