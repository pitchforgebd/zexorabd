import { FlaskConical, Cog, Zap, Shirt, Printer, ShoppingBag } from 'lucide-react';

export const divisions = [
  {
    id: "chemicals",
    name: "Zexora Industrial Chemicals & Ink Solutions",
    tagline:
      "High-Performance Chemicals for Printing, Packaging & Industrial Manufacturing",
    path: "/divisions/chemicals",
    icon: FlaskConical,
  },
  {
    id: "equipment",
    name: "Zexora Industrial Machinery & Equipment Solutions",
    tagline: "Heavy Machinery & Industrial Equipment for Modern Industries",
    path: "/divisions/equipment",
    icon: Cog,
  },
  {
    id: "power",
    name: "Zexora Power Solutions",
    tagline: "Reliable Power Backup, Solar & Electrical Infrastructure Systems",
    path: "/divisions/power",
    icon: Zap,
  },
  {
    id: "apparel",
    name: "Zexora Apparel & Garments",
    tagline: "Garment Accessories, Trims & Apparel Sourcing",
    path: "/divisions/apparel",
    icon: Shirt,
  },
  {
    id: "printpack",
    name: "Zexora Print & Pack Solutions",
    tagline: "Professional Commercial Printing & Packaging Services",
    path: "/divisions/printpack",
    icon: Printer,
  },
  {
    id: "fashion",
    name: "Zexora Fashion & Lifestyle",
    tagline: "Premium Fashion, Curated Collections & Lifestyle Products",
    path: "/divisions/fashion",
    icon: ShoppingBag,
  },
];

export type SubCategory = {
  subName?: string;
  description?: string;
  items: string[];
};

export type DivisionContent = {
  id: string;
  name: string;
  industry?: string;
  tagline: string;
  overview: string;
  products: { category: string; description?: string; subcategories: SubCategory[] }[];
  industries: string[];
  reasons: string[];
  commitment?: string[];
  strengths?: string[];
  markets?: string[];
  philosophy?: { intro: string; beliefs: string[]; closing: string };
  brandPositioning?: string;
};

