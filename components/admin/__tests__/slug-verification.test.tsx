import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SlugVerification } from "../slug-verification";
import { useSlugVerification } from "@/hooks/use-slug-verification";

vi.mock("@/hooks/use-slug-verification");

describe("SlugVerification", () => {
  const mockOnSuggestionClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when slug is empty", () => {
    vi.mocked(useSlugVerification).mockReturnValue({
      result: null,
      isLoading: false,
      error: null,
      verifySlug: vi.fn(),
    });

    render(
      <SlugVerification slug="" onSuggestionClick={mockOnSuggestionClick} />
    );

    expect(
      screen.queryByText("Vérification du lien...")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Lien disponible")).not.toBeInTheDocument();
  });

  it("should show loading state", () => {
    vi.mocked(useSlugVerification).mockReturnValue({
      result: null,
      isLoading: true,
      error: null,
      verifySlug: vi.fn(),
    });

    render(
      <SlugVerification
        slug="test-slug"
        onSuggestionClick={mockOnSuggestionClick}
      />
    );

    expect(screen.getByText("Vérification du lien...")).toBeInTheDocument();
  });

  it("should show error state", () => {
    vi.mocked(useSlugVerification).mockReturnValue({
      result: null,
      isLoading: false,
      error: "Erreur de vérification",
      verifySlug: vi.fn(),
    });

    render(
      <SlugVerification
        slug="test-slug"
        onSuggestionClick={mockOnSuggestionClick}
      />
    );

    expect(screen.getByText("Erreur de vérification")).toBeInTheDocument();
  });

  it("should show available state", () => {
    vi.mocked(useSlugVerification).mockReturnValue({
      result: {
        available: true,
        suggestions: [],
      },
      isLoading: false,
      error: null,
      verifySlug: vi.fn(),
    });

    render(
      <SlugVerification
        slug="test-slug"
        onSuggestionClick={mockOnSuggestionClick}
      />
    );

    expect(screen.getByText("Lien disponible")).toBeInTheDocument();
  });

  it("should show unavailable state with existing office info", () => {
    vi.mocked(useSlugVerification).mockReturnValue({
      result: {
        available: false,
        existingOffice: {
          id: 1,
          slug: "test-slug",
          title: "Existing Office",
        },
        suggestions: ["test-slug-1234", "test-slug-5678"],
      },
      isLoading: false,
      error: null,
      verifySlug: vi.fn(),
    });

    render(
      <SlugVerification
        slug="test-slug"
        onSuggestionClick={mockOnSuggestionClick}
      />
    );

    expect(screen.getByText("Lien déjà utilisé")).toBeInTheDocument();
    expect(screen.getByText("Utilisé par :")).toBeInTheDocument();
    expect(screen.getByText("Existing Office")).toBeInTheDocument();
    expect(screen.getByText("Suggestions :")).toBeInTheDocument();
  });

  it("should call onSuggestionClick when suggestion is clicked", async () => {
    vi.mocked(useSlugVerification).mockReturnValue({
      result: {
        available: false,
        existingOffice: {
          id: 1,
          slug: "test-slug",
          title: "Existing Office",
        },
        suggestions: ["test-slug-1234", "test-slug-5678"],
      },
      isLoading: false,
      error: null,
      verifySlug: vi.fn(),
    });

    render(
      <SlugVerification
        slug="test-slug"
        onSuggestionClick={mockOnSuggestionClick}
      />
    );

    const suggestionButton = screen.getByText("test-slug-1234");
    fireEvent.click(suggestionButton);

    expect(mockOnSuggestionClick).toHaveBeenCalledWith("test-slug-1234");
  });

  it("should not show suggestions section when no suggestions", () => {
    vi.mocked(useSlugVerification).mockReturnValue({
      result: {
        available: false,
        existingOffice: {
          id: 1,
          slug: "test-slug",
          title: "Existing Office",
        },
        suggestions: [],
      },
      isLoading: false,
      error: null,
      verifySlug: vi.fn(),
    });

    render(
      <SlugVerification
        slug="test-slug"
        onSuggestionClick={mockOnSuggestionClick}
      />
    );

    expect(screen.getByText("Lien déjà utilisé")).toBeInTheDocument();
    expect(screen.queryByText("Suggestions :")).not.toBeInTheDocument();
  });
});
