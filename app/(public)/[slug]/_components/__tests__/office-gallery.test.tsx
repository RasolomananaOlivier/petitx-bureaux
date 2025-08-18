import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { OfficeGallery } from "../office-gallery";

vi.mock("@/components/ui/carousel", () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel">{children}</div>
  ),
  CarouselContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel-content">{children}</div>
  ),
  CarouselItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel-item">{children}</div>
  ),
  CarouselNext: () => <div data-testid="carousel-next">Next</div>,
  CarouselPrevious: () => <div data-testid="carousel-previous">Previous</div>,
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog">{children}</div>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-trigger">{children}</div>
  ),
}));

const mockImages = [
  "/image1.jpg",
  "/image2.jpg",
  "/image3.jpg",
  "/image4.jpg",
  "/image5.jpg",
  "/image6.jpg",
  "/image7.jpg",
];

describe("OfficeGallery", () => {
  it("renders gallery with images", () => {
    render(<OfficeGallery images={mockImages} />);

    expect(screen.getAllByAltText("Office space").length).toBeGreaterThan(0);
  });

  it("shows view more button when more than 5 images", () => {
    render(<OfficeGallery images={mockImages} />);

    expect(screen.getByText("+2 photos")).toBeInTheDocument();
    expect(screen.getAllByText("Voir tout (7)")).toHaveLength(1);
    expect(screen.getAllByTestId("dialog")).toHaveLength(2);
  });

  it("does not show view more button when 5 or fewer images", () => {
    const fewImages = mockImages.slice(0, 3);
    render(<OfficeGallery images={fewImages} />);

    expect(screen.queryByText(/\+.*photos/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Voir tout/)).not.toBeInTheDocument();
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("handles empty images array", () => {
    render(<OfficeGallery images={[]} />);

    expect(screen.getAllByAltText("Office space").length).toBeGreaterThan(0);
  });
});
