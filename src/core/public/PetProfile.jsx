import { BookmarkIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppBar from "../../shared/AppBar/AppBar";
import Footer from "../../shared/Footer/Footer";

const fetchPets = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/v1/pet/getAllPets"
  );
  return response.data.pets;
};
const PetProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [pet, setPet] = useState(null);

  const {
    data: pets,
    isLoading,
    error,
  } = useQuery({ queryKey: ["pets"], queryFn: fetchPets });

  useEffect(() => {
    // Fetch pet data (this can be done using a real API call)
    const fetchPetData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/pet/get/${id}`
        );
        setPet(response.data);

        // Check if the logged-in user's ID matches any in the bookmarkedBy array
        const userId = localStorage.getItem("userId"); // Assuming the userId is stored in localStorage
        if (userId && response.data.bookmarkedBy.includes(userId)) {
          setIsBookmarked(true);
        }
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };

    fetchPetData();
  }, [id]);

  console.log("Pet data:", pet);

  const toggleBookmark = async () => {
    try {
      // Get the authentication token (replace with your own method to retrieve it)
      const token = localStorage.getItem("authToken"); // Example: Getting from localStorage
      const userId = localStorage.getItem("userId");

      const response = await axios.post(
        `http://localhost:5000/api/v1/pet/${id}/bookmark`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );

      if (response.data.success) {
        // Update the bookmark status based on the response
        setIsBookmarked((prev) => !prev);

        // Optionally update the 'bookmarkedBy' field on the backend (if necessary)
        if (isBookmarked) {
          // Remove userId from 'bookmarkedBy' if unbookmarking
          response.data.bookmarkedBy = response.data.bookmarkedBy.filter(
            (user) => user !== userId
          );
        } else {
          // Add userId to 'bookmarkedBy' if bookmarking
          response.data.bookmarkedBy.push(userId);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  if (!pet) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white font-lora">
      <AppBar />

      <div className="flex flex-col mx-8 my-6">
        <div className="bg-white shadow-md rounded-lg p-6 mx-6 lg:mx-20 flex flex-col lg:flex-row items-center justify-center gap-12 border-2">
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src={`http://localhost:5000/uploads/${pet?.photo}`}
              alt={pet.name}
              className="w-72 md:w-80 lg:w-96 h-auto rounded-xl shadow-lg border-4"
            />
          </div>

          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              {pet.name}
            </h2>
            <p className="text-xl text-gray-700 mb-4">
              {pet.type} - {pet.breed}
            </p>
            <p className="text-lg text-gray-600 mb-4">{pet.description}</p>
            <p className="text-lg text-gray-600 mb-6">{pet.healthDetails}</p>
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigate(`/adoption/${id}`)}
                className="bg-[#66AEA6] text-white px-8 py-3 rounded-lg hover:bg-[#30756D] transition-all duration-300 shadow-md"
              >
                Adopt {pet.name}
              </button>
              <button
                onClick={() => navigate(`/foster/${id}`)}
                className="bg-[#96614D] text-white px-8 py-3 rounded-lg hover:bg-[#A2715E] transition-all duration-300 shadow-md"
              >
                Foster {pet.name}
              </button>
              <button
                onClick={toggleBookmark}
                className={`px-6 py-3 rounded-lg transition-all duration-300 shadow-md flex items-center gap-2 ${
                  isBookmarked
                    ? "bg-[#FCDDC9] text-[#96614D]"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {isBookmarked ? (
                  <BookmarkIcon className="w-6 h-6" />
                ) : (
                  // <BookmarkSlashIcon className="w-6 h-6" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                    />
                  </svg>
                )}
                {/* {isBookmarked ? "Bookmarked" : "Bookmark"} */}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mx-6 md:mx-12 lg:mx-20 my-8 border-2">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Pet Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
            <p>
              <strong>Age:</strong> {pet.age} years
            </p>
            <p>
              <strong>Weight:</strong> {pet.weight} kg
            </p>
            <p>
              <strong>Height:</strong> {pet.height} cm
            </p>
            <p>
              <strong>Color:</strong> {pet.color}
            </p>
            <p>
              <strong>Eye Color:</strong> {pet.eyeColor}
            </p>
            <p>
              <strong>Fur Type:</strong> {pet.furType}
            </p>
            <p>
              <strong>Vaccinated:</strong> {pet.vaccinated ? "Yes" : "No"}
            </p>
            <p>
              <strong>Special Needs:</strong> {pet.specialNeeds ? "Yes" : "No"}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(pet.dateOfBirth).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex justify-center flex-col py-6 lg:mx-20 md:mx-12">
          <h3 className="text-xl font-bold text-center mb-6 text-gray-900 font-poppins">
            View More {pet.type}s
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {pets
              ?.filter((p) => p.type === pet?.type) // Ensure only same type pets are displayed
              .slice(0, 4)
              .map((pet) => (
                <div
                  key={pet.id}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    navigate(`/profile/${pet._id}`);
                  }}
                  className="rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow duration-300 border-2 cursor-pointer"
                >
                  <img
                    src={`http://localhost:5000/uploads/${pet?.photo}`}
                    alt={pet.name}
                    className="w-full h-56 object-cover rounded-t-lg"
                  />
                  <div className="p-4 sm:p-6 text-center relative">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800 font-poppins mb-2">
                      {pet.name}
                    </h4>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-600 text-sm absolute bottom-2 right-4 sm:bottom-4 sm:right-6"
                    >
                      View More
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PetProfile;
