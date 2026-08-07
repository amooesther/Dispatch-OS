import type { Order, OrderStatus, OrderPriority } from "@/types";

const statuses: OrderStatus[] = ["pending", "assigned", "picked_up", "in_transit", "delivered", "cancelled", "failed"];
const priorities: OrderPriority[] = ["low", "normal", "high", "urgent"];

const nigerianCities = [
  { city: "Lagos", coords: { lat: 6.5244, lng: 3.3792 } },
  { city: "Abuja", coords: { lat: 9.0579, lng: 7.4951 } },
  { city: "Ibadan", coords: { lat: 7.3775, lng: 3.9470 } },
  { city: "Kano", coords: { lat: 12.0022, lng: 8.5920 } },
  { city: "Port Harcourt", coords: { lat: 4.8396, lng: 7.0134 } },
  { city: "Benin City", coords: { lat: 6.3293, lng: 5.6278 } },
  { city: "Akure", coords: { lat: 7.2527, lng: 5.1981 } },
  { city: "Enugu", coords: { lat: 6.4607, lng: 7.5486 } },
  { city: "Aba", coords: { lat: 5.1145, lng: 7.3584 } },
  { city: "Kaduna", coords: { lat: 10.5105, lng: 7.4165 } },
  { city: "Warri", coords: { lat: 5.4966, lng: 5.7346 } },
  { city: "Onitsha", coords: { lat: 6.1355, lng: 6.7870 } },
  { city: "Calabar", coords: { lat: 4.9501, lng: 8.3222 } },
  { city: "Owerri", coords: { lat: 5.4836, lng: 7.0333 } },
];

const streetAddresses = [
  "14 Alagbaka Estate", "22 Allen Avenue", "7 Broad Street", "33 Opebi Road",
  "Plot 12 GRA", "18 Wuse Zone 4", "5 Independence Layout", "9 Aba Road",
  "3 Trans-Amadi", "11 Ogui Road", "24 Awolowo Road", "2 Ring Road",
  "Km 3 Zaria Road", "Plot 7 VGC", "16 Orlu Road", "44 Creek Road",
  "8 Industrial Avenue", "19 Textile House", "6 Sabon Gari", "30 Oke-Arin Market",
];

const customerIds = Array.from({ length: 40 }, (_, i) => `c-${String(i + 1).padStart(3, "0")}`);
const customerNames = [
  "Adebayo Stores", "Kemi Fashions", "Nnamdi Supermart", "Tolu Electronics", "Hajia Binta's Kitchen",
  "Emeka & Sons Trading", "PharmaBridge Ltd", "Chinyere Boutique", "Gbemisola Farms", "Danladi Wholesale",
  "Aisha Beauty Supply", "Seun Auto Parts", "Mama Eze Caterers", "Oluwafemi Bookshop", "Nkechi's Fabrics",
  "Bright Computers", "Folake Organic Foods", "Alhaji Musa Traders", "Chukwudi Mobile Phones", "Grace Cosmetics",
  "Dan Agro Supplies", "Sola Furniture", "Ifeoma Medical Supplies", "Bassey Seafoods", "Mercy Tailoring House",
  "Eze Gas Station", "Biodun Printing Press", "Hajiya Zainab Fashion", "Richmond Hotels", "Frank's Hardware",
  "Precious Pharmacy", "Kunle Sports Gear", "Stella's Bakery", "Onyeka Import Export", "Fatima Herbal Store",
  "Obiageli Wines & Spirits", "Ade Bakeries", "Malam Yusuf Grains", "Nonso Electrical", "Yetunde Catering Services",
];

const driverIds = Array.from({ length: 30 }, (_, i) => `d-${String(i + 1).padStart(3, "0")}`);
const driverNames = [
  "Chukwuemeka Okonkwo", "Adaeze Nwosu", "Babatunde Fashola", "Ngozi Adeyemi", "Emeka Eze",
  "Funmi Akintoye", "Yusuf Garba", "Chiamaka Obi", "Segun Balogun", "Amina Bello",
  "Tunde Adeola", "Uchenna Nwofor", "Damilola Ogundimu", "Obioma Ihejirika", "Halima Musa",
  "Kolade Martins", "Ify Chukwu", "Rotimi Adewale", "Patience Okeke", "Sulaimon Alabi",
  "Ebele Ohayon", "Abubakar Sule", "Ngozi Onyekachi", "Victor Eze", "Ladi Yusuf",
  "Chisom Nwachukwu", "Rasheed Lawal", "Josephine Akpan", "Musa Danjuma", "Olamide Afolabi",
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

function offsetCoords(base: { lat: number; lng: number }, seed: number) {
  return {
    lat: base.lat + (seededRandom(seed) - 0.5) * 0.05,
    lng: base.lng + (seededRandom(seed + 1) - 0.5) * 0.05,
  };
}

function daysAgo(n: number): string {
  const d = new Date("2026-08-07T12:00:00Z");
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// Generate 130 orders
export const mockOrders: Order[] = Array.from({ length: 130 }, (_, i) => {
  const idx = i + 1;
  const seed = idx * 17;
  const statusIndex = Math.floor(seededRandom(seed + 2) * statuses.length);
  const status = statuses[statusIndex];
  const hasDriver = status !== "pending";
  const driverIndex = Math.floor(seededRandom(seed + 3) * driverIds.length);
  const pickupCity = pick(nigerianCities, seed + 4);
  const deliveryCity = pick(nigerianCities, seed + 5);
  const custIndex = Math.floor(seededRandom(seed + 6) * customerIds.length);
  const streetPickup = pick(streetAddresses, seed + 7);
  const streetDelivery = pick(streetAddresses, seed + 8);
  const amount = Math.round((seededRandom(seed + 9) * 95000 + 5000) / 500) * 500;
  const daysBack = Math.floor(seededRandom(seed + 10) * 60);
  const hoursBack = Math.floor(seededRandom(seed + 11) * 24);
  const createdAt = daysAgo(daysBack);

  return {
    id: `ND-${String(10000 + idx).slice(1)}`,
    customerId: customerIds[custIndex],
    customerName: customerNames[custIndex],
    driverId: hasDriver ? driverIds[driverIndex] : undefined,
    driverName: hasDriver ? driverNames[driverIndex] : undefined,
    pickupAddress: `${streetPickup}, ${pickupCity.city}`,
    deliveryAddress: `${streetDelivery}, ${deliveryCity.city}`,
    pickupCity: pickupCity.city,
    deliveryCity: deliveryCity.city,
    pickupCoordinates: offsetCoords(pickupCity.coords, seed + 12),
    deliveryCoordinates: offsetCoords(deliveryCity.coords, seed + 13),
    amount,
    status,
    priority: pick(priorities, seed + 14),
    createdAt,
    updatedAt: daysAgo(Math.max(0, daysBack - 1)),
    estimatedDeliveryTime: status !== "delivered" && status !== "cancelled" && status !== "failed"
      ? daysAgo(Math.max(0, daysBack - 2))
      : undefined,
    actualDeliveryTime: status === "delivered" ? daysAgo(Math.max(0, daysBack - 1)) : undefined,
    notes: seededRandom(seed + 15) > 0.7
      ? "Handle with care - fragile items"
      : seededRandom(seed + 15) > 0.4
        ? "Call customer on arrival"
        : undefined,
  };
});