export const divisionData: Record<string, DivisionContent> = {
  // ─────────────────────────────────────────────
  // 1. CHEMICALS & INK SOLUTIONS
  // ─────────────────────────────────────────────
  chemicals: {
    id: "chemicals",
    name: "Zexora Industrial Chemicals & Ink Solutions",
    industry:
      "Printing & Packaging Solutions, Industrial Chemicals & Specialty Materials",
    tagline:
      "High-Performance Chemicals for Printing, Packaging & Industrial Manufacturing",
    overview:
      "Zexora Industrial Chemicals & Ink Solutions is a trusted supplier of high-performance industrial chemicals, printing inks, and specialty raw materials for modern manufacturing industries. We are committed to quality consistency, reliable sourcing, expert technical support, and building long-term industrial partnerships across Bangladesh and beyond.",
    products: [
      {
        category: "Printing & Packaging",
        description:
          "High-performance chemicals, inks, Thermal Plate, Blanket, Papers, Spare Parts and process solutions for offset printing, flexible packaging, carton production, label printing, and industrial packaging applications.",
        subcategories: [
          {
            subName: "Offset Printing Chemicals",
            items: [
              "Fountain Solution Concentrate",
              "IPA Substitute",
              "Alcohol Replacement Solution",
              "Plate Cleaner",
              "Plate Gum",
              "CTP Plate Chemicals",
              "Dampening Additives",
              "pH Stabilizer",
              "Special Chemicals",
            ],
          },
          {
            subName: "Pressroom Chemicals & Wash Solutions",
            items: [
              "Blanket Wash",
              "Roller Wash",
              "UV Wash",
              "Ink Remover",
              "Calcium Remover",
              "De-glazer",
            ],
          },
          {
            subName: "Industrial Printing Inks",
            items: [
              "Offset Sheet-fed Inks",
              "Web Offset Inks — for Newspaper & Publications",
              "Pantone Colour",
              "UV / LED Offset Inks",
              "Flexographic Inks",
              "Screen Printing Inks",
              "DTF Printing Inks",
              "Sublimation Inks",
              "Specialty Inks",
            ],
          },
          {
            subName: "Offset Printing Rubber Blanket",
            items: [
              "Sheetfed Blanket",
              "UV Offset Blanket",
              "Web Offset Blanket",
              "Photo Polymer Flexo Blanket",
              "Under Packing Paper",
            ],
          },
          {
            subName: "Paper Solutions",
            items: [
              "Duplex Board",
              "Art Paper",
              "Thermal Paper",
              "Sublimation Paper",
              "Folding Box Board",
              "Kraft Liner Paper",
              "Virgin Kraft Paper",
              "Sticker Paper",
              "Offset Paper",
            ],
          },
          {
            subName: "Packaging & Flexible Packaging Chemicals",
            items: [
              "Lamination Adhesive",
              "Water-Based Varnish",
              "UV Coating Chemicals",
            ],
          },
        ],
      },
      {
        category: "Textile Chemicals",
        description:
          "Specialized textile processing chemicals designed for dyeing, washing, finishing, and garment wet processing industries.",
        subcategories: [
          {
            subName: "Textile Processing Chemicals",
            items: [
              "Silicone Softener",
              "Textile Enzyme",
              "Wetting Agent",
              "Sequestering Agent",
              "Anti-Creasing Agent",
              "Dye Fixing Agent",
              "Levelling Agent",
              "Scouring Agent",
              "Desizing Enzyme",
            ],
          },
          {
            subName: "Textile Utility Chemicals",
            items: [
              "Hydrogen Peroxide",
              "Acetic Acid",
              "Caustic Soda",
              "Soda Ash",
              "Peroxide Stabilizer",
            ],
          },
        ],
      },
      {
        category: "Industrial Solvents-Fine Chemicals",
        description:
          "Industrial-grade solvents for printing, coating, adhesives, pharmaceutical, textile, and cleaning industries.",
        subcategories: [
          {
            items: [
              "Ethyl Acetate",
              "IPA (Isopropyl Alcohol)",
              "MEK (Methyl Ethyl Ketone)",
              "Toluene",
              "Xylene",
              "Butyl Acetate",
              "Acetone",
              "Methanol",
              "Ethanol",
            ],
          },
        ],
      },
      {
        category: "Pharmaceutical Raw Materials",
        description:
          "Reliable pharmaceutical excipients and industrial-grade chemical materials for pharmaceutical manufacturing industries.",
        subcategories: [
          {
            items: [
              "Microcrystalline Cellulose (MCC)",
              "Magnesium Stearate",
              "Lactose Monohydrate",
              "PVP K30",
              "IPA Pharma Grade",
              "Titanium Dioxide",
              "Pharmaceutical Solvents",
            ],
          },
        ],
      },
      {
        category: "Adhesive & Lamination Chemicals",
        description:
          "Advanced adhesive technologies for packaging, carton, lamination, labelling, and industrial bonding applications.",
        subcategories: [
          {
            items: [
              "Hot Melt Adhesive",
              "PU Adhesive",
              "Lamination Adhesive",
              "Water-Based Adhesive",
              "Pressure Sensitive Adhesive",
              "Book Binding Glue",
              "Carton Adhesive",
            ],
          },
        ],
      },
      {
        category: "Plastic & Polymer Chemicals",
        description:
          "Industrial polymer and plastic raw materials for packaging, plastic processing, pipe manufacturing, and industrial applications.",
        subcategories: [
          {
            items: [
              "PVC Resin",
              "DOP Plasticizer",
              "DOTP Plasticizer",
              "Titanium Dioxide (TiO₂)",
              "Masterbatch Additives",
              "Polymer Processing Additives",
            ],
          },
        ],
      },
    ],
    industries: [
      "Printing & Packaging Industry",
      "Textile & Garments Industry",
      "Pharmaceutical & Healthcare Manufacturing",
      "Plastic & Polymer Processing",
      "Adhesive & Lamination Industry",
    ],
    reasons: [
      "Consistent product quality across all supply cycles",
      "Reliable and verified global sourcing network",
      "Dedicated technical support and product consultation",
      "Competitive and sustainable pricing",
      "Long-term industrial partnership approach",
    ],
    commitment: [
      "Consistent product quality across all supply cycles",
      "Reliable and verified global sourcing network",
      "Dedicated technical support and product consultation",
      "Competitive and sustainable pricing",
      "Long-term industrial partnership approach",
    ],
  },

  // ─────────────────────────────────────────────
  // 2. INDUSTRIAL EQUIPMENT SOLUTIONS
  // ─────────────────────────────────────────────
  equipment: {
    id: "equipment",
    name: "Zexora Industrial Machinery & Equipment Solutions",
    industry: "Heavy Machinery, Industrial Equipment & Printing and Packaging",
    tagline: "Heavy Machinery & Industrial Equipment for Modern Industries",
    overview:
      "Zexora Industrial Equipment Solutions is a dynamic industrial machinery supplier committed to powering progress across construction, manufacturing, and service industries. We deliver robust, performance-driven equipment solutions designed to enhance productivity, reliability, and operational efficiency. With a clear focus on industrial performance and long-term value, we support businesses with dependable machinery, technical insight, and responsive service. Our approach combines quality sourcing, practical engineering solutions, and strong after-sales support — ensuring our clients operate with confidence and continuity.",
    products: [
      {
        category: "Industrial Machineries",
        description:
          "We supply a comprehensive range of heavy industrial equipment, Printing and Packaging and workshop machinery tailored to meet the operational demands of modern industries. Every product we supply is selected with emphasis on durability, efficiency, and performance consistency.",
        subcategories: [
          {
            items: [
              "Screw & Piston Air Compressors",
              "Industrial Air Dryers",
              "Power Generators",
              "Welding Machines",
              "Wheel Balancers",
              "Pressure Machines",
              "Motorcycle Lifts",
              "Four Post Lifts",
              "Forklifts & Material Handling Equipment",
              "Pumps (All Types)",
              "Construction Machinery & Equipment",
              "Water & Submersible Pumps",
              "Tyre Changers & Automotive Workshop Machinery",
              "Industrial Spare Parts & Maintenance Components",
            ],
          },
        ],
      },
      {
        category: "Printing & Packaging Machineries",
        description:
          "Complete range of printing and packaging machinery for modern production facilities, from pre-press to finishing.",
        subcategories: [
          {
            items: [
              "Offset Printing Machine",
              "CTP Machine",
              "Paper Cutter Machine",
              "Die Cutting Machine",
              "Folder Gluer Machine",
              "Lamination Machine",
              "Flute Laminator Machine",
              "Paper Bag Making Machine",
              "Rigid Box Machine",
              "DTF Printing Machine",
              "Sublimation Printing Machine",
              "Flexo Printing Machine",
              "Digital Printing Machine",
            ],
          },
        ],
      },
    ],
    industries: [
      "Manufacturing & Processing Plants",
      "Construction & Infrastructure Companies",
      "Automotive Workshops & Service Centers",
      "Industrial Service & Maintenance Providers",
      "Printing & Packaging Industry",
    ],
    reasons: [
      "Quality-assured equipment from verified suppliers",
      "Competitive and sustainable pricing",
      "Professional technical support and consultation",
      "Efficient supply and after-sales service coordination",
      "Reliable long-term industrial partnership",
    ],
    commitment: [
      "At Zexora Industrial Equipment Solutions, we believe industrial growth depends on reliable infrastructure and high-performance machinery. Our mission is to become a trusted long-term partner — delivering quality, performance, and value to every client we serve.",
    ],
  },

  // ─────────────────────────────────────────────
  // 3. POWER SOLUTIONS
  // ─────────────────────────────────────────────
  power: {
    id: "power",
    name: "Zexora Power Solutions",
    industry: "Power Backup, Electrical Infrastructure & Energy Systems",
    tagline: "Reliable Power Backup, Solar & Electrical Infrastructure Systems",
    overview:
      "Zexora Power Solutions delivers dependable power backup, energy systems, and electrical infrastructure solutions designed to ensure uninterrupted operations across industrial, commercial, and IT environments. We focus on stability, safety, and long-term performance — minimizing downtime and maximizing operational efficiency for every client we serve.",
    products: [
      {
        category: "UPS & IPS Systems",
        description:
          "Advanced online and offline UPS solutions engineered to ensure uninterrupted power supply and critical load protection for offices, industries, and sensitive electronic equipment.",
        subcategories: [
          {
            subName: "Key Features",
            items: [
              "Stable and continuous power backup",
              "Protection against voltage fluctuation",
              "Suitable for industrial and commercial operations",
              "Reliable support for critical infrastructure",
            ],
          },
        ],
      },
      {
        category: "Inverters & Industrial Battery Systems",
        description:
          "High-performance inverter technologies combined with long-life battery systems to deliver dependable backup power and operational stability.",
        subcategories: [
          {
            subName: "Applications",
            items: [
              "Residential backup systems",
              "Commercial facilities",
              "Industrial operations",
              "Critical equipment support",
            ],
          },
          {
            subName: "Advantages",
            items: [
              "Energy-efficient performance",
              "Long operational lifespan",
              "Intelligent power management",
              "Low maintenance operation",
            ],
          },
        ],
      },
      {
        category: "IT & Office Power Solutions",
        description:
          "Dedicated power protection systems for modern IT environments and office infrastructure.",
        subcategories: [
          {
            subName: "Suitable For",
            items: [
              "Computers & Workstations",
              "Printers & Copiers",
              "Servers & Data Systems",
              "Networking Equipment",
            ],
          },
          {
            subName: "Benefits",
            items: [
              "Continuous workflow protection",
              "Reduced downtime risk",
              "Enhanced equipment safety",
              "Stable power delivery",
            ],
          },
        ],
      },
      {
        category: "Electrical Protection Solutions",
        description:
          "Comprehensive electrical protection systems designed to safeguard valuable equipment from unstable power conditions.",
        subcategories: [
          {
            subName: "Product Range",
            items: [
              "Voltage Stabilizers",
              "Surge Protection Devices (SPD)",
              "Customized Electrical Protection Systems",
            ],
          },
          {
            subName: "Protection Against",
            items: [
              "Voltage fluctuation",
              "Power surges",
              "Electrical instability",
              "Sensitive equipment damage",
            ],
          },
        ],
      },
      {
        category: "Solar Power Systems",
        description:
          "Smart, sustainable, and energy-efficient solar solutions for homes, businesses, and industrial facilities.",
        subcategories: [
          {
            subName: "Solar Energy Storage Inverter",
            description:
              "High-frequency hybrid solar inverters designed for efficient energy conversion and uninterrupted backup performance.",
            items: [
              "Available Capacities: 1000W / 1500W / 2000W / 2300W / 2500W",
              "3000W / 3300W / 4300W / 6300W",
              "12000W (Wall-mounted)",
              "Hybrid solar compatibility",
              "Intelligent charging technology",
              "High conversion efficiency",
              "Home & commercial applications",
            ],
          },
          {
            subName: "Solar Energy Storage Battery (LiFePO4)",
            description:
              "Premium Lithium Iron Phosphate (LiFePO4) battery systems with intelligent BMS protection for maximum safety and long service life.",
            items: [
              "12.8V Series: 50Ah / 100Ah / 200Ah",
              "25.6V Series: 100Ah / 200Ah",
              "51.2V Series: 100Ah / 200Ah / 314Ah",
              "Long cycle life",
              "Intelligent BMS protection",
              "High safety performance",
              "Fast charging capability",
              "Maintenance-free operation",
            ],
          },
          {
            subName: "Wall-mounted Household Battery",
            description:
              "Compact and modular household energy storage systems designed for modern smart energy applications.",
            items: [
              "51.2V – 5.12 kWh",
              "51.2V – 10.854 kWh",
              "51.2V – 16.076 kWh",
              "25.6V – 8.038 kWh",
              "Elegant wall-mounted design",
              "Modular scalability",
              "Up to 15 units parallel expansion",
              "Space-saving installation",
            ],
          },
          {
            subName: "Monocrystalline Solar Panels",
            description:
              "High-efficiency monocrystalline solar panels designed for maximum energy generation and long-term durability.",
            items: [
              "Available Capacities: 100W / 150W / 200W / 250W / 300W",
              "Voltage Options: 18V / 30V",
              "Up to 22% efficiency",
              "Durable weather-resistant construction",
              "Suitable for residential & commercial use",
              "Reliable long-term output",
            ],
          },
          {
            subName: "Complete Solar Power Packages",
            description:
              "Ready-to-install solar power packages tailored for different household and commercial energy requirements.",
            items: [
              "1000W Package — 1.2 kWh Storage",
              "2300W Package — 2.4 kWh Storage",
              "3300W Package — 5.0 kWh Storage",
              "4300W Package — 5.0 kWh Storage",
              "Complete plug-and-play solution",
              "Optimized energy efficiency",
              "Easy installation",
              "Reliable backup support",
            ],
          },
        ],
      },
    ],
    industries: [
      "Corporate Offices",
      "IT & Data Infrastructure",
      "Printing & Packaging Industries",
      "Manufacturing & Industrial Facilities",
    ],
    reasons: [
      "Reliable Performance",
      "Advanced Energy Technology",
      "Long-lasting Components",
      "Professional Technical Support",
      "Energy-efficient & Sustainable Solutions",
      "Customized Solutions for Residential, Commercial & Industrial Needs",
    ],
    commitment: [
      "Reliable and uninterrupted power solutions",
      "Advanced energy technology for long-term performance",
      "Professional technical support and system consultation",
      "Energy-efficient and sustainable power infrastructure",
      "Customized solutions for residential, commercial & industrial needs",
    ],
  },

  // ─────────────────────────────────────────────
  // 4. APPAREL & GARMENTS
  // ─────────────────────────────────────────────
  apparel: {
    id: "apparel",
    name: "Zexora Apparel & Garments",
    industry:
      "Reliable Sourcing & Supply Solutions for the Global Apparel Industry",
    tagline: "Garment Accessories, Trims & Apparel Sourcing",
    overview: `Zexora Apparel & Garments is a professionally managed apparel sourcing and garment accessories supply company serving garment manufacturers, fashion brands, buying houses, and international buyers.
We specialize in sourcing and supplying a comprehensive range of quality garment accessories, trims, labels, branding materials, and packaging solutions tailored to meet specific buyer requirements.
Our sourcing approach combines reliable supplier networks, competitive pricing, quality assurance, and efficient order coordination to deliver consistent products with dependable lead times. From product development and sampling to bulk sourcing, quality inspection, and delivery coordination, we work closely with our clients to provide practical and reliable sourcing solutions.
With a strong focus on quality, responsiveness, and long-term business relationships, Zexora Apparel & Garments aims to be a trusted sourcing and supply partner for the global apparel industry.
`,
    products: [
      {
        category: "Core Services",
        description:
          "End-to-end garment accessories sourcing and supply solutions built around quality, competitive pricing, reliable delivery, and buyer-specific requirements.",
        subcategories: [
          {
            subName: "Garment Accessories & Trims Sourcing",
            description:
              "Comprehensive sourcing of functional, branding, and finishing accessories from reliable suppliers.",
            items: [
              "Garment trims and accessories",
              "Custom product sourcing",
              "Supplier coordination",
              "Buyer-specific product sourcing",
            ],
          },
          {
            subName: "Apparel Labels & Branding Solutions",
            description:
              "Complete labeling and branding solutions to support garment identification, brand presentation, and retail requirements.",
            items: [
              "Woven labels",
              "Printed labels",
              "Care labels",
              "Size labels",
              "Heat-transfer labels",
              "Logo patches",
              "Barcode and price stickers",
            ],
          },
          {
            subName: "Packaging & Garment Finishing Solutions",
            description:
              "Sourcing and supply of garment packaging materials for production, retail presentation, and shipment.",
            items: [
              "Poly bags",
              "Cartons",
              "Tissue paper",
              "Back boards",
              "Packing tape",
              "Stickers and seals",
              "Hangers",
              "Shipping marks and labels",
            ],
          },
          {
            subName: "Quality Control & Order Coordination",
            description:
              "Coordinated quality and order management to help ensure products meet agreed specifications and delivery requirements.",
            items: [
              "Product specification verification",
              "Sample development and approval",
              "Supplier coordination",
              "Quality inspection",
              "Quantity verification",
              "Packing and shipment coordination",
            ],
          },

          {
            subName: "Labels & Branding",

            items: [
              "Woven Main Labels",
              "Printed Labels",
              "Care Labels",
              "Size Labels",
              "Heat-Transfer Labels",
              "Logo Patches",
              "Barcode & Price Stickers",
            ],
          },
          {
            subName: "Hang Tags & Retail Accessories",

            items: [
              "Hang Tags / Swing Tags",
              "Price Tags",
              "Care Cards",
              "Brand Cards",
              "Tag Strings",
              "Tag Pins",
              "Safety Pins",
              "Barcode Tags",
            ],
          },
          {
            subName: "Zippers, Buttons & Closures",

            items: [
              "Zippers",
              "Plastic Buttons",
              "Metal Buttons",
              "Shell Buttons",
              "Snap Buttons",
              "Hook & Eye",
              "Buckles & Sliders",
              "Eyelets & Grommets",
            ],
          },
          {
            subName: "Tapes, Elastic & Cords",

            items: [
              "Twill Tape",
              "Satin Tape",
              "Jacquard Tape",
              "Woven Tape",
              "Elastic",
              "Drawcord / Drawstring",
              "Hook & Loop / Velcro",
              "Seam Binding",
            ],
          },
          {
            subName: "Packaging & Shipping Materials",

            items: [
              "Poly Bags",
              "Cartons",
              "Tissue Paper",
              "Back Boards",
              "Packing Tape",
              "Stickers & Seals",
              "Hangers",
              "Shipping Marks & Labels",
            ],
          },
        ],
      },
    ],
    industries: [
      "Fashion Brands",
      "Retail Businesses",
      "Corporate Uniform Suppliers",
      "Private Label Brands",
    ],
    markets: ["Europe", "North America", "Middle East", "Asia-Pacific"],
    reasons: [
      "International Quality Standards",
      "Transparent Production Monitoring",
      "Ethical & Compliant Manufacturing",
      "On-Time Shipment Commitment",
      "Cost Efficiency with Quality Stability",
    ],
    commitment: [
      "Consistent Quality Assurance",
      "Production Efficiency & Cost Optimization",
      "Ethical & Compliant Manufacturing",
      "Reliable Delivery Performance",
    ],
    sourcing: [
      {
        title: "01. Requirement",
        items: [
          "Understanding the buyer’s product specifications, quantity, quality standards, and delivery requirements.",
        ],
      },
      {
        title: "02. Sourcing",
        items: [
          "Identifying and coordinating with suitable manufacturers and suppliers based on product quality, capability, pricing, and reliability.",
        ],
      },
      {
        title: "03. Sampling",
        items: [
          "Coordinating samples and product development for buyer review and approval.",
        ],
      },
      {
        title: "04. Quality Control",
        items: [
          "Verifying product specifications, workmanship, quantity, packaging, and agreed quality requirements.",
        ],
      },
      {
        title: "05. Delivery",
        items: [
          "Coordinating order completion, packing, logistics, and timely delivery.",
        ],
      },
    ],
    strengths: [
      "Strong Local Manufacturing Network",
      "Competitive Pricing Structure",
      "Structured Production Monitoring",
      "Reliable Delivery Support",
    ],
  },

  // ─────────────────────────────────────────────
  // 5. PRINT & PACK SOLUTIONS
  // ─────────────────────────────────────────────
  printpack: {
    id: "printpack",
    name: "Zexora Print & Pack Solutions",
    industry: "Commercial & Industrial Printing and Packaging Services",
    tagline: "Professional Commercial Printing & Packaging Services",
    overview:
      "Zexora Print & Pack Solutions is a professional printing and packaging service provider specializing in high-quality commercial and industrial print solutions. We deliver precision printing on paper and packaging materials with a strong focus on quality control, color accuracy, durability, and on-time delivery. Our mission is to support businesses with impactful printed materials that strengthen brand identity and market presence.",
    products: [
      {
        category: "Commercial Printing",
        description:
          "Full-range commercial printing services for corporate identity, promotional materials, and publishing needs with premium quality output.",
        subcategories: [
          {
            items: [
              "Visiting Cards",
              "Brochures & Flyers",
              "Calendars",
              "Posters",
              "Corporate Stationery",
              "Books & Magazines",
            ],
          },
        ],
      },
      {
        category: "Packaging Printing",
        description:
          "Custom packaging printing solutions for product branding, FMCG, pharmaceutical, and retail packaging with precision color control.",
        subcategories: [
          {
            items: [
              "Product Boxes",
              "FMCG Packaging",
              "Pharmaceutical Packaging",
              "Custom Carton Printing",
              "Label & Sticker Printing",
            ],
          },
        ],
      },
      {
        category: "Special Printing Solutions",
        description:
          "Premium finishing and special effect printing techniques to elevate brand presentation and add distinctive visual impact.",
        subcategories: [
          {
            items: [
              "UV Coating & Finishing",
              "Spot UV",
              "Lamination (Matte / Gloss)",
              "Embossing & Foil Stamping",
            ],
          },
        ],
      },
    ],
    industries: [
      "Corporate Offices",
      "FMCG Companies",
      "Pharmaceutical Companies",
      "Retail & E-commerce Brands",
      "Advertising & Marketing Agencies",
    ],
    reasons: [
      "Modern printing technology",
      "Premium quality materials",
      "Strict color consistency control",
      "Competitive pricing",
      "Fast production turnaround",
      "Customized solutions for every client",
    ],
    commitment: [
      "We understand that printing is not just ink on paper — it is your brand representation.",
      "At Zexora Print & Pack Solutions, we ensure every project meets professional standards and exceeds client expectations.",
    ],
  },

  // ─────────────────────────────────────────────
  // 6. FASHION & LIFESTYLE
  // ─────────────────────────────────────────────
  fashion: {
    id: "fashion",
    name: "Zexora Fashion & Lifestyle",
    industry: "Luxury Consumer Goods & Premium Retail",
    tagline: "Premium Fashion, Curated Collections & Lifestyle Products",
    overview: `Zexora Fashion & Lifestyle is a contemporary fashion and lifestyle division focused on sourcing, curating, and developing premium products that combine modern design, quality, functionality, and refined aesthetics.
Our portfolio spans fashion apparel, footwear, bags, fashion accessories, and carefully selected lifestyle collections. We work with trusted manufacturers, suppliers, and brand partners to bring distinctive products to retail, distribution, private-label, and exclusive-brand opportunities.
With a strong focus on product quality, trend awareness, responsible sourcing, and market-driven selection, Zexora aims to connect global fashion and lifestyle products with evolving consumer preferences and emerging market opportunities.
"`,
    philosophy: {
      intro:
        "At Zexora, luxury is defined not only by appearance, but by detail, discipline, and deliberate design. We believe in:",
      beliefs: [
        "Curated minimalism",
        "Superior material selection",
        "Precision sourcing",
        "Subtle yet powerful brand presence",
      ],
      closing:
        "Every product reflects intentional craftsmanship and a commitment to uncompromising quality standards.",
    },
    brandPositioning:
      "Zexora Fashion & Lifestyle is positioned for discerning consumers who value refined design, understated luxury, and enduring quality. We serve selective retail channels, boutique partners, and premium marketplaces seeking curated, high-value product lines aligned with contemporary luxury standards.",
    products: [
      {
        category: "Signature Offerings",
        description:
          "Each collection is developed with meticulous attention to finish, texture, durability, and aesthetic harmony.",
        subcategories: [
          {
            items: [
              "Premium fashion apparel and statement accessories",
              "Curated lifestyle collections",
              "Boutique retail product sourcing",
              "Private label and exclusive brand development",
            ],
          },
          {
            subName: "Fashion Apparel",

            items: [
              "T-Shirts",
              "Shirts",
              "Polo Shirts",
              "Tops",
              "Dresses",
              "Jeans",
              "Trousers",
              "Jackets",
              "Blazers",
              "Hoodies",
              "Sweatshirts",
              "Co-ord Sets",
              "Outerwear",
            ],
          },
          {
            subName: "Footwear & Bags",

            items: [
              "Sneakers",
              "Casual Shoes",
              "Formal Shoes",
              "Loafers",
              "Sandals",
              "Boots",
              "Handbags",
              "Shoulder Bags",
              "Crossbody Bags",
              "Totes",
              "Backpacks",
              "Travel Bags",
            ],
          },
          {
            subName: "Fashion Accessories",

            items: [
              "Watches",
              "Fashion Jewellery",
              "Sunglasses",
              "Eyewear",
              "Belts",
              "Wallets",
              "Card Holders",
              "Scarves",
              "Shawls",
              "Hats",
              "Caps",
            ],
          },
          {
            subName: "Lifestyle Collections",

            items: [
              "Travel Essentials",
              "Personal Lifestyle Products",
              "Everyday Accessories",
              "Gift Collections",
              "Seasonal",
              "Limited-Edition Collections",
            ],
          },
        ],
      },
    ],
    industries: [
      "Discerning Consumers",
      "Selective Retail Channels",
      "Boutique Partners",
      "Premium Marketplaces",
    ],
    reasons: [
      "Elevated and distinctive design language",
      "Ethical and responsible sourcing practices",
      "Limited, carefully curated collections",
      "Global outlook with local market precision",
      "Exclusive private label development capability",
    ],
    commitment: [
      "Elevated design language",
      "Ethical and responsible sourcing",
      "Limited, curated collections",
      "Global outlook with local market precision",
    ],
  },
};
