import { PlusCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingScreen from "../../../shared/LoadingScreen/LoadingScreen";
import CreateUser from "./CreateUser";

const UsersTable = () => {
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track the loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Simulate 2 seconds delay before fetching data
        setTimeout(async () => {
          const response = await axios.get("http://localhost:5000/api/v1/user");
          setRows(response.data.data); // Set the fetched data
          setIsLoading(false); // Set isLoading to false once data is fetched
        }, 2000); // 2 seconds delay
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set isLoading to false even if an error occurs
      }
    };

    fetchUserData();

    // Cleanup timeout if the component unmounts
    return () => clearTimeout(fetchUserData);
  }, []);

  const columns = ["User ID", "Name", "Role", "Email", "Phone"];

  // Filtered users based on role and search term
  const filteredUsers = rows.filter((user) => {
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    return matchesRole && matchesSearch;
  });

  return (
    <>
      {isLoading ? (
        <LoadingScreen /> // Show loading screen if isLoading is true
      ) : (
        <div className="flex-1 px-4 font-lora">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-2xl font-bold">Users List</h2>
            {/* <button onClick={() => setMenuOpen((prev) => !prev)}>
              <UserCircleIcon className="w-12 h-12 text-[#A35E47] hover:text-[#8A4D3B]" />
            </button> */}
          </div>
          {/* {menuOpen && (
            <div className="absolute right-10 z-10 w-40 bg-white shadow-lg rounded-lg p-2">
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )} */}
          <div className="bg-base-100 shadow-xl rounded-lg p-4 sm:p-6 max-w-full h-[80vh]">
            {isCreateUserOpen ? (
              <CreateUser handleModalClose={() => setIsCreateUserOpen(false)} />
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 mb-2 items-center">
                    <h3 className="text-md sm:text-lg font-bold">
                      Filter Options
                    </h3>
                    <select
                      className="select select-bordered rounded-xl"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option value="">All Users</option>
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                  </div>
                  <div className="flex gap-4 mb-2 items-center w-[40%]">
                    <input
                      type="text"
                      placeholder="Search by Name, Email, Phone"
                      className="input input-bordered h-10 max-w-xs rounded-xl"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                      className="text-md sm:text-lg font-bold flex items-center gap-2"
                      onClick={() => setIsCreateUserOpen(true)}
                    >
                      Add New User
                      <PlusCircleIcon className="w-8 h-8 text-[#66AEA6]" />
                    </button>
                  </div>
                </div>
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
                      {filteredUsers.map((user, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{user._id}</td>
                          <td className="p-2">{user.name}</td>
                          <td className="p-2">{user.role}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">{user.phone}</td>
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

export default UsersTable;
