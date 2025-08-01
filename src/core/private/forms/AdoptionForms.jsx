import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingScreen from "../../../shared/LoadingScreen/LoadingScreen";

const DownloadCSVButton = () => {
  const handleDownload = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/adopt/download",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the response is successful
      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();

        // Create a download link
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "adoption_applications.csv"; // File name for the download
        link.click(); // Trigger the download
      } else {
        console.error("Failed to download CSV");
      }
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  return (
    <button
      className="bg-[#66AEA6] text-white hover:bg-[#30756D] py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
      onClick={handleDownload}
    >
      Export as CSV
      <ArrowDownTrayIcon className="w-5 h-5 ml-2" />
    </button>
  );
};

const PetAdoptionForms = () => {
  const [isCreatePetOpen, setIsCreatePetOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [adminStatusFilter, setAdminStatusFilter] = useState(""); // New filter state
  const [isLoading, setIsLoading] = useState(true);

  const [petIds, setPetIds] = useState([]);
  const [rows, setRows] = useState([]);
  console.log("Pet data:", rows);

  useEffect(() => {
    // Fetch pet data (this can be done using a real API call)
    const fetchPetData = async () => {
      try {
        setTimeout(async () => {
          const response = await axios.get(
            `http://localhost:5000/api/v1/adopt/getAll`
          );
          setRows(response.data.data);
          const ids = response.data.data.map((pet) => pet.id); // Assuming each pet has an 'id' field
          setPetIds(ids);
          setIsLoading(false); // Set loading to false after data is fetched
        }, 5000);
        console.log("Pet data:", response.data.data);
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };

    fetchPetData();
  }, []);

  const columns = [
    "Applicant Name",
    "Applicant Phone",
    "Applicant Email",
    "Admin Status",
    "Action",
  ];

  // const handleReviewStatus = async (petId, status) => {
  //   const adminId = localStorage.getItem("userId"); // Get admin ID from localStorage

  //   if (!adminId) {
  //     console.error("Admin ID not found in localStorage.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.put(
  //       `http://localhost:5000/api/v1/adopt/${petId}/review`,
  //       {
  //         adminId,
  //         status,
  //       }
  //     );
  //     if (response.data.success) {
  //       // Update pet status in the state
  //       setRows((prevRows) =>
  //         prevRows.map((pet) =>
  //           pet.id === petId ? { ...pet, adminStatus: status } : pet
  //         )
  //       );
  //       console.log("Adoption status updated successfully:", response.data);
  //     } else {
  //       console.error(
  //         "Failed to update adoption status:",
  //         response.data.message
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error updating adoption status:", error);
  //   }
  // };
  const handleReviewStatus = async (petId, adminStatus) => {
    const adminId = localStorage.getItem("userId"); // Get admin ID from localStorage

    if (!adminId) {
      console.error("Admin ID not found in localStorage.");
      return;
    }

    // Log the pet (application) ID when the action is triggered
    console.log(`Application ID: ${petId} - Action: ${adminStatus}`);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/adopt/${petId}/review`,
        {
          adminId,
          adminStatus,
        }
      );

      // Check for successful response by status code
      if (response.status === 200) {
        // Update pet status in the state
        setRows((prevRows) =>
          prevRows.map((pet) =>
            pet._id === petId ? { ...pet, adminStatus: adminStatus } : pet
          )
        );
        console.log("Adoption status updated successfully:", response.data);
        // Reload the page to reflect the updated data
        window.location.reload();
      } else {
        console.error(
          "Failed to update adoption status:",
          response.data.message || response.statusText
        );
      }
    } catch (error) {
      console.error("Error updating adoption status:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen /> // Show loading screen if isLoading is true
      ) : (
        <div className="flex-1 px-4 font-lora">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-2xl font-bold">Adoption List</h2>
          </div>

          <div className="bg-base-100 shadow-xl rounded-lg p-4 sm:p-6 max-w-full h-[85vh]">
            <div className="flex justify-between items-center">
              <div className="flex gap-4 mb-2 items-center">
                <h3 className="text-md sm:text-lg font-bold">Filter Options</h3>
                {/* New select for Admin Status filter */}
                <select
                  className="select select-bordered rounded-xl"
                  value={adminStatusFilter}
                  onChange={(e) => setAdminStatusFilter(e.target.value)}
                >
                  <option value="">All Admin Status</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="flex gap-4 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Search by Name"
                  className="input input-bordered h-10 max-w-xs rounded-xl items-center flex"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <DownloadCSVButton />
              </div>
            </div>

            {/* Table Wrapper with scroll */}
            <div className="h-[500px] sm:h-[400px] overflow-y-auto">
              <table className="table-auto w-full text-sm sm:text-base table-zebra">
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
                  {rows
                    .filter(
                      (pet) =>
                        pet.applicantName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) &&
                        (typeFilter ? pet.type === typeFilter : true) &&
                        (statusFilter
                          ? pet.adoptionStatus === statusFilter
                          : true) &&
                        (adminStatusFilter
                          ? pet.adminStatus === adminStatusFilter
                          : true)
                    )
                    .map((pet, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{pet.applicantName}</td>
                        <td className="p-2">{pet.applicantPhone}</td>
                        <td className="p-2">{pet.applicantEmail}</td>
                        {/* <td className="p-2">
                      <span
                        className={`badge ${
                          pet.vaccinated ? "badge-success" : "badge-error"
                        }`}
                      >
                        {pet.vaccinated ? "Yes" : "No"}
                      </span>
                    </td> */}
                        <td className="p-2">
                          <span
                            className={`badge ${
                              pet.adminStatus === "Under Review"
                                ? "badge-info"
                                : pet.adminStatus === "Approved"
                                ? "badge-success"
                                : pet.adminStatus === "Rejected"
                                ? "badge-warning"
                                : ""
                            }`}
                          >
                            {pet.adminStatus}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <button
                              className="btn btn-sm btn-outline btn-success"
                              onClick={() =>
                                handleReviewStatus(pet._id, "Approved")
                              }
                              disabled={
                                pet.adminStatus === "Approved" ||
                                pet.adminStatus === "Rejected"
                              } // Disable if status is "Approved" or "Rejected"
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-outline btn-warning"
                              onClick={() =>
                                handleReviewStatus(pet._id, "Rejected")
                              }
                              disabled={
                                pet.adminStatus === "Approved" ||
                                pet.adminStatus === "Rejected"
                              } // Disable if status is "Approved" or "Rejected"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PetAdoptionForms;
