// Numbered images first (1.jpg, 2.jpg, 3.jpg, 4.jpg) in sequence, followed by additional images
// Maison Étudiante (Student House)
import student1 from "../Models plans/Maison Étudiante/1.jpg";
import student2 from "../Models plans/Maison Étudiante/2.jpg";
import studentExtra1 from "../Models plans/Maison Étudiante/Planner5d_AI_Studio_gpt-image-2-image-1 (1).jpg";
import studentExtra2 from "../Models plans/Maison Étudiante/Planner5d_AI_Studio_gpt-image-2-image-1 (3).jpg";
import studentExtra3 from "../Models plans/Maison Étudiante/Planner5d_AI_Studio_nano-banana-2-image-1 (1).jpg";
import studentExtra4 from "../Models plans/Maison Étudiante/Planner5d_AI_Studio_nano-banana-2-image-1 (2).jpg";
import studentExtra5 from "../Models plans/Maison Étudiante/Planner5d_AI_Studio_nano-banana-2-image-1.jpg";

// Tiny House (40m²)
import tiny1 from "../Models plans/40 m² PETITE MAISON/1.jpg";
import tiny2 from "../Models plans/40 m² PETITE MAISON/2.jpg";
import tiny3 from "../Models plans/40 m² PETITE MAISON/3.jpg";
import tiny4 from "../Models plans/40 m² PETITE MAISON/4.jpg";
import tiny5 from "../Models plans/40 m² PETITE MAISON/5.jpg";
import tiny6 from "../Models plans/40 m² PETITE MAISON/6.jpg";

// Apartment House (60m²)
import apartment1 from "../Models plans/60 M2/1.jpg";
import apartment2 from "../Models plans/60 M2/2.jpg";
import apartment3 from "../Models plans/60 M2/3.jpg";
import apartment4 from "../Models plans/60 M2/4.jpg";
import apartmentExtra1 from "../Models plans/60 M2/Planner5d_AI_Studio_gpt-image-2-image-1 (2).jpg";
import apartmentExtra2 from "../Models plans/60 M2/Planner5d_AI_Studio_gpt-image-2-image-1 (4).jpg";
import apartmentExtra3 from "../Models plans/60 M2/Planner5d_AI_Studio_gpt-image-2-image-1 (5).jpg";
import apartmentExtra4 from "../Models plans/60 M2/Planner5d_AI_Studio_gpt-image-2-image-1.jpg";

// Family House (120m²)
import family1 from "../Models plans/Maison 120 m²/1.jpg";
import family2 from "../Models plans/Maison 120 m²/2.jpg";
import family3 from "../Models plans/Maison 120 m²/3.jpg";
import family4 from "../Models plans/Maison 120 m²/4.jpg";
import familyExtra1 from "../Models plans/Maison 120 m²/Planner5d_AI_Studio_gpt-image-2-image-1 (2).jpg";
import familyExtra2 from "../Models plans/Maison 120 m²/Planner5d_AI_Studio_gpt-image-2-image-1 (3).jpg";
import familyExtra3 from "../Models plans/Maison 120 m²/Planner5d_AI_Studio_gpt-image-2-image-1 (4).jpg";
import familyExtra4 from "../Models plans/Maison 120 m²/Planner5d_AI_Studio_gpt-image-2-image-1.jpg";

// Space Capsule
import capsule1 from "../Models plans/spacecapsule/1.jpg";
import capsule2 from "../Models plans/spacecapsule/2.jpg";
import capsule3 from "../Models plans/spacecapsule/3.jpg";
import capsule4 from "../Models plans/spacecapsule/4.jpg";
import capsule5 from "../Models plans/spacecapsule/5.jpg";
import capsule6 from "../Models plans/spacecapsule/6.jpg";


export interface HouseModel {
  slug: string;
  key: 'student' | 'tiny' | 'apartment' | 'family' | 'capsule';
  size: number;
  marketPrice: number;
  price: number;
  monthlyPayment: number;
  financingMonths: number;
  discount: number;
  deliveryStock: string;
  deliveryFactory: string;
  youtubeId?: string;
  image: string;
  images: string[];
  badge?: string;
  isNew?: boolean;
}

