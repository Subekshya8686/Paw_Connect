import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AppBar from "../../shared/AppBar/AppBar";
import Footer from "../../shared/Footer/Footer";

const breedMapping = {
  Dog: ["Labrador", "Bulldog", "Beagle"],
  Cat: ["Persian", "Siamese"],
  Parrot: ["Macaw", "Cockatoo"],
  Hamster: ["Syrian", "Dwarf"],
};

const adoptionStatuses = ["adopted", "available", "in foster care"];

const SearchPage = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const sizeParam = searchParams.get("size") || "5";

  const [pets, setPets] = useState([]);
  const [selectedSize, setSelectedSize] = useState(sizeParam);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [showBreedFilter, setShowBreedFilter] = useState(false); // Track visibility of breed filter

  useEffect(() => {
    if (!query) return;

    const lowerQuery = query.toLowerCase();
    const foundType = Object.keys(breedMapping).find(
      (type) => type.toLowerCase() === lowerQuery
    );

    const foundBreedType = Object.keys(breedMapping).find((type) =>
      breedMapping[type].some((breed) => breed.toLowerCase() === lowerQuery)
    );

    if (foundType) {
      setFilteredBreeds(breedMapping[foundType]);
      setSelectedBreed("");
    } else if (foundBreedType) {
      setFilteredBreeds(breedMapping[foundBreedType]);
      setSelectedBreed(query);
    } else {
      setFilteredBreeds(Object.values(breedMapping).flat());
      setSelectedBreed("");
    }
  }, [query]);

  useEffect(() => {
    const fetchPets = async () => {
      if (!query) return;
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/pet/getAllPets?search=${query}&breed=${selectedBreed}&adoptionStatus=${selectedStatus}&page=${currentPage}`
        );
        const data = await response.json();
        setPets(data.pets);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, [query, selectedBreed, selectedStatus, selectedSize, currentPage]);

  const navigateToPage = (
    newPage = 1,
    newBreed = selectedBreed,
    newStatus = selectedStatus
  ) => {
    navigate(
      `/search/${query}?page=${newPage}&size=${selectedSize}&breed=${newBreed}&adoptionStatus=${newStatus}`
    );
  };
  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      navigateToPage(newPage);
    }
  };

  const changeFilter = (value) => {
    setSelectedBreed(value);
    setCurrentPage(1);
    navigateToPage(1, value);
  };

  const changeStatus = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    navigateToPage(1, selectedBreed, status);
  };

  const clearFilters = () => {
    setSelectedBreed("");
    setSelectedStatus("");
    setCurrentPage(1);
    navigateToPage(1);
  };

  const toggleBreedFilter = () => {
    setShowBreedFilter(!showBreedFilter); // Toggle the visibility of the breed filter
  };

  return (
    <div className="min-h-screen flex flex-col font-lora">
      <AppBar />
      <h3 className="text-xl font-bold text-gray-900 px-12 pt-4 lg:mx-16">
        Search Results for "{query}"
      </h3>

      <div className="flex flex-col md:flex-row flex-grow mt-6 px-12 mb-6 lg:mx-16">
        <div className="w-full md:w-1/4 bg-white p-6 shadow-md rounded-lg mb-6 md:mb-0">
          <h2 className="font-bold mb-4 text-center md:text-left text-xl">
            Filters
          </h2>

          {/* Add a button to toggle visibility of breed filter */}
          <button
            onClick={toggleBreedFilter}
            className="w-full pt-2 rounded-3xl flex items-center justify-center md:justify-start"
          >
            <h3 className="font-semibold text-center md:text-left">Breed</h3>
            <ChevronDownIcon className="ml-2 w-5 h-3" />
          </button>

          {/* Conditionally render breed filter section */}
          {showBreedFilter && filteredBreeds.length > 0 && (
            <div className="mb-4">
              {/* <h3 className="font-semibold text-center md:text-left">Breed</h3> */}
              <div className="flex flex-wrap justify-center md:justify-start ">
                {filteredBreeds.map((breed) => (
                  <button
                    key={breed}
                    onClick={() => changeFilter(breed)}
                    className={`px-6 py-2 rounded-3xl m-1 ${
                      selectedBreed === breed
                        ? "bg-[#96614D] text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {breed}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="divider"></div>
          <div className="mb-4">
            <h3 className="font-semibold text-center md:text-left">Status</h3>
            <div className="flex flex-wrap justify-center md:justify-start mt-2">
              {adoptionStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => changeStatus(status)}
                  className={`px-6 py-2 rounded-3xl m-1 ${
                    selectedStatus === status
                      ? "bg-[#96614D] text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="bg-[#96614D] text-white w-full py-2 mt-4 rounded-3xl justify-end"
          >
            Clear Filters
          </button>
        </div>

        <div className="w-3/4 grid grid-cols-3 gap-6 ml-6">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  navigate(`/profile/${pet._id}`);
                }}
                className="rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow duration-300 border-2 cursor-pointer"
              >
                <img
                  src={`http://localhost:5000/uploads/${pet.photo}`}
                  alt={pet.name}
                  className="w-full h-56 object-cover rounded-t-lg"
                />
                <div className="p-6 text-center relative">
                  <h4 className="text-xl font-semibold text-gray-800 font-poppins mb-2">
                    {pet.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {pet.adoptionStatus === "adopted" ? "Adopted" : "Available"}
                  </p>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-gray-600 text-sm self-end"
                  >
                    {"View More >>>"}
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center">
              No pets found for "{query}"
            </p>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-l-xl disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => changePage(num)}
              className={`px-4 py-2 mx-1 ${
                currentPage === num
                  ? "bg-[#96614D] text-white"
                  : "bg-white border"
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-r-xl disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SearchPage;
