import { render, screen } from "@testing-library/react";
import { ExploreSection } from "../explore-section";

describe("ExploreSection", () => {
  it("renders the section title", () => {
    render(<ExploreSection />);

    expect(
      screen.getByText("Explorer d'autres locations de bureaux et coworkings")
    ).toBeInTheDocument();
  });

  it("renders arrondissement links with correct URLs", () => {
    render(<ExploreSection />);

    const arrondissementLinks = screen.getAllByText(
      /Location bureaux Paris \d+/
    );

    expect(arrondissementLinks).toHaveLength(20);

          arrondissementLinks.forEach((link, index) => {
        const arrondissementNumber = index + 1;
        expect(link).toHaveAttribute(
          "href",
          `/bureaux-paris-${arrondissementNumber}`
        );
      });
  });

  it("renders neighborhood links", () => {
    render(<ExploreSection />);

    expect(
      screen.getByText("Location bureaux Châtelet Les Halles")
    ).toBeInTheDocument();
    expect(screen.getByText("Location bureaux Madeleine")).toBeInTheDocument();
    expect(
      screen.getByText("Location bureaux Montparnasse")
    ).toBeInTheDocument();
  });

  it("renders coworking link with correct URL", () => {
    render(<ExploreSection />);

    const coworkingLink = screen.getByText("Coworking Paris 2");
    expect(coworkingLink).toHaveAttribute("href", "/bureaux-paris-2");
  });

  it("renders section headers", () => {
    render(<ExploreSection />);

    expect(
      screen.getByText("NOS BUREAUX À LOUER PAR ARRONDISSEMENT")
    ).toBeInTheDocument();
    expect(
      screen.getByText("NOS BUREAUX À LOUER PAR QUARTIER ET VILLES")
    ).toBeInTheDocument();
    expect(screen.getByText("NOS ESPACES DE COWORKING")).toBeInTheDocument();
  });
});
