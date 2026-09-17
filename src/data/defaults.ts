import hero1Img from "@/assets/hero-1.jpg";
import hero2Img from "@/assets/hero-2.jpg";
import hero3Img from "@/assets/hero-3.jpg";
import productResidentialImg from "@/assets/product-residential.jpg";
import productCommercialImg from "@/assets/product-commercial.jpg";
import serviceMaintenanceImg from "@/assets/service-maintenance.jpg";
import galleryDetailImg from "@/assets/gallery-detail.jpg";
import projectApartmentImg from "@/assets/project-apartment.jpg";

const getSrc = (img: unknown): string => {
  if (typeof img === "string") return img;
  if (img && typeof img === "object" && "src" in img && typeof (img as { src: unknown }).src === "string") {
    return (img as { src: string }).src;
  }
  return "";
};

const hero1 = getSrc(hero1Img);
const hero2 = getSrc(hero2Img);
const hero3 = getSrc(hero3Img);
const productResidential = getSrc(productResidentialImg);
const productCommercial = getSrc(productCommercialImg);
const serviceMaintenance = getSrc(serviceMaintenanceImg);
const galleryDetail = getSrc(galleryDetailImg);
const projectApartment = getSrc(projectApartmentImg);

export const HERO_IMAGES = { hero1, hero2, hero3 };

export type Service = {
  id: string;
  title: string;
  short: string;
  description: string;
  image: string;
  icon: string;
  active: boolean;
};

export type Product = {
  id: string;
  name: string;
  short: string;
  description: string;
  image: string;
  features: string[];
  price: string;
  active: boolean;
};

export type Project = {
  id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  image: string;
  completion: string;
  active: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  active: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  rating: number;
  message: string;
  avatar: string;
  active: boolean;
};

export type LeadStatus = "New" | "Contacted" | "Closed";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  date: string;
  status: LeadStatus;
};

export type Banner = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
};

export type Settings = {
  businessName: string;
  phone: string;
  email: string;
  address: string;
  heroHeading: string;
  heroTagline: string;
  heroDescription: string;
  aboutTitle: string;
  aboutText: string;
  footerText: string;
  stats: { label: string; value: string }[];
  banners: Banner[];
};

