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
  squareUrl?: string;
}

export const SQUARE_SHOP_URL = "https://leavora-african-market.square.site";

export const CATEGORIES = [
  "Fresh Produce",
  "Spices & Seasonings",
  "Grains & Pounded Yam",
  "Prepared & Frozen",
  "Oils & Pantry",
  "Beverages & Specialty",
] as const;

export type Category = (typeof CATEGORIES)[number];

const PLACEHOLDER = "/images/shop-hero.jpg";

export const products: Product[] = [
  // Fresh Produce
  {
    id: "1",
    slug: "fresh-yam",
    name: "Fresh Yam",
    description: "Cut to size on request.",
    longDescription:
      "Fresh yam, cut to size on request — the staple that anchors countless West and Central African meals. Perfect for boiling, frying, or pounding.",
    price: 2.99,
    unit: "lb",
    image: "/images/products/yam.jpg",
    category: "Fresh Produce",
    tags: ["Produce", "Staple"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/fresh-yam/YUDCEEDKOFA7IX22CDHGEDWV",
  },
  {
    id: "2",
    slug: "okongobong",
    name: "Okongobong (August Leaves)",
    description: "Fresh, for traditional stews.",
    longDescription:
      "Fresh okongobong (August leaves) for traditional Cameroonian stews. A leafy green that brings the taste of home to the pot.",
    price: 4.99,
    unit: "pack",
    image: "/images/products/okongobong.jpg",
    category: "Fresh Produce",
    tags: ["Produce", "Cameroon"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/okongobong-august-leaves-/ULFO5ILOSUWTBFWUEM2WRYZZ",
  },
  {
    id: "3",
    slug: "african-plum",
    name: "African Plum",
    description: "Seasonal, sold by the pound.",
    longDescription:
      "Seasonal African plum (safou) — soft, buttery, and best roasted or boiled. Sold by the pound when in season.",
    price: 5.99,
    unit: "lb",
    image: "/images/products/african-plum.jpg",
    category: "Fresh Produce",
    tags: ["Produce", "Seasonal"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/african-plum/BZ4FSV7IOWXD7G44V22KAMOV",
  },
  {
    id: "4",
    slug: "boiled-corn",
    name: "Boiled Corn",
    description: "Ready to eat, sold fresh.",
    longDescription:
      "Fresh boiled corn, ready to eat — a simple market snack that tastes like childhood evenings.",
    price: 1.99,
    unit: "each",
    image: "/images/products/boiled-corn.jpg",
    category: "Fresh Produce",
    tags: ["Produce", "Ready to eat"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/boiled-corn/AEM5FYDD4UFNRNWKI633ZSZY",
  },
  {
    id: "5",
    slug: "country-onions",
    name: "Country Onions",
    description: "Sold by the pound.",
    longDescription:
      "Country onions (African shallots) sold by the pound — aromatic, sharp, and essential for authentic seasoning bases.",
    price: 2.99,
    unit: "lb",
    image: PLACEHOLDER,
    category: "Fresh Produce",
    tags: ["Produce", "Seasoning"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/country-onions/N7LGRXOYDDXCRAYAXKZ2UQFY",
  },

  // Spices & Seasonings
  {
    id: "6",
    slug: "njangsang",
    name: "Njangsang",
    description: "A soup-thickening staple, 100g pack.",
    longDescription:
      "Njangsang seeds — a Cameroonian soup thickener with a deep, nutty aroma. 100g pack.",
    price: 7.99,
    unit: "100g",
    image: "/images/products/njansang.jpg",
    category: "Spices & Seasonings",
    tags: ["Spice", "Cameroon"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/njangsang/L6YVK4GUJANLN6JGUHY7GWRN",
  },
  {
    id: "7",
    slug: "egusi-seeds",
    name: "Egusi Seeds",
    description: "For traditional egusi soup, 100g pack.",
    longDescription:
      "Ground melon seeds for rich, nutty egusi soup. 100g pack — the heart of a classic West African pot.",
    price: 8.99,
    unit: "100g",
    image: "/images/products/egusi.jpg",
    category: "Spices & Seasonings",
    tags: ["Spice", "Soup"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/egusi-seeds/42IJ74S3C22FWKAQRVZB2D26",
  },
  {
    id: "8",
    slug: "crayfish",
    name: "Crayfish",
    description: "A soup-thickening staple.",
    longDescription:
      "Dried crayfish — the umami backbone of soups and stews across West and Central Africa.",
    price: 7.99,
    unit: "pack",
    image: "/images/products/crayfish.jpg",
    category: "Spices & Seasonings",
    tags: ["Spice", "Seafood"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/crayfish/S72OXJXEGY5YYR3JHNMTFG3N",
  },
  {
    id: "9",
    slug: "mambo",
    name: "Mambo",
    description: "Seasoning cubes, the base of every pot.",
    longDescription:
      "Mambo seasoning cubes — a trusted base for stews, jollof, and everyday cooking.",
    price: 3.49,
    unit: "pack",
    image: "/images/products/mambo.jpg",
    category: "Spices & Seasonings",
    tags: ["Seasoning", "Pantry"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/mambo/LHUROA7DT3UQKSUNIEUPMO2A",
  },
  {
    id: "10",
    slug: "maggi",
    name: "Maggi",
    description: "Seasoning cubes, a pantry essential.",
    longDescription:
      "Classic Maggi seasoning cubes — the pantry essential found in kitchens across the continent.",
    price: 3.49,
    unit: "pack",
    image: PLACEHOLDER,
    category: "Spices & Seasonings",
    tags: ["Seasoning", "Pantry"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/maggi/MDKY7MPZWTNPMPWSDRNCMZVT",
  },
  {
    id: "11",
    slug: "maggi-crevette",
    name: "Maggi Crevette",
    description: "Shrimp-flavor seasoning cubes.",
    longDescription:
      "Maggi Crevette — shrimp-flavor seasoning cubes that deepen seafood stews and sauces.",
    price: 3.99,
    unit: "pack",
    image: "/images/products/maggi-crevette.jpg",
    category: "Spices & Seasonings",
    tags: ["Seasoning", "Seafood"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/maggi-crevette/RA7NPQULT57LNG6QHZ72GW46",
  },
  {
    id: "12",
    slug: "white-pepper",
    name: "White Pepper",
    description: "Ground, for a milder heat.",
    longDescription:
      "Ground white pepper — milder heat for soups, sauces, and spice blends.",
    price: 4.99,
    unit: "pack",
    image: "/images/products/white-pepper.jpg",
    category: "Spices & Seasonings",
    tags: ["Spice"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/white-pepper/I6AXLR7FOMROOIMBKLJZ764Q",
  },
  {
    id: "13",
    slug: "cameroon-dry-pepper",
    name: "Cameroon Dry Pepper",
    description: "Whole, sun-dried.",
    longDescription:
      "Whole sun-dried Cameroon pepper — fragrant heat for pepper soup, stews, and grilled meats.",
    price: 5.49,
    unit: "pack",
    image: PLACEHOLDER,
    category: "Spices & Seasonings",
    tags: ["Spice", "Cameroon", "Hot"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/cameroon-dry-pepper/ODEIXGMGIHZ54OCAZEQJDOXG",
  },
  {
    id: "14",
    slug: "suya-spice",
    name: "Suya Spice",
    description: "Peanut-forward grill seasoning.",
    longDescription:
      "Peanut-forward suya spice for grilled meat — the flavor of Nigerian street food at home.",
    price: 6.99,
    unit: "pack",
    image: PLACEHOLDER,
    category: "Spices & Seasonings",
    tags: ["Spice", "Grilling"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/suya-spice/KO434PBQUVTLMKNYORHK7GZR",
  },
  {
    id: "15",
    slug: "achu-spice",
    name: "Achu Spice",
    description: "For traditional yellow soup.",
    longDescription:
      "Achu spice blend for traditional yellow soup — earthy, aromatic, and distinctly Cameroonian.",
    price: 6.49,
    unit: "pack",
    image: PLACEHOLDER,
    category: "Spices & Seasonings",
    tags: ["Spice", "Cameroon"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/achu-spice/UBJV3SNG7DBJDHNQYAOX5BJ4",
  },
  {
    id: "16",
    slug: "pepper-soup-spice",
    name: "Pepper Soup Spice",
    description: "A house blend for pepper soup.",
    longDescription:
      "A house blend for pepper soup — warming spices for a restorative bowl.",
    price: 6.49,
    unit: "pack",
    image: PLACEHOLDER,
    category: "Spices & Seasonings",
    tags: ["Spice", "Soup"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/pepper-soup-spice/6QQCLUCRJ4JK5IH2XZ6SJGBH",
  },
  {
    id: "17",
    slug: "onga",
    name: "Onga",
    description: "Bouillon powder for stews & jollof.",
    longDescription:
      "Onga bouillon powder — a quick flavor boost for stews, jollof, and everyday cooking.",
    price: 3.99,
    unit: "pack",
    image: "/images/products/onga.jpg",
    category: "Spices & Seasonings",
    tags: ["Seasoning", "Pantry"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/onga/WHV2DAICOZP723MC5UQVCDM5",
  },
  {
    id: "18",
    slug: "soya-spice",
    name: "Soya Spice",
    description: "Rich in minerals.",
    longDescription:
      "Soya spice — mineral-rich seasoning for soups and stews.",
    price: 5.99,
    unit: "pack",
    image: "/images/products/soya-spice.jpg",
    category: "Spices & Seasonings",
    tags: ["Spice"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/soya-spice/QA6P572HGIINY7TFQABLMY3I",
  },

  // Grains & Pounded Yam
  {
    id: "19",
    slug: "ola-ola-pounded-yam-10lb",
    name: "Ola Ola Pounded Yam 10 lb",
    description: "Smooth, ready in minutes.",
    longDescription:
      "Ola Ola pounded yam flour, 10 lb — smooth, stretchy swallow ready in minutes with hot water.",
    price: 14.99,
    unit: "10 lb",
    image: "/images/products/pounded-yam-10lb.jpg",
    category: "Grains & Pounded Yam",
    tags: ["Staple", "Swallow"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/ola-ola-pounded-yam-10-lb/ZOBCVZOCDAMVMA7O7FLR2YVJ",
  },
  {
    id: "20",
    slug: "ola-ola-pounded-yam-18-5lb",
    name: "Ola Ola Pounded Yam 18.5 lb",
    description: "Family size.",
    longDescription:
      "Ola Ola pounded yam flour, family size 18.5 lb — enough for big pots and gatherings.",
    price: 24.99,
    unit: "18.5 lb",
    image: "/images/products/pounded-yam-18-5lb.jpg",
    category: "Grains & Pounded Yam",
    tags: ["Staple", "Swallow", "Family size"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/ola-ola-pounded-yam-18-5-lb/WFEQ3MZX2BO7LGJG6QPMKDXW",
  },
  {
    id: "21",
    slug: "plantain-fufu",
    name: "Mama's Choice Plantain Fufu",
    description: "Enriched, contains real plantain.",
    longDescription:
      "Mama's Choice plantain fufu mix — enriched and made with real plantain for a smooth swallow.",
    price: 7.49,
    unit: "pack",
    image: "/images/products/plantain-fufu.jpg",
    category: "Grains & Pounded Yam",
    tags: ["Staple", "Swallow"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/mama-s-choice-plantain-fufu/4F5HBGEI3YYGFQ6OKDQMF5UC",
  },
  {
    id: "22",
    slug: "yellow-garri",
    name: "Yellow Garri",
    description: "Cassava flakes, roasted with palm oil.",
    longDescription:
      "Yellow garri — cassava flakes roasted with palm oil. Soak for eba or snack dry.",
    price: 6.99,
    unit: "pack",
    image: "/images/products/yellow-garri.jpg",
    category: "Grains & Pounded Yam",
    tags: ["Staple", "Cassava"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/yellow-garri/W2HJASQDJ6EADEIIJKYFP4D4",
  },
  {
    id: "23",
    slug: "white-garri",
    name: "White Garri",
    description: "Cassava flakes, unroasted style.",
    longDescription:
      "White garri — unroasted-style cassava flakes for eba, soaking, or snacks.",
    price: 6.99,
    unit: "pack",
    image: "/images/products/white-garri.jpg",
    category: "Grains & Pounded Yam",
    tags: ["Staple", "Cassava"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/white-garri/N6HIIKU2QYKR7EWKQ2WC5FV3",
  },
  {
    id: "24",
    slug: "bobolo",
    name: "Bobolo",
    description: "Fermented cassava stick.",
    longDescription:
      "Bobolo — fermented cassava stick, a Central African staple steamed and served with soups and stews.",
    price: 4.99,
    unit: "pack",
    image: "/images/products/bobolo.jpg",
    category: "Grains & Pounded Yam",
    tags: ["Staple", "Cassava", "Cameroon"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/bobolo/LLIGLQDLXLGJKY3F2QPFUW3G",
  },
  {
    id: "25",
    slug: "miondo",
    name: "Miondo",
    description: "Fermented cassava stick.",
    longDescription:
      "Miondo — fermented cassava sticks wrapped and ready to steam for a classic side.",
    price: 4.99,
    unit: "pack",
    image: "/images/products/miondo.jpg",
    category: "Grains & Pounded Yam",
    tags: ["Staple", "Cassava", "Cameroon"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/miondo/RUBADZA5M5A6PG67SKGCNFZY",
  },
  {
    id: "26",
    slug: "peeled-beans-4lb",
    name: "Peeled Beans 4 lb",
    description: "For akara and moin moin.",
    longDescription:
      "Peeled black-eyed beans, 4 lb — ready for akara, moin moin, and bean porridge.",
    price: 7.99,
    unit: "4 lb",
    image: "/images/products/peeled-beans-4lb.jpg",
    category: "Grains & Pounded Yam",
    tags: ["Staple", "Beans"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/peeled-beans-4-lb/JBNTKXRQ3GDPC7MKIECBWTE5",
  },
  {
    id: "27",
    slug: "peeled-beans-10lb",
    name: "Peeled Beans 10 lb",
    description: "For akara and moin moin.",
    longDescription:
      "Peeled black-eyed beans, 10 lb family bag — for akara, moin moin, and bean dishes.",
    price: 16.99,
    unit: "10 lb",
    image: "/images/products/peeled-beans-10lb.jpg",
    category: "Grains & Pounded Yam",
    tags: ["Staple", "Beans", "Family size"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/peeled-beans-10-lb/MECS66CQPORVZ3QLG6HRW4CY",
  },
  {
    id: "28",
    slug: "peeled-peanuts",
    name: "Peeled Peanuts",
    description: "Raw, sold by the pound.",
    longDescription:
      "Raw peeled peanuts sold by the pound — for groundnut soup, snacks, and spice blends.",
    price: 4.49,
    unit: "lb",
    image: "/images/products/peeled-peanuts.jpg",
    category: "Grains & Pounded Yam",
    tags: ["Staple", "Nuts"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/peeled-peanuts/6NITHIPPYVBREEZWGLQ33DG4",
  },

  // Prepared & Frozen
  {
    id: "29",
    slug: "frozen-bitter-leaves",
    name: "Frozen Bitter Leaves",
    description: "Washed, chopped, frozen.",
    longDescription:
      "Frozen bitter leaves — washed, chopped, and ready for ndolé and other leafy stews.",
    price: 5.99,
    unit: "pack",
    image: "/images/products/bitter-leaves.jpg",
    category: "Prepared & Frozen",
    tags: ["Frozen", "Greens"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/frozen-bitter-leaves/Y6SW5DXGZVB5RDV4QLOXJFDN",
  },
  {
    id: "30",
    slug: "dry-sweet-bitterleaf",
    name: "Dry Sweet Bitterleaf",
    description: "Dried, ready to rehydrate.",
    longDescription:
      "Dry sweet bitterleaf — dried and ready to rehydrate for soups and stews.",
    price: 5.49,
    unit: "pack",
    image: PLACEHOLDER,
    category: "Prepared & Frozen",
    tags: ["Dried", "Greens"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/dry-sweet-bitterleaf/SZNKOD6IMHBPD6X57QV6HVOB",
  },
  {
    id: "31",
    slug: "eru",
    name: "Eru",
    description: "Dried and shredded, 100g pack.",
    longDescription:
      "Dried shredded eru (okazi), 100g pack — the leafy base of Cameroon's famous eru stew.",
    price: 5.99,
    unit: "100g",
    image: "/images/products/eru.jpg",
    category: "Prepared & Frozen",
    tags: ["Dried", "Greens", "Cameroon"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/eru/QL6P2FK2INWX5PFJUF2UO2LA",
  },
  {
    id: "32",
    slug: "bony-dry-fish",
    name: "Bony Dry Fish",
    description: "For soups and stews.",
    longDescription:
      "Bony dry fish for soups and stews — smoky depth that defines a home-cooked pot.",
    price: 12.99,
    unit: "pack",
    image: PLACEHOLDER,
    category: "Prepared & Frozen",
    tags: ["Dried", "Seafood"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/bony-dry-fish/5OCYMWIHDCHLMGWFPOSH4FY6",
  },
  {
    id: "33",
    slug: "smoked-kuta-dry-fish",
    name: "Smoked Kuta Dry Fish",
    description: "Smoked, whole.",
    longDescription:
      "Smoked kuta dry fish, whole — intense smoke for pepper soup and traditional stews.",
    price: 14.99,
    unit: "each",
    image: PLACEHOLDER,
    category: "Prepared & Frozen",
    tags: ["Smoked", "Seafood"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/smoked-kuta-dry-fish/G3Y2RNVOOC33G6EVKDKRSKEY",
  },
  {
    id: "34",
    slug: "snails",
    name: "Snails",
    description: "100% natural, rich in protein.",
    longDescription:
      "Natural snails, rich in protein — a delicacy for pepper soup, stews, and special occasions.",
    price: 9.99,
    unit: "pack",
    image: "/images/products/snails.jpg",
    category: "Prepared & Frozen",
    tags: ["Protein"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/snails/IA6KILD6NICAI2XUPXZCT6IV",
  },
  {
    id: "35",
    slug: "panla-dry-fish",
    name: "Panla Dry Fish",
    description: "For soups and stews.",
    longDescription:
      "Panla dry fish for soups and stews — a West African stockfish favorite.",
    price: 13.99,
    unit: "pack",
    image: PLACEHOLDER,
    category: "Prepared & Frozen",
    tags: ["Dried", "Seafood"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/panla-dry-fish/YOQEHMZ6V4AGERADXYDTDPJE",
  },
  {
    id: "36",
    slug: "panla-fresh-fish",
    name: "Panla Fresh Fish",
    description: "Whole, cleaned to order.",
    longDescription:
      "Fresh panla, whole and cleaned to order — sold by the pound.",
    price: 9.99,
    unit: "lb",
    image: PLACEHOLDER,
    category: "Prepared & Frozen",
    tags: ["Fresh", "Seafood"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/panla-fresh-fish/ZQC6MYD4ZPGBHT3ZIUL3FTBK",
  },
  {
    id: "37",
    slug: "titus",
    name: "Titus",
    description: "Whole, cleaned to order.",
    longDescription:
      "Fresh titus (mackerel-style), whole and cleaned to order — sold by the pound.",
    price: 10.99,
    unit: "lb",
    image: PLACEHOLDER,
    category: "Prepared & Frozen",
    tags: ["Fresh", "Seafood"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/titus/OM5BHPOJAVK7U5CO7YZCDSKQ",
  },
  {
    id: "38",
    slug: "mackerel-fresh-fish",
    name: "Mackerel Fresh Fish",
    description: "Whole, cleaned to order.",
    longDescription:
      "Fresh mackerel, whole and cleaned to order — sold by the pound for grilling or stewing.",
    price: 9.99,
    unit: "lb",
    image: "/images/products/mackerel.jpg",
    category: "Prepared & Frozen",
    tags: ["Fresh", "Seafood"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/mackerel-fresh-fish/QEQVTOOPZ7PVBVGB53QXA7AT",
  },
  {
    id: "39",
    slug: "smoked-mackerel-fish",
    name: "Smoked Mackerel Fish",
    description: "Smoked, whole.",
    longDescription:
      "Smoked mackerel, whole — ready for stews, sauces, and rice dishes.",
    price: 13.99,
    unit: "each",
    image: PLACEHOLDER,
    category: "Prepared & Frozen",
    tags: ["Smoked", "Seafood"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/smoked-mackerel-fish/7AXQJXXOZSHH2USRFS3XHECT",
  },
  {
    id: "40",
    slug: "cow-skin",
    name: "Cow Skin",
    description: "For soups and stews.",
    longDescription:
      "Cow skin (ponmo) for soups and stews — sold by the pound.",
    price: 8.99,
    unit: "lb",
    image: PLACEHOLDER,
    category: "Prepared & Frozen",
    tags: ["Protein"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/cow-skin/DZGY2TTTMGGC2TK5MAPBYWZ2",
  },

  // Oils & Pantry
  {
    id: "41",
    slug: "carotino-cooking-oil-3-3l",
    name: "Carotino Cooking Oil 3.3L",
    description: "Palm & canola blend.",
    longDescription:
      "Carotino cooking oil 3.3L — palm and canola blend for everyday frying and cooking.",
    price: 18.99,
    unit: "3.3L",
    image: "/images/products/carotino-oil.jpg",
    category: "Oils & Pantry",
    tags: ["Oil", "Pantry"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/carotino-cooking-oil/QZJIZQYDGAXF4LVFWAAQL4KY",
  },
  {
    id: "42",
    slug: "carotino-cooking-oil-5-5l",
    name: "Carotino Cooking Oil 5.5L",
    description: "Family size.",
    longDescription:
      "Carotino cooking oil 5.5L family size — palm and canola blend for busy kitchens.",
    price: 29.99,
    unit: "5.5L",
    image: "/images/products/carotino-oil.jpg",
    category: "Oils & Pantry",
    tags: ["Oil", "Pantry", "Family size"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/carotino-cooking-oil/QZJIZQYDGAXF4LVFWAAQL4KY",
  },
  {
    id: "43",
    slug: "praise-palm-oil-1l",
    name: "Praise Palm Oil 1L",
    description: "Rich, red, unrefined.",
    longDescription:
      "Praise palm oil 1L — rich, red, unrefined oil for stews, sauces, and traditional dishes.",
    price: 8.99,
    unit: "1L",
    image: "/images/products/praise-palm-oil.jpg",
    category: "Oils & Pantry",
    tags: ["Oil", "Palm"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/praise-palm-oil-1l/DEZ2EXKLISLU2NZVIXQVK6SS",
  },
  {
    id: "44",
    slug: "praise-palm-oil-2l",
    name: "Praise Palm Oil 2L",
    description: "Rich, red, unrefined.",
    longDescription:
      "Praise palm oil 2L — rich, red, unrefined oil in a larger bottle.",
    price: 15.99,
    unit: "2L",
    image: "/images/products/praise-palm-oil.jpg",
    category: "Oils & Pantry",
    tags: ["Oil", "Palm"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/praise-palm-oil-2l/7JV3LL2QGEBFED6QLNJCF3TQ",
  },
  {
    id: "45",
    slug: "palm-soup-base",
    name: "Palm Soup Base",
    description: "Nkulenu's, Ghana's original.",
    longDescription:
      "Nkulenu's palm soup base — Ghana's original shortcut to authentic palm nut soup.",
    price: 4.99,
    unit: "can",
    image: "/images/products/palm-soup-base.jpg",
    category: "Oils & Pantry",
    tags: ["Pantry", "Soup", "Ghana"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/palm-soup-base/WG2WFPFJOYH53OJZZLIKBBWM",
  },
  {
    id: "46",
    slug: "cerelac",
    name: "Cerelac",
    description: "Infant cereal, multiple stages.",
    longDescription:
      "Cerelac infant cereal — multiple stages stocked for growing little ones.",
    price: 9.99,
    unit: "box",
    image: "/images/products/cerelac.jpg",
    category: "Oils & Pantry",
    tags: ["Pantry", "Baby"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/cerelac/NCSLHSW5NAQG3GDUWL5XQHAR",
  },
  {
    id: "47",
    slug: "banga-palm-oil",
    name: "Banga Palm Oil",
    description: "Rich, red, unrefined.",
    longDescription:
      "Banga palm oil — rich, red, unrefined oil for banga soup and everyday cooking.",
    price: 9.99,
    unit: "bottle",
    image: "/images/products/banga-palm-oil.jpg",
    category: "Oils & Pantry",
    tags: ["Oil", "Palm"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/banga-palm-oil/NOFF54TGUCJ6CL4XYOUMFAEM",
  },
  {
    id: "48",
    slug: "ola-ola-carotino-red-palm-6-6l",
    name: "Ola Ola Carotino Red Palm Oil 6.6L",
    description: "Family size, unrefined red palm.",
    longDescription:
      "Ola Ola Carotino red palm oil 6.6L — family-size unrefined red palm for serious cooking.",
    price: 32.99,
    unit: "6.6L",
    image: "/images/products/carotino-red-palm.jpg",
    category: "Oils & Pantry",
    tags: ["Oil", "Palm", "Family size"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/ola-ola-carotino-red-palm-oil-6-6l/Q4GX53MO23BRN6OPQ4ZBL6HR",
  },
  {
    id: "49",
    slug: "de-rica",
    name: "De Rica",
    description: "Tomato & pepper cooking mix.",
    longDescription:
      "De Rica tomato and pepper cooking mix — a shortcut base for stews and jollof.",
    price: 4.49,
    unit: "can",
    image: PLACEHOLDER,
    category: "Oils & Pantry",
    tags: ["Pantry", "Tomato"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/de-rica/HRLNPJGP77OGXIDOE4ZMRES4",
  },

  // Beverages & Specialty
  {
    id: "50",
    slug: "malta",
    name: "Malta",
    description: "Non-alcoholic, chilled.",
    longDescription:
      "Malta Guinness — non-alcoholic malt drink, chilled and ready.",
    price: 2.49,
    unit: "bottle",
    image: "/images/products/malta.jpg",
    category: "Beverages & Specialty",
    tags: ["Drink", "Malt"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/malta/RATBRZ2SMW6CQ3IJOF7GNCYA",
  },
  {
    id: "51",
    slug: "ovaltine",
    name: "Ovaltine",
    description: "Malty, creamy hot drink mix.",
    longDescription:
      "Ovaltine malted drink mix — malty, creamy comfort in a cup.",
    price: 6.99,
    unit: "tin",
    image: "/images/products/ovaltine.jpg",
    category: "Beverages & Specialty",
    tags: ["Drink", "Pantry"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/ovaltine/XHGAWUR6JKSTRLWQYCDB6Y2J",
  },
  {
    id: "52",
    slug: "peak-milk-powder",
    name: "Peak Milk Powder",
    description: "Instant whole milk, rich & creamy.",
    longDescription:
      "Peak instant whole milk powder — rich and creamy for tea, cereal, and cooking.",
    price: 5.99,
    unit: "tin",
    image: "/images/products/peak-milk.jpg",
    category: "Beverages & Specialty",
    tags: ["Dairy", "Pantry"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/peak-milk-powder/NCP7CFY7FKTE7TZO2BN4AI2T",
  },
  {
    id: "53",
    slug: "nido",
    name: "Nido",
    description: "Full cream milk powder.",
    longDescription:
      "Nido full cream milk powder — a diaspora pantry staple.",
    price: 6.49,
    unit: "tin",
    image: "/images/products/nido.jpg",
    category: "Beverages & Specialty",
    tags: ["Dairy", "Pantry"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/nido/R2IWJBXLKTGM6AQ7LZDNBBR3",
  },
  {
    id: "54",
    slug: "tartina-chocolate-spread",
    name: "Tartina Chocolate Spread",
    description: "Unique chocolate hazelnut taste.",
    longDescription:
      "Tartina chocolate hazelnut spread — a sweet specialty from the market shelves.",
    price: 4.99,
    unit: "jar",
    image: "/images/products/tartina.jpg",
    category: "Beverages & Specialty",
    tags: ["Sweet", "Spread"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/tartina-chocolate-spread/XZUH3RHHHQCOSA4F4MIGI6EC",
  },
  {
    id: "55",
    slug: "vita-malt-classic",
    name: "Vita Malt Classic",
    description: "Non-alcoholic, chilled.",
    longDescription:
      "Vita Malt Classic — non-alcoholic malt drink, chilled and ready.",
    price: 2.49,
    unit: "bottle",
    image: "/images/products/vita-malt.jpg",
    category: "Beverages & Specialty",
    tags: ["Drink", "Malt"],
    inStock: true,
    squareUrl:
      "https://leavora-african-market.square.site/product/vita-malt-classic/HOOOCTPYZ2YNXLJYGY5L5EO5",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getAllCategories(): string[] {
  return [...CATEGORIES];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
