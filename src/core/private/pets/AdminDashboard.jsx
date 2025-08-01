import { PlusCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingScreen from "../../../shared/LoadingScreen/LoadingScreen";
import CreatePet from "./CreatePet";

const AdminDashboard = () => {
  const [isCreatePetOpen, setIsCreatePetOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // status filter
  const [pet, setPet] = useState(null);

  const [rows, setRows] = useState([]);
  console.log("Pet data:", rows);

  const [isLoading, setIsLoading] = useState(true); // Track the loading state
  const [size, setSize] = useState(0);

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        // Simulate 2 seconds delay before fetching data
        setTimeout(async () => {
          const response = await axios.get(
            `http://localhost:5000/api/v1/pet/getAllPets`,
            {
              params: {
                size, // Send the size (per page)
              },
            }
          );
          setPet(response.data.pets);
          setRows(response.data.pets);
          setIsLoading(false); // Set isLoading to false once data is fetched
        }, 2000); // 2 seconds delay
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set isLoading to false even if an error occurs
      }
    };

    fetchPetData();

    // Cleanup timeout if the component unmounts
    return () => clearTimeout(fetchPetData);
  }, []);

  const columns = ["Name", "Type", "Breed", "Vaccinated", "Status"];

  // Update the filter logic to include status filter
  const filteredRows = rows.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (typeFilter ? pet.type === typeFilter : true) &&
      (statusFilter ? pet.adoptionStatus === statusFilter : true) // Filter by adoption status
  );

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen /> // Show loading screen if isLoading is true
      ) : (
        <div className="flex-1 px-4 font-lora">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-2xl font-bold">Pet List</h2>
          </div>

          <div className="bg-base-100 shadow-xl rounded-lg p-4 sm:p-6 max-w-full h-[85vh] overflow-auto">
            {isCreatePetOpen ? (
              <CreatePet handleModalClose={() => setIsCreatePetOpen(false)} />
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 mb-2 items-center">
                    <h3 className="text-md sm:text-lg font-bold">
                      Filter Options
                    </h3>
                    <select
                      className="select select-bordered rounded-xl"
                      defaultValue="All Types"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="bird">Bird</option>
                    </select>
                    <select
                      className="select select-bordered rounded-xl"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="available">Available</option>
                      <option value="adopted">Adopted</option>
                      <option value="in foster care">In Foster Care</option>
                    </select>
                  </div>
                  <div className="flex gap-4 mb-2 items-center">
                    <input
                      type="text"
                      placeholder="Search by Name"
                      className="input input-bordered h-10 w-[60%] max-w-xs rounded-xl items-center flex"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                      className="text-md sm:text-lg font-bold flex items-center gap-2"
                      onClick={() => setIsCreatePetOpen(true)}
                    >
                      Add Pet
                      <PlusCircleIcon className="w-8 h-8" />
                    </button>
                  </div>
                </div>
                {/* Table Wrapper with scroll */}
                <div className="h-[500px] sm:h-[400px] overflow-y-auto">
                  <table className="table-auto table-zebra w-full text-sm sm:text-base">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr>
                        {columns.map((column, index) => (
                          <th key={index} className="p-2 text-left">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.map((pet, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{capitalizeWords(pet.name)}</td>
                          <td className="p-2">{capitalizeWords(pet.type)}</td>
                          <td className="p-2">{capitalizeWords(pet.breed)}</td>
                          <td className="p-2">
                            <span
                              className={`badge ${
                                pet.vaccinated
                                  ? "badge-success text-white font-bold"
                                  : "badge-error font-bold"
                              }`}
                            >
                              {pet.vaccinated ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="p-2">
                            <span
                              className={`badge ${
                                pet.adoptionStatus === "available"
                                  ? "badge-info font-bold"
                                  : pet.adoptionStatus === "adopted"
                                  ? "badge-success text-white font-bold"
                                  : pet.adoptionStatus === "in foster care"
                                  ? "badge-warning font-bold"
                                  : ""
                              }`}
                            >
                              {capitalizeWords(pet.adoptionStatus)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