export const HOUSES: HouseModel[] = [
  {
    slug: 'maison-etudiante',
    key: 'student',
    size: 15,
    marketPrice: 45000,
    price: 30000,
    monthlyPayment: 300,
    financingMonths: 120,
    discount: 33,
    deliveryStock: '1 semaine',
    deliveryFactory: '8–12 semaines',
    image: student1.src,
    images: [
      student1.src,
      student2.src,
      studentExtra1.src,
      studentExtra2.src,
      studentExtra3.src,
      studentExtra4.src,
      studentExtra5.src,
    ],
    badge: 'Populaire',
  },
  {
    slug: 'tiny-house',
    key: 'tiny',
    size: 40,
    marketPrice: 120000,
    price: 80000,
    monthlyPayment: 800,
    financingMonths: 120,
    discount: 33,
    deliveryStock: '1 semaine',
    deliveryFactory: '8–12 semaines',
    youtubeId: 'KLYpZF5pYXY',
    image: tiny1.src,
    images: [
      tiny1.src,
      tiny2.src,
      tiny3.src,
      tiny4.src,
      tiny5.src,
      tiny6.src,
    ],
  },
  {
    slug: 'maison-appartement',
    key: 'apartment',
    size: 60,
    marketPrice: 180000,
    price: 120000,
    monthlyPayment: 436,
    financingMonths: 420,
    discount: 33,
    deliveryStock: '1 semaine',
    deliveryFactory: '8–12 semaines',
    youtubeId: 'BaHwktBs0k8',
    image: apartment1.src,
    images: [
      apartment1.src,
      apartment2.src,
      apartment3.src,
      apartment4.src,
      apartmentExtra1.src,
      apartmentExtra2.src,
      apartmentExtra3.src,
      apartmentExtra4.src,
    ],
    badge: 'Meilleure vente',
    isNew: false,
  },
  {
    slug: 'maison-familiale',
    key: 'family',
    size: 120,
    marketPrice: 360000,
    price: 240000,
    monthlyPayment: 871,
    financingMonths: 420,
    discount: 33,
    deliveryStock: '1 semaine',
    deliveryFactory: '8–12 semaines',
    youtubeId: 'FlEBOLHKQ9k',
    image: family1.src,
    images: [
      family1.src,
      family2.src,
      family3.src,
      family4.src,
      familyExtra1.src,
      familyExtra2.src,
      familyExtra3.src,
      familyExtra4.src,
    ],
    isNew: false,
  },
  {
    slug: 'space-capsule',
    key: 'capsule',
    size: 40,
    marketPrice: 180000,
    price: 60000,
    monthlyPayment: 580,
    financingMonths: 120,
    discount: 67,
    deliveryStock: '1 semaine',
    deliveryFactory: '8–12 semaines',
    image: capsule1.src,
    images: [
      capsule1.src,
      capsule2.src,
      capsule3.src,
      capsule4.src,
      capsule5.src,
      capsule6.src,
    ],
    badge: 'Luxe',
    isNew: true,
  },
];

export const ENERGY_PRODUCTS = [
  {
    id: 'solar5',
    price: 6950,
    icon: '☀️',
    watts: 5000,
  },
  {
    id: 'solar10',
    price: 10355,
    icon: '⚡',
    watts: 10000,
  },
  {
    id: 'heating',
    price: 9450,
    icon: '🌡️',
  },
  {
    id: 'ventilation',
    price: 995,
    icon: '💨',
  },
  {
    id: 'rainwater',
    price: 115,
    icon: '💧',
  },
];

export const CONFIGURATOR_OPTIONS = {
  exterior: {
    'blanc-mat': { label: 'Blanc Mat', price: 0 },
    'anthracite': { label: 'Anthracite', price: 1500 },
    'bois-brule': { label: 'Bois Brûlé', price: 3500 },
    'chene-naturel': { label: 'Chêne Naturel', price: 2500 },
  },
  roof: {
    flat: { label: 'Toit plat', price: 0 },
    pitched: { label: 'Pente moderne', price: 4000 },
    metal: { label: 'Métal premium', price: 7500 },
  },
  energy: {
    solar5: { label: 'Kit solaire 5kW', price: 6950 },
    solar10: { label: 'Kit solaire 10kW', price: 10355 },
    battery: { label: 'Batteries', price: 4200 },
    rainwater: { label: 'Eau de pluie', price: 115 },
  },
  climate: {
    ventilation: { label: 'Ventilation', price: 995 },
    heating: { label: 'Chauffage', price: 9450 },
    cooling: { label: 'Climatisation', price: 2800 },
  },
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateMonthlyPayment(principal: number, months: number, annualRate = 0.039): number {
  const r = annualRate / 12;
  if (r === 0) return principal / months;
  return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
}