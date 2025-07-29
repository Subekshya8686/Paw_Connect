import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/config";
import AppBar from "../../shared/AppBar/AppBar";
import Footer from "../../shared/Footer/Footer";

const fetchPets = async () => {
  const response = await axios.get(`${config.API_BASE_URL}/pet/getAllPets`, {
    withCredentials: true,
  });

  // const response = await axios.get("https://192.168.196.1:5443/api/v1/pet/getAllPets", {
  //   withCredentials: true,
  // });
  return response.data.pets;
};

const Dashboard = () => {
  const {
    data: pets,
    isLoading,
    error,
  } = useQuery({ queryKey: ["pets"], queryFn: fetchPets });
  const navigate = useNavigate();

  // Update petBreeds to hold both image source and breed name
  const petBreeds = [
    { image: "/german_shep.jpg", breed: "German Shepherd" },
    { image: "/golden_retri.jpg", breed: "Golden Retriever" },
    { image: "/husky.jpg", breed: "Husky" },
    { image: "/labrador.jpg", breed: "Labrador" },
    { image: "/parrot.jpg", breed: "Parrot" },
    { image: "/persian.jpg", breed: "Persian" },
    { image: "/corgi_pup.jpg", breed: "Persian" },
  ];

  const [displayBreeds, setDisplayBreeds] = useState(petBreeds);
  const homeRef = useRef(null);
  const breedsRef = useRef(null);
  const petsRef = useRef(null);
  const footerRef = useRef(null);

  const scrollToSection = (sectionRef) => {
    window.scrollTo({
      top: sectionRef.current.offsetTop - 50,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const updateBreedCount = () => {
      if (window.innerWidth < 640) {
        setDisplayBreeds(petBreeds.slice(0, 2));
      } else if (window.innerWidth < 1024) {
        setDisplayBreeds(petBreeds.slice(0, 4));
      } else {
        setDisplayBreeds(petBreeds);
      }
    };

    updateBreedCount();
    window.addEventListener("resize", updateBreedCount);
    return () => window.removeEventListener("resize", updateBreedCount);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 font-lora">
      <AppBar
        scrollToSection={scrollToSection}
        homeRef={homeRef}
        breedsRef={breedsRef}
        petsRef={petsRef}
        footerRef={footerRef}
      />

      <div
        ref={homeRef}
        className="flex flex-col lg:flex-row items-center justify-center px-4 md:px-10 lg:px-20 gap-10 h-[65vh] py-10 bg-gradient-to-r from-indigo-100 to-purple-100"
      >
        <div className="flex justify-center w-full lg:w-1/2">
          <img
            src="/corgi.png"
            alt="Corgi"
            className="w-48 sm:w-56 md:w-64 lg:w-96 h-auto"
          />
        </div>
        <div className="text-center lg:text-left w-full lg:w-1/2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-900 mb-4 font-poppins">
            Everybody needs a friend in Life.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-indigo-700 font-poppins max-w-lg mx-auto lg:mx-0">
            The Corgi is intelligent, quick and curious. It is a kind,
            adventurous breed which shows a large measure of independence. They
            are good with children and normally kind with strangers.
          </p>
        </div>
      </div>

      <div ref={breedsRef} className="p-8 bg-white">
        <h3 className="text-xl font-bold text-center mb-6 text-indigo-900 font-poppins">
          Popular Pet Breeds
        </h3>
        <div className="flex flex-wrap justify-center gap-6">
          {displayBreeds.map((breed, index) => (
            <div
              key={index}
              onClick={() => navigate(`/search/${breed.breed}`)}
              className="w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex justify-center items-center shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <img
                src={breed.image}
                alt={`Breed ${index + 1}`}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          ))}
        </div>
      </div>

      <div
        ref={petsRef}
        className="p-8 mx-4 sm:mx-8 lg:mx-20 justify-center flex-col bg-gradient-to-br from-purple-50 to-indigo-50"
      >
        <h3 className="text-xl font-bold text-center mb-6 text-indigo-900 font-poppins">
          Pets Available For Adoption
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pets?.slice(0, 4).map((pet) => (
            <div
              key={pet._id}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                navigate(`/profile/${pet._id}`);
              }}
              className="rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-indigo-200 cursor-pointer hover:scale-105"
            >
              <img
                // src={pet.image || "/default-pet.jpg"}
                src={`${config.UPLOAD_BASE_URL}/${pet.photo}`}
                alt={pet.name}
                className="w-full h-56 object-cover rounded-t-lg"
              />
              <div className="p-4 sm:p-6 text-center relative">
                <h4 className="text-lg sm:text-xl font-semibold text-indigo-800 font-poppins mb-2">
                  {pet.name}
                </h4>
                <a
                  href="#"
                  className="text-indigo-500 hover:text-indigo-600 text-sm absolute bottom-2 right-4 sm:bottom-4 sm:right-6"
                >
                  View More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer footerRef={footerRef} />
    </div>
  );
};

export default Dashboard;
