import agent1 from "../assets/agent1.webp";
import agent2 from "../assets/agent2.webp";
import agent3 from "../assets/agent3.webp";
import { MdPets, MdLocalLaundryService } from "react-icons/md";
import {
  FaSchool,
  FaBus,
  FaUtensils,
  FaShoppingCart,
  FaHospital,
  FaUniversity,
  FaTrain,
  FaTree,
  FaWifi,
  FaTv,
  FaParking,
  FaSnowflake,
} from "react-icons/fa";

export const cities = ["London", "Barcelona", "Paris", "Lisbon"];

export const placesOptions = [
  "School",
  "Restaurant",
  "Train",
  "University",
  "Bus",
  "Park",
  "Supermarket",
  "Hospital",
];

export const utilityOptions = [
  "Renter is responsible",
  "Tenant is responsible",
  "Shared",
];

export const petPolicyOptions = ["Pets are allowed", "Pets are not allowed"];

export const propertyOptions = ["Apartment", "House", "Land", "Condo"];

export const nearbyPlacesImgs = [
  { label: "School", icon: <FaSchool /> },
  { label: "Restaurant", icon: <FaUtensils /> },
  { label: "Train", icon: <FaTrain /> },
  { label: "University", icon: <FaUniversity /> },
  { label: "Bus", icon: <FaBus /> },
  { label: "Park", icon: <FaTree /> },
  { label: "Supermarket", icon: <FaShoppingCart /> },
  { label: "Hospital", icon: <FaHospital /> },
];

export const featureOptions = [
  { label: "tv", icon: <FaTv /> },
  { label: "wifi", icon: <FaWifi /> },
  { label: "laundry", icon: <MdLocalLaundryService /> },
  { label: "kitchen", icon: <FaUtensils /> },
  { label: "ac", icon: <FaSnowflake /> },
  { label: "pets", icon: <MdPets /> },
  { label: "parking", icon: <FaParking /> },
];

export const placeIcons = {
  School: <FaSchool />,
  Bus: <FaBus />,
  Restaurant: <FaUtensils />,
  Supermarket: <FaShoppingCart />,
  Hospital: <FaHospital />,
  University: <FaUniversity />,
  Train: <FaTrain />,
  Park: <FaTree />,
};

export const typeOptions = ["rent", "buy"];

export const agents = [
  {
    name: "Emily Johnson",
    role: "Senior Real Estate Agent",
    image: agent1,
    description:
      "Emily has over 10 years of experience helping families find their perfect homes. She specializes in luxury properties and waterfront villas.",
  },
  {
    name: "Michael Smith",
    role: "Commercial Property Expert",
    image: agent2,
    description:
      "Michael focuses on commercial real estate, helping businesses locate ideal office spaces and retail locations across the city.",
  },
  {
    name: "Sofia Lee",
    role: "Residential Consultant",
    image: agent3,
    description:
      "Sofia brings a personal approach to each client, guiding them through every step of the buying or renting process.",
  },
];