export type DemoData = {
  settings: Settings;
  services: Service[];
  products: Product[];
  projects: Project[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  leads: Lead[];
};

export const defaultSettings: Settings = {
  businessName: "Sartaj Solar Water System",
  phone: "08446614927",
  email: "info@sartajsolar.in",
  address:
    "Blue Cross Road, Sr. No. 5, Sharad Nagar, Mundhwa, Pune, Maharashtra 411036",
  heroHeading: "Sustainable Solar Water Heating Solutions",
  heroTagline: "Efficient • Reliable • Eco-Friendly",
  heroDescription:
    "Solar water heating systems designed, installed and serviced for homes, housing societies and businesses across Pune.",
  aboutTitle: "Hot water from sunlight, engineered to last",
  aboutText:
    "Sartaj Solar Water System supplies, installs and maintains solar water heating systems for residential and commercial customers. Our team helps you size the right system, handles rooftop installation and piping, and keeps the system running with planned maintenance and prompt repair support. Every installation is built around daily hot water demand, available roof space and long-term energy savings.",
  footerText:
    "Solar water heating for homes, societies and businesses in Pune. This is a demonstration website built with sample content.",
  stats: [
    { label: "Years Experience", value: "10+" },
    { label: "Installations", value: "500+" },
    { label: "Customer Focus", value: "100%" },
    { label: "Eco-Friendly Systems", value: "Always" },
  ],
  banners: [
    {
      id: "b1",
      image: hero1,
      title: "Solar Water Heating Solutions",
      subtitle: "Rooftop systems sized for your daily hot water needs",
    },
    {
      id: "b2",
      image: hero2,
      title: "Save Energy With Solar Water Heater",
      subtitle: "Cut electricity use for water heating, month after month",
    },
    {
      id: "b3",
      image: hero3,
      title: "Reliable Hot Water For Home & Business",
      subtitle: "Residential, society and commercial installations",
    },
  ],
};

export const defaultServices: Service[] = [
  {
    id: "s1",
    title: "Solar Water Heater Installation",
    short: "Complete supply, rooftop mounting and plumbing connection.",
    description:
      "Site survey, system sizing, structure fabrication, collector mounting, insulated piping and commissioning — handled end to end by our installation team.",
    image: hero1,
    icon: "sun",
    active: true,
  },
  {
    id: "s2",
    title: "Solar Water Heater Maintenance",
    short: "Planned servicing to keep output and hot water steady.",
    description:
      "Tube and collector cleaning, scaling checks, valve and insulation inspection, and performance checks under an annual maintenance schedule.",
    image: serviceMaintenance,
    icon: "wrench",
    active: true,
  },
  {
    id: "s3",
    title: "Residential Solar Water Heating",
    short: "Systems for bungalows, flats and row houses.",
    description:
      "100 to 500 litre systems matched to family size and bathroom count, with backup heating options for cloudy days.",
    image: productResidential,
    icon: "home",
    active: true,
  },
  {
    id: "s4",
    title: "Commercial Solar Water Heating",
    short: "High volume hot water for business operations.",
    description:
      "Engineered systems for hotels, hostels, hospitals, canteens and industrial process water, with manifold piping and bulk storage.",
    image: productCommercial,
    icon: "building",
    active: true,
  },
  {
    id: "s5",
    title: "Solar System Consultation",
    short: "Sizing, layout and savings guidance before you buy.",
    description:
      "We assess roof orientation, shading, water quality and usage patterns, then recommend the right capacity and collector type.",
    image: galleryDetail,
    icon: "clipboard",
    active: true,
  },
  {
    id: "s6",
    title: "Repair & Service",
    short: "Leak, pressure and heating issues resolved quickly.",
    description:
      "Tube replacement, tank and valve repair, pipeline leak fixing, pump and controller troubleshooting for all common system types.",
    image: serviceMaintenance,
    icon: "tools",
    active: true,
  },
];

export const defaultProducts: Product[] = [
  {
    id: "p1",
    name: "Residential Solar Water Heater",
    short: "Compact evacuated tube system for family homes.",
    description:
      "A pressurised rooftop system with an insulated storage tank, suitable for daily bathing and kitchen hot water in homes of three to six people.",
    image: productResidential,
    features: [
      "100 / 150 / 200 litre capacity",
      "Evacuated tube collectors",
      "Insulated storage tank",
      "Optional electric backup",
    ],
    price: "Demo price on request",
    active: true,
  },
  {
    id: "p2",
    name: "Commercial Solar Water Heater",
    short: "Bulk hot water for hotels, hostels and industry.",
    description:
      "Modular collector banks feeding large insulated tanks, with manifold piping and controls for continuous high-volume hot water demand.",
    image: productCommercial,
    features: [
      "500 to 10,000 litre systems",
      "Manifold collector banks",
      "Bulk insulated storage",
      "Pump and controller options",
    ],
    price: "Demo price on request",
    active: true,
  },
  {
    id: "p3",
    name: "Rooftop Solar Water Heating System",
    short: "Structure-mounted system for shared rooftops.",
    description:
      "Designed for housing societies and apartment rooftops where several units share roof area, with individual or common storage layouts.",
    image: projectApartment,
    features: [
      "Galvanised mounting structure",
      "Per-flat or common storage",
      "Roof-space optimised layout",
      "Low maintenance piping",
    ],
    price: "Demo price on request",
    active: true,
  },
  {
    id: "p4",
    name: "High Efficiency Solar Water Heating System",
    short: "Premium collectors for faster heating and hard water.",
    description:
      "Higher-grade absorber coating and thicker insulation for quicker heat-up, better overnight retention and improved performance in cooler months.",
    image: galleryDetail,
    features: [
      "High absorption coating",
      "Thick tank insulation",
      "Better winter performance",
      "Hard water friendly options",
    ],
    price: "Demo price on request",
    active: true,
  },
];

export const defaultProjects: Project[] = [
  {
    id: "pr1",
    title: "Residential Rooftop System",
    location: "Mundhwa, Pune",
    category: "Residential",
    description:
      "200 litre evacuated tube system installed for a family home, replacing daily electric geyser use.",
    image: hero1,
    completion: "Completed",
    active: true,
  },
  {
    id: "pr2",
    title: "Housing Society Installation",
    location: "Kharadi, Pune",
    category: "Housing Society",
    description:
      "Multiple rooftop units installed across an apartment building with shared mounting structure and individual storage.",
    image: projectApartment,
    completion: "Completed",
    active: true,
  },
  {
    id: "pr3",
    title: "Hotel Hot Water System",
    location: "Hadapsar, Pune",
    category: "Commercial",
    description:
      "Commercial collector bank with bulk insulated storage supporting continuous guest hot water demand.",
    image: hero3,
    completion: "Completed",
    active: true,
  },
  {
    id: "pr4",
    title: "Industrial Process Water Pre-heating",
    location: "Wagholi, Pune",
    category: "Industrial",
    description:
      "Solar pre-heating loop feeding an existing boiler line to reduce fuel consumption during day shifts.",
    image: productCommercial,
    completion: "Ongoing",
    active: true,
  },
];

export const defaultGallery: GalleryItem[] = [
  {
    id: "g1",
    title: "Rooftop Evacuated Tube System",
    category: "Solar Water Heater",
    description: "Residential system mounted on a terrace in Pune.",
    image: hero1,
    active: true,
  },
  {
    id: "g2",
    title: "Panel Installation In Progress",
    category: "Installation",
    description: "Flat plate collectors being fixed to a sloped roof.",
    image: hero2,
    active: true,
  },
  {
    id: "g3",
    title: "Commercial Collector Bank",
    category: "Commercial",
    description: "Large collector array with bulk storage tanks.",
    image: hero3,
    active: true,
  },
  {
    id: "g4",
    title: "Residential Unit Close-up",
    category: "Residential",
    description: "Compact 100 litre unit on a terrace.",
    image: productResidential,
    active: true,
  },
  {
    id: "g5",
    title: "Manifold & Copper Piping",
    category: "Installation",
    description: "Insulated piping detail at the collector header.",
    image: galleryDetail,
    active: true,
  },
  {
    id: "g6",
    title: "Society Rooftop Project",
    category: "Projects",
    description: "Multiple systems arranged on an apartment rooftop.",
    image: projectApartment,
    active: true,
  },
  {
    id: "g7",
    title: "Service Visit",
    category: "Installation",
    description: "Scheduled maintenance of a rooftop system.",
    image: serviceMaintenance,
    active: true,
  },
  {
    id: "g8",
    title: "Industrial Tank Setup",
    category: "Commercial",
    description: "Stainless storage tanks for high volume hot water.",
    image: productCommercial,
    active: true,
  },
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Demo Customer — Residential",
    location: "Mundhwa, Pune",
    rating: 5,
    message:
      "Sample testimonial for the demo. The installation was neat and we now get hot water without switching on the geyser most mornings.",
    avatar: "",
    active: true,
  },
  {
    id: "t2",
    name: "Demo Customer — Housing Society",
    location: "Kharadi, Pune",
    rating: 5,
    message:
      "Sample testimonial for the demo. The team planned the rooftop layout well and finished the society installation on schedule.",
    avatar: "",
    active: true,
  },
  {
    id: "t3",
    name: "Demo Customer — Commercial",
    location: "Hadapsar, Pune",
    rating: 4,
    message:
      "Sample testimonial for the demo. Service visits are prompt and the hot water supply has been steady through the season.",
    avatar: "",
    active: true,
  },
];

export const defaultLeads: Lead[] = [
  {
    id: "l1",
    name: "Demo Enquiry",
    phone: "08446614927",
    email: "demo@example.com",
    service: "Solar Water Heater Installation",
    message:
      "Sample lead included with the demo. Looking for a 200 litre system for a 4-member family.",
    date: new Date().toISOString(),
    status: "New",
  },
];

export const defaultData: DemoData = {
  settings: defaultSettings,
  services: defaultServices,
  products: defaultProducts,
  projects: defaultProjects,
  gallery: defaultGallery,
  testimonials: defaultTestimonials,
  leads: defaultLeads,
};
