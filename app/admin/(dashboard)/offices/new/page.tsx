import OfficeStepperForm from "@/components/admin/office-stepper-form";

export default function NewOfficePage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Créer un nouveau bureau
        </h1>
        <p className="text-gray-600">
          Suivez les étapes pour créer un bureau étape par étape
        </p>
      </div>
      <OfficeStepperForm />
    </div>
  );
}
