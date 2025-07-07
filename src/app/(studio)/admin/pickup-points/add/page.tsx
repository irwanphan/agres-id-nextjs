import PickupPointForm from "../_components/PickupPointForm";

async function PickupPointAddPage() {
  return (
    <div className="max-w-3xl mx-auto bg-white border rounded-xl shadow-1 border-gray-3">
      <div className="px-6 py-5 border-b border-gray-3">
        <h1 className="text-base font-semibold text-dark">Add Pickup Point</h1>
      </div>
      <div className="px-6 py-5">
        <PickupPointForm />
      </div>
    </div>
  );
}

export default PickupPointAddPage;
