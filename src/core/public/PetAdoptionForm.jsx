import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../../config/config";
import AppBar from "../../shared/AppBar/AppBar";
import ConfirmDialogBox from "../../shared/ConfirmDialogBox/ConfirmDialogBox";
import LoadingScreen from "../../shared/LoadingScreen/LoadingScreen";
import Snackbar from "../../shared/Snackbar/Snackbar";
import api from "../../utils/api";

const PetAdoptionForm = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    applicantId: "",
    petId: "",
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    districtOrCity: "",
    homeAddress: "",
    householdMembers: 0,
    hasPets: false,
    petDetails: "",
    residenceType: "",
    reasonForAdoption: "",
    experienceWithPets: "",
    agreementToTerms: false,
    submittedAt: new Date(),
    adminId: null,
    adminStatus: "Under Review",
    adminNotes: "",
    handledAt: null,
  });

  const [pet, setPet] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Fetch pet data (this can be done using a real API call)
    const fetchPetData = async () => {
      try {
        const response = await api.get(`/pet/get/${id}`);
        setPet(response.data);
        setIsPageLoading(false);
      } catch (error) {
        console.error("Error fetching pet data:", error);
        setSnackbar({
          open: true,
          message: "Failed to load pet data. Please try again.",
          type: "error",
        });
        setIsPageLoading(false);
      }
    };

    fetchPetData();
  }, [id]);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogConfirm = () => {
    setIsDialogOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("/adopt/submit", {
        ...formData,
        applicantId: userId,
        petId: id,
      });
      setIsLoading(false);

      // Show success message
      setSnackbar({
        open: true,
        message: "Adoption application submitted successfully!",
        type: "success",
      });

      // Redirect to pet details page after successful submission
      setTimeout(() => {
        navigate(`/profile/${id}`);
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
      setIsLoading(false);

      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to submit application. Please try again.",
        type: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isPageLoading) {
    return <LoadingScreen />;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "householdMembers" && value < 0) {
      return;
    }
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNext = () => {
    setCurrentPage(2);
  };

  const handleBack = () => {
    setCurrentPage(1);
  };

  const handleReturn = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-lora">
      <AppBar />

      <div className="flex justify-center items-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-6xl w-full flex flex-col-reverse lg:flex-row">
          <div className="w-full lg:w-2/3 pr-0 lg:pr-6">
            {currentPage === 1 ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Personal Details
                </h2>
                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label
                      htmlFor="applicantName"
                      className="block text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="applicantName"
                      name="applicantName"
                      value={formData.applicantName}
                      onChange={handleChange}
                      placeholder="Name"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="applicantEmail"
                      className="block text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="applicantEmail"
                      name="applicantEmail"
                      value={formData.applicantEmail}
                      onChange={handleChange}
                      placeholder="Email"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="applicantPhone"
                      className="block text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="applicantPhone"
                      name="applicantPhone"
                      value={formData.applicantPhone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="districtOrCity"
                      className="block text-gray-700"
                    >
                      District or City
                    </label>
                    <input
                      type="text"
                      id="districtOrCity"
                      name="districtOrCity"
                      value={formData.districtOrCity}
                      onChange={handleChange}
                      placeholder="City"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="homeAddress"
                      className="block text-gray-700"
                    >
                      Home Address
                    </label>
                    <input
                      type="text"
                      id="homeAddress"
                      name="homeAddress"
                      value={formData.homeAddress}
                      onChange={handleChange}
                      placeholder="Home Address"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="householdMembers"
                      className="block text-gray-700"
                    >
                      Household Members
                    </label>
                    <input
                      type="number"
                      id="householdMembers"
                      name="householdMembers"
                      value={formData.householdMembers}
                      onChange={handleChange}
                      placeholder="Household Members"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="residenceType"
                      className="block text-gray-700"
                    >
                      Residence Type (Own or Rent)
                    </label>
                    <select
                      id="residenceType"
                      name="residenceType"
                      value={formData.residenceType}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                    >
                      <option value="">Select Residence Type</option>
                      <option value="Own">Own</option>
                      <option value="Rent">Rent</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className="btn bg-[#6AA693] text-white w-full md:col-span-2"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Adoption Details
                </h2>
                <form className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="hasPets" className="block text-gray-700">
                      Do you currently own any pets?
                    </label>
                    <select
                      id="hasPets"
                      name="hasPets"
                      value={formData.hasPets}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="reasonForAdoption"
                      className="block text-gray-700"
                    >
                      Reason for Adoption
                    </label>
                    <textarea
                      id="reasonForAdoption"
                      name="reasonForAdoption"
                      value={formData.reasonForAdoption}
                      onChange={handleChange}
                      placeholder="Reason for adoption"
                      className="textarea textarea-bordered w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="experienceWithPets"
                      className="block text-gray-700"
                    >
                      Experience with Pets
                    </label>
                    <textarea
                      id="experienceWithPets"
                      name="experienceWithPets"
                      value={formData.experienceWithPets}
                      onChange={handleChange}
                      placeholder="Experience with pets"
                      className="textarea textarea-bordered w-full"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="agreementToTerms"
                      name="agreementToTerms"
                      checked={formData.agreementToTerms}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="agreementToTerms"
                      className="ml-2 text-gray-700"
                    >
                      Agreement to Terms
                    </label>
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      className="btn bg-[#6AA693] text-white w-1/3 md:col-span-2"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className={`btn text-white w-1/3 md:col-span-2 ${
                        isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <span className="loading loading-spinner loading-sm mr-2"></span>
                          Submitting...
                        </span>
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
          <div className="w-full lg:w-1/3 justify-end flex flex-col">
            <button
              className="flex gap-1 font-lora justify-end mb-2"
              onClick={handleReturn}
            >
              <ArrowLeftIcon className="w-6 h-6 text-[#6AA693]" />
              Back
            </button>
            <div className="w-full bg-gray-100 p-6 rounded-lg mt-6 lg:mt-0 md:mb-4 sm:mb-4">
              <div className="flex flex-col items-center">
                {/* Display pet image */}
                <img
                  src={`${config.UPLOAD_BASE_URL}/${pet?.photo}`}
                  alt={pet?.name || "Pet Image"}
                  className="w-32 h-32 rounded-lg object-cover"
                />
                {/* Display pet name and gender */}
                <h3 className="text-lg font-bold mt-2">
                  {pet?.name}{" "}
                  <span className="text-blue-500">
                    {pet?.gender === "Male" ? "♂" : "♀"}
                  </span>
                </h3>
                {/* Display pet age */}
                <p className="text-gray-600">{pet?.age} months</p>
                {/* Display pet type */}
                <p className="text-gray-600">{pet?.type}</p>
              </div>
              <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold">Description</h4>
                <p className="text-gray-600 text-sm">
                  {pet?.description || "No description available"}
                </p>
              </div>
              <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold">Medical Conditions</h4>
                <p className="text-gray-600 text-sm">
                  {pet?.medicalConditions || "None"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <ConfirmDialogBox
          isOpen={isDialogOpen}
          handleConfirm={handleDialogConfirm}
          handleClose={handleDialogClose}
          label="Are you sure you want to go back without saving?"
        />
      )}

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default PetAdoptionForm;
