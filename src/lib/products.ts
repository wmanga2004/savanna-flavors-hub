export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  tags: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "jollof-rice-kit",
    name: "Jollof Rice Kit",
    description: "Everything you need to make authentic smoky party jollof rice at home.",
    longDescription:
      "Our Jollof Rice Kit includes premium long-grain parboiled rice, tomato paste, onions, Scotch bonnet peppers, and our signature spice blend. Jollof rice is a beloved West African one-pot dish known for its rich tomato base, smoky aroma, and festive flavor. Serves 4-6 people.",
    price: 24.99,
    unit: "kit",
    image: "/images/jollof-rice.jpg",
    category: "Meal Kits",
    tags: ["West African", "Rice", "Spicy"],
    inStock: true,
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: "2",
    slug: "egusi-soup-bundle",
    name: "Egusi Soup Bundle",
    description: "Ground melon seeds, dried fish, and palm oil for a hearty Nigerian egusi soup.",
    longDescription:
      "Egusi soup is a rich, nutty Nigerian classic made with ground melon seeds, leafy greens, and bold seasonings. This bundle includes ground egusi, dried stockfish, crayfish, palm oil, and iru (fermented locust beans) to recreate the authentic taste.",
    price: 32.5,
    unit: "bundle",
    image: "/images/egusi-soup.jpg",
    category: "Soup Bases",
    tags: ["Nigerian", "Soup", "Protein-rich"],
    inStock: true,
    rating: 4.8,
    reviewCount: 96,
  },
  {
    id: "3",
    slug: "pounded-yam-flour",
    name: "Pounded Yam Flour",
    description: "Smooth, stretchy pounded yam flour — just add hot water and stir.",
    longDescription:
      "Enjoy the comfort of pounded yam without the mortar and pestle. Our premium yam flour is finely processed to give you the smooth, elastic texture that pairs perfectly with egusi, efo riro, ogbono, and other West African soups.",
    price: 12.99,
    unit: "2 lb bag",
    image: "/images/pounded-yam.jpg",
    category: "Staples",
    tags: ["Staple", "Gluten-free", "Quick prep"],
    inStock: true,
    rating: 4.7,
    reviewCount: 84,
  },
  {
    id: "4",
    slug: "suya-spice-marinade",
    name: "Suya Spice & Marinade",
    description: "The classic West African peanut and chili spice rub for grilled meat.",
    longDescription:
      "Suya is Nigeria's famous street food — skewered meat grilled over open flames and coated in a fragrant peanut-chili spice mix. Our kit includes ground peanuts, ginger, garlic, cayenne, and kulikuli for an authentic suya experience. Perfect for beef, chicken, or lamb.",
    price: 14.99,
    unit: "kit",
    image: "/images/suya.jpg",
    category: "Spices",
    tags: ["Nigerian", "Grilling", "Spicy"],
    inStock: true,
    rating: 4.9,
    reviewCount: 112,
  },
  {
    id: "5",
    slug: "sweet-plantains",
    name: "Ripe Sweet Plantains",
    description: "Perfectly ripened plantains ready to fry, bake, or grill.",
    longDescription:
      "Sweet, caramelized plantains are a staple side dish across Africa and the Caribbean. Our plantains are carefully selected at peak ripeness so you can make dodo, plantain chips, or simply pan-fry them to golden perfection.",
    price: 8.99,
    unit: "3 lb box",
    image: "/images/plantains.jpg",
    category: "Produce",
    tags: ["Produce", "Sweet", "Versatile"],
    inStock: true,
    rating: 4.6,
    reviewCount: 67,
  },
  {
    id: "6",
    slug: "chin-chin",
    name: "Crunchy Chin Chin",
    description: "Golden, crispy Nigerian snack made with flour, sugar, and nutmeg.",
    longDescription:
      "Chin chin is a beloved crunchy snack served at celebrations across West Africa. Our recipe uses flour, sugar, butter, milk, and a hint of nutmeg, then fries each batch to a satisfying golden crunch. Great for sharing — or not.",
    price: 9.5,
    unit: "12 oz bag",
    image: "/images/chin-chin.jpg",
    category: "Snacks",
    tags: ["Snack", "Sweet", "Crunchy"],
    inStock: true,
    rating: 4.8,
    reviewCount: 54,
  },
  {
    id: "7",
    slug: "puff-puff-mix",
    name: "Puff Puff Mix",
    description: "Sweet fried dough balls — just add water, proof, and fry.",
    longDescription:
      "Puff puff is West Africa's answer to doughnuts: soft, sweet, and irresistibly fluffy. Our mix combines flour, yeast, sugar, and nutmeg so you can make fresh puff puff at home in minutes. Perfect for parties, breakfast, or an anytime treat.",
    price: 7.99,
    unit: "1 lb mix",
    image: "/images/puff-puff.jpg",
    category: "Baking",
    tags: ["Dessert", "Fried", "Sweet"],
    inStock: true,
    rating: 4.7,
    reviewCount: 43,
  },
  {
    id: "8",
    slug: "akara-mix",
    name: "Akara (Bean Fritter) Mix",
    description: "Black-eyed pea fritter mix for a savory breakfast or snack.",
    longDescription:
      "Akara are crispy, golden fritters made from blended black-eyed peas, onions, and peppers. Our ready-to-fry mix saves you the soaking and peeling time while delivering the same fluffy interior and crispy exterior that makes akara a favorite across West Africa.",
    price: 10.99,
    unit: "1.5 lb mix",
    image: "/images/akara.jpg",
    category: "Breakfast",
    tags: ["Savory", "Protein-rich", "Breakfast"],
    inStock: true,
    rating: 4.5,
    reviewCount: 38,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category)));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
