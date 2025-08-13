import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import Step4 from "../step4";
import { useOfficeFormStore } from "@/lib/store/office-store";

vi.mock("@/lib/store/office-store");
vi.mock("react-dropzone", () => ({
  useDropzone: () => ({
    getRootProps: () => ({}),
    getInputProps: () => ({}),
    isDragActive: false,
  }),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

describe("Step4", () => {
  const mockUpdateFormData = vi.fn();
  const mockForm = {
    setValue: vi.fn(),
    formState: { errors: {} },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    global.URL.createObjectURL = vi.fn(() => "mock-url");
    global.URL.revokeObjectURL = vi.fn();

    (useOfficeFormStore as any).mockReturnValue({
      updateFormData: mockUpdateFormData,
      formData: {
        photos: [],
        existingPhotos: [],
        removedPhotos: [],
      },
    });
  });

  it("should render existing photos", () => {
    const existingPhotos = [
      { id: 1, url: "https://example.com/photo1.jpg", alt: "Photo 1" },
      { id: 2, url: "https://example.com/photo2.jpg", alt: "Photo 2" },
    ];

    (useOfficeFormStore as any).mockReturnValue({
      updateFormData: mockUpdateFormData,
      formData: {
        photos: [],
        existingPhotos,
        removedPhotos: [],
      },
    });

    render(
      <TestWrapper>
        <Step4 form={mockForm as any} />
      </TestWrapper>
    );

    expect(screen.getByAltText("Photo 1")).toBeInTheDocument();
    expect(screen.getByAltText("Photo 2")).toBeInTheDocument();
  });

  it("should display correct photo count", () => {
    const existingPhotos = [
      { id: 1, url: "https://example.com/photo1.jpg", alt: "Photo 1" },
    ];

    (useOfficeFormStore as any).mockReturnValue({
      updateFormData: mockUpdateFormData,
      formData: {
        photos: [],
        existingPhotos,
        removedPhotos: [],
      },
    });

    render(
      <TestWrapper>
        <Step4 form={mockForm as any} />
      </TestWrapper>
    );

    expect(screen.getByText("Photos totales: 1/4")).toBeInTheDocument();
  });

  it("should handle removing existing photos", () => {
    const existingPhotos = [
      { id: 1, url: "https://example.com/photo1.jpg", alt: "Photo 1" },
    ];

    (useOfficeFormStore as any).mockReturnValue({
      updateFormData: mockUpdateFormData,
      formData: {
        photos: [],
        existingPhotos,
        removedPhotos: [],
      },
    });

    render(
      <TestWrapper>
        <Step4 form={mockForm as any} />
      </TestWrapper>
    );

    const removeButton = screen.getByRole("button");
    fireEvent.click(removeButton);

    expect(mockUpdateFormData).toHaveBeenCalledWith({
      existingPhotos: [],
      removedPhotos: [1],
    });
    expect(mockForm.setValue).toHaveBeenCalledWith("existingPhotos", []);
    expect(mockForm.setValue).toHaveBeenCalledWith("removedPhotos", [1]);
  });

  it("should display correct count for mixed photos (1 new + 4 existing)", () => {
    const existingPhotos = [
      { id: 1, url: "https://example.com/photo1.jpg", alt: "Photo 1" },
      { id: 2, url: "https://example.com/photo2.jpg", alt: "Photo 2" },
      { id: 3, url: "https://example.com/photo3.jpg", alt: "Photo 3" },
      { id: 4, url: "https://example.com/photo4.jpg", alt: "Photo 4" },
    ];

    const newPhotos = [
      {
        file: new File(["test"], "test1.jpg", { type: "image/jpeg" }),
        id: "new1",
      },
    ];

    (useOfficeFormStore as any).mockReturnValue({
      updateFormData: mockUpdateFormData,
      formData: {
        photos: newPhotos,
        existingPhotos,
        removedPhotos: [],
      },
    });

    render(
      <TestWrapper>
        <Step4 form={mockForm as any} />
      </TestWrapper>
    );

    expect(screen.getByText("Photos totales: 5/5")).toBeInTheDocument();
  });

  it("should set all photo form values for validation", () => {
    const existingPhotos = [
      { id: 1, url: "https://example.com/photo1.jpg", alt: "Photo 1" },
    ];

    const newPhotos = [
      {
        file: new File(["test"], "test1.jpg", { type: "image/jpeg" }),
        id: "new1",
      },
    ];

    (useOfficeFormStore as any).mockReturnValue({
      updateFormData: mockUpdateFormData,
      formData: {
        photos: newPhotos,
        existingPhotos,
        removedPhotos: [2],
      },
    });

    render(
      <TestWrapper>
        <Step4 form={mockForm as any} />
      </TestWrapper>
    );

    expect(mockForm.setValue).toHaveBeenCalledWith("photos", newPhotos);
    expect(mockForm.setValue).toHaveBeenCalledWith(
      "existingPhotos",
      existingPhotos
    );
    expect(mockForm.setValue).toHaveBeenCalledWith("removedPhotos", [2]);
  });
});
