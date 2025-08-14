import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeadForm from "../lead-form";

global.fetch = vi.fn();

vi.mock("next/script", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("LeadForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "test-site-key";

    Object.defineProperty(window, "grecaptcha", {
      value: {
        render: vi.fn(() => 1),
        execute: vi.fn(),
        reset: vi.fn(),
      },
      writable: true,
      configurable: true,
    });
  });

  it("should render form fields correctly", () => {
    render(<LeadForm officeId={1} />);

    expect(screen.getByLabelText("Prénom *")).toBeInTheDocument();
    expect(screen.getByLabelText("Nom *")).toBeInTheDocument();
    expect(screen.getByLabelText("Email professionnel *")).toBeInTheDocument();
    expect(screen.getByLabelText("Numéro de portable *")).toBeInTheDocument();
    expect(screen.getByLabelText("Message (optional)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Envoyer" })).toBeInTheDocument();
  });

  it("should validate required fields", async () => {
    const user = userEvent.setup();
    render(<LeadForm officeId={1} />);

    await user.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() => {
      expect(screen.getByText(/prénom manquant/i)).toBeInTheDocument();
    });
  });

  it("should execute reCAPTCHA when form is valid", async () => {
    const user = userEvent.setup();
    const mockExecute = vi.fn();
    (window as any).grecaptcha = {
      render: vi.fn(() => 1),
      execute: mockExecute,
      reset: vi.fn(),
    };

    render(<LeadForm officeId={1} />);

    await user.type(screen.getByLabelText("Prénom *"), "John");
    await user.type(screen.getByLabelText("Nom *"), "Doe");
    await user.type(
      screen.getByLabelText("Email professionnel *"),
      "john@example.com"
    );
    await user.type(
      screen.getByLabelText("Numéro de portable *"),
      "0600000000"
    );
    await user.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalledWith(1);
    });
  });

  it("should show reCAPTCHA not ready when grecaptcha is undefined", async () => {
    const user = userEvent.setup();
    Object.defineProperty(window, "grecaptcha", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    render(<LeadForm officeId={1} />);

    await user.type(screen.getByLabelText("Prénom *"), "John");
    await user.type(screen.getByLabelText("Nom *"), "Doe");
    await user.type(
      screen.getByLabelText("Email professionnel *"),
      "john@example.com"
    );
    await user.type(
      screen.getByLabelText("Numéro de portable *"),
      "0600000000"
    );
    await user.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() => {
      expect(screen.getByText(/reCAPTCHA not ready/i)).toBeInTheDocument();
    });
  });
});
