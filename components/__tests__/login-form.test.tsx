import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/login-form";

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => {
  return {
    createClient: () => ({
      auth: {
        signInWithPassword: vi.fn(
          () =>
            new Promise(
              (resolve) =>
                setTimeout(() => resolve({ data: {}, error: null }), 50) // delay to simulate API call
            )
        ),
      },
    }),
  };
});

describe("LoginForm", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  it("shows validation errors for empty fields", async () => {
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(await screen.findAllByRole("alert")).toHaveLength(2);

    expect(screen.getByText(/l’e-mail est requis/i)).toBeInTheDocument();
    expect(
      screen.getByText(/le mot de passe doit contenir au moins 6 caractères/i)
    ).toBeInTheDocument();
  });

  it("shows email format error", async () => {
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/e-mail/i), "not-an-email");
    await user.type(screen.getByLabelText(/mot de passe/i), "123456");

    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(
      await screen.findByText(/veuillez saisir une adresse e-mail valide/i)
    ).toBeInTheDocument();
  });

  it("submits valid credentials and disables button while submitting", async () => {
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/e-mail/i), "user@example.com");
    await user.type(screen.getByLabelText(/mot de passe/i), "123456");

    const submitButton = screen.getByRole("button", { name: /se connecter/i });

    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });

  it("renders forgot password link", () => {
    render(<LoginForm />);
    expect(
      screen.getByRole("link", { name: /mot de passe oublié/i })
    ).toBeInTheDocument();
  });
});
