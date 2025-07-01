import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/config";
import AppBar from "../../shared/AppBar/AppBar";
import Footer from "../../shared/Footer/Footer";
import api from "../../utils/api";

const fetchPets = async () => {
  const response = await api.get("/pet/getAllPets");
  return response.data.pets;
};

const Dashboard = () => {
  const {
    data: pets,
    isLoading,
    error,
  } = useQuery({ queryKey: ["pets"], queryFn: fetchPets });
  console.log(pets);
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
    <div className="min-h-screen bg-white font-lora">
      <AppBar
        scrollToSection={scrollToSection}
        homeRef={homeRef}
        breedsRef={breedsRef}
        petsRef={petsRef}
        footerRef={footerRef}
      />

      <div
        ref={homeRef}
        className="flex flex-col lg:flex-row items-center justify-center px-4 md:px-10 lg:px-20 gap-10 h-[65vh] py-10"
        style={{ backgroundColor: "#E0E7FF" }}
      >
        <div className="flex justify-center w-full lg:w-1/2">
          <img
            src="/corgi.png"
            alt="Corgi"
            className="w-48 sm:w-56 md:w-64 lg:w-96 h-auto"
          />
        </div>
        <div className="text-center lg:text-left w-full lg:w-1/2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 font-poppins">
            Everybody needs a friend in Life.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-black font-poppins max-w-lg mx-auto lg:mx-0">
            The Corgi is intelligent, quick and curious. It is a kind,
            adventurous breed which shows a large measure of independence. They
            are good with children and normally kind with strangers.
          </p>
        </div>
      </div>

      <div ref={breedsRef} className="p-8">
        <h3 className="text-xl font-bold text-center mb-6 text-gray-900 font-poppins">
          Popular Pet Breeds
        </h3>
        <div className="flex flex-wrap justify-center gap-6">
          {displayBreeds.map((breed, index) => (
            <div
              key={index}
              onClick={() => navigate(`/search/${breed.breed}`)}
              className="w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-gray-300 flex justify-center items-center shadow-sm cursor-pointer"
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
        className="p-8 mx-4 sm:mx-8 lg:mx-20 justify-center flex-col"
      >
        <h3 className="text-xl font-bold text-center mb-6 text-gray-900 font-poppins">
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
              className="rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow duration-300 border-2 cursor-pointer"
            >
              <img
                // src={pet.image || "/default-pet.jpg"}
                src={`${config.UPLOAD_BASE_URL}/${pet.photo}`}
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

      <Footer footerRef={footerRef} />
    </div>
  );
};

export default Dashboard;
