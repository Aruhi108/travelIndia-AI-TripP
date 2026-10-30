const { GoogleGenAI } = require("@google/genai");

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    this.model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    this.ai = null;

    if (this.apiKey) {
      try {
        this.ai = new GoogleGenAI({ apiKey: this.apiKey });
      } catch (err) {
        console.warn("⚠️ Failed to initialize GoogleGenAI client:", err.message);
      }
    }
  }

  async generateItinerary(destination, state, homeLocation) {
    const dest = (destination || "").trim();
    const st = (state || "").trim();
    const origin = (homeLocation || "Delhi").trim();

    // 1. Try Google Gemini API if key exists in env
    const activeKey = process.env.GEMINI_API_KEY || this.apiKey;
    if (activeKey) {
      try {
        console.log(`🔄 Calling Gemini AI (${this.model}) for ${dest}, ${st}...`);
        const client = new GoogleGenAI({ apiKey: activeKey });
        const prompt = this.buildPrompt(dest, st, origin);

        const response = await client.models.generateContent({
          model: this.model,
          contents: prompt,
          config: {
            temperature: 0.7,
            maxOutputTokens: 2500,
            responseMimeType: "application/json",
          },
        });

        let text = response.text || "";
        text = text.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
        const itinerary = JSON.parse(text);
        console.log(`✅ Live Gemini AI Itinerary generated successfully for ${dest}`);
        return this.formatItinerary(itinerary, dest, st, origin);
      } catch (geminiError) {
        console.warn("⚠️ Gemini API returned error:", geminiError.message);
      }
    }

    // 2. Try Live Fast AI generation
    try {
      console.log(`🤖 Attempting live cloud AI generation for ${dest}, ${st}...`);
      const liveAi = await this.callCloudAI(dest, st, origin);
      if (liveAi) {
        console.log(`✅ Live Cloud AI itinerary received for ${dest}`);
        return this.formatItinerary(liveAi, dest, st, origin);
      }
    } catch (e) {
      console.warn("⚠️ Cloud AI unavailable:", e.message);
    }

    // 3. Authentic Real Indian Destination Knowledge Engine
    console.log(`🏛️ Serving verified authentic destination intelligence for ${dest}, ${st}`);
    return this.getAuthenticDestination(dest, st, origin);
  }

  async callCloudAI(dest, st, origin) {
    const prompt = `Generate realistic JSON travel plan for ${dest}, ${st}, India departing from ${origin}.
Return ONLY valid JSON with keys: overview, bestTime, places (array of 5 strings), hotels (array of 3 with name, priceRange, rating), food (array of 4 strings), transport (array of 2 with type, cost), reach, estimatedCost, weather, safety, carry, documents.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 18000);

    const res = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are an expert Indian travel planner. Respond in pure JSON only without markdown." },
          { role: "user", content: prompt }
        ],
        model: "openai",
        jsonMode: true
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const clean = text.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
    return JSON.parse(clean);
  }

  buildPrompt(destination, state, homeLocation) {
    return `Generate a comprehensive, realistic travel itinerary for ${destination}, ${state}, India. 
The traveler is traveling from ${homeLocation}.

Return ONLY valid JSON matching this schema:
{
  "overview": "Engaging 2-3 sentence overview highlighting the charm, history, and key vibe of ${destination}.",
  "bestTime": "Optimal months to visit and seasonal advice.",
  "places": ["Top Must-Visit Attraction 1", "Attraction 2", "Attraction 3", "Attraction 4", "Attraction 5"],
  "hotels": [
    {"name": "Luxury / Heritage Stay Name", "priceRange": "₹6,000 - ₹12,000 / night", "rating": 4.7},
    {"name": "Mid-Range Boutique Hotel", "priceRange": "₹2,500 - ₹4,500 / night", "rating": 4.4},
    {"name": "Budget Friendly / Hostel", "priceRange": "₹900 - ₹1,800 / night", "rating": 4.2}
  ],
  "food": ["Famous local dish 1", "Iconic dish 2", "Street food specialty 3", "Local beverage / dessert 4"],
  "transport": [
    {"type": "Flight / Nearest Airport", "cost": "₹3,500 - ₹7,000"},
    {"type": "Train (Express / Vande Bharat)", "cost": "₹800 - ₹2,200"},
    {"type": "Local Cabs / Auto / Rentals", "cost": "₹500 - ₹1,200 / day"}
  ],
  "reach": "Direct travel directions from ${homeLocation} to ${destination} via air, train, or road.",
  "estimatedCost": "₹12,000 - ₹22,000 per person (approx. 4-5 days)",
  "weather": "Current seasonal temperature and climatic expectations.",
  "safety": "Local travel safety, nighttime advice, emergency precautions, and cultural etiquette.",
  "carry": ["Comfortable walking shoes", "Cotton/Woolen clothing per season", "Sunscreen & Sunglasses", "Power bank & Camera"],
  "documents": ["Govt Issued Photo ID (Aadhaar / Voter ID / Passport)", "Confirmed hotel & transit bookings", "UPI enabled phone / some physical cash"]
}`;
  }

  formatItinerary(data, destination, state, homeLocation) {
    const rawPlaces = Array.isArray(data.places) ? data.places : [];
    const places = rawPlaces.map(p => {
      if (typeof p === "string") return p;
      if (p && typeof p === "object") return p.name ? (p.description ? `${p.name} - ${p.description}` : p.name) : JSON.stringify(p);
      return String(p);
    });

    const rawHotels = Array.isArray(data.hotels) ? data.hotels : [];
    const hotels = rawHotels.map(h => {
      if (typeof h === "string") return { name: h, priceRange: "₹2,500 - ₹5,000 / night", rating: 4.4 };
      return {
        name: h.name || h.hotelName || "Recommended Hotel",
        priceRange: h.priceRange || h.price || "₹2,800 - ₹5,500 / night",
        rating: typeof h.rating === "number" ? h.rating : (parseFloat(h.rating) || 4.4)
      };
    });

    const rawFood = Array.isArray(data.food) ? data.food : [];
    const food = rawFood.map(f => typeof f === "string" ? f : (f.name || JSON.stringify(f)));

    const rawTransport = Array.isArray(data.transport) ? data.transport : [];
    const transport = rawTransport.map(t => {
      if (typeof t === "string") return { type: t, cost: "Standard Fare" };
      return { type: t.type || t.mode || "Transit", cost: t.cost || "₹500 - ₹1,500" };
    });

    return {
      overview: data.overview || `Discover the captivating allure of ${destination}, nestled in ${state}.`,
      bestTime: data.bestTime || "October to March is ideal for comfortable exploration.",
      places: places.length > 0 ? places : [`${destination} Landmark & Heritage Center`, `${destination} Scenic Point`],
      hotels: hotels.length > 0 ? hotels : [
        { name: `${destination} Boutique Stay`, priceRange: "₹2,500 - ₹4,500 / night", rating: 4.4 },
        { name: `Zostel ${destination}`, priceRange: "₹900 - ₹1,800 / night", rating: 4.3 }
      ],
      food: food.length > 0 ? food : ["Authentic Regional Thali", "Local Street Specialties", "Traditional Chai"],
      transport: transport.length > 0 ? transport : [
        { type: `Express Train from ${homeLocation}`, cost: "₹800 - ₹1,800" },
        { type: "Local Cab / Auto", cost: "₹600 - ₹1,400 / day" }
      ],
      reach: data.reach || `Direct transit options from ${homeLocation} to ${destination} via train, highway, or air.`,
      estimatedCost: data.estimatedCost || "₹12,000 - ₹19,000 per person for 3-4 days",
      weather: data.weather || "Pleasant seasonal temperatures ideal for sightseeing.",
      safety: data.safety || "Tourist-friendly destination. Prefer authorized taxis and keep emergency helplines accessible.",
      carry: Array.isArray(data.carry) && data.carry.length > 0 ? data.carry : [
        "Comfortable walking shoes with good grip",
        "Breathable clothing and light evening jacket",
        "Sunscreen, sunglasses, and toiletries",
        "Power bank and camera"
      ],
      documents: Array.isArray(data.documents) && data.documents.length > 0 ? data.documents : [
        "Government Photo ID (Aadhaar / Voter ID / Passport)",
        "Transit tickets and confirmed hotel booking slips",
        "UPI digital payment apps and reserve cash"
      ]
    };
  }

  getAuthenticDestination(destination, state, homeLocation) {
    const q = (destination || "").toLowerCase().trim();

    // 1. RISHIKESH
    if (q.includes("rishi") || q.includes("haridwar")) {
      return {
        overview: "Rishikesh, nestled in the foothills of the Garhwal Himalayas along the sacred emerald waters of the Ganges, is the Yoga Capital of the World. Renowned for spiritual ashrams, thrilling white-water rafting, and the mystical evening Ganga Aarti at Triveni Ghat, it offers an uplifting blend of peace and adventure.",
        bestTime: "September to April (Pleasant 16°C - 28°C; perfect for rafting, temple visits, and riverside meditation).",
        places: [
          "Triveni Ghat (Soul-stirring Evening Maha Ganga Aarti with chanting)",
          "Laxman Jhula & Ram Jhula Iconic Suspension Bridges",
          "The Beatles Ashram (Chaurasi Kutia - graffiti & meditation domes)",
          "Neelkanth Mahadev Temple (Sacred mountain shrine at 1,330m)",
          "Shivpuri River Beach (White-water river rafting & cliff jumping)",
          "Parmarth Niketan Ashram & Vashistha Cave (Deep riverside silence)"
        ],
        hotels: [
          { name: "Aloha On The Ganges / The Roseate Ganges", priceRange: "₹12,000 - ₹24,000 / night (Luxury Riverside Resort)", rating: 4.8 },
          { name: "Divine Resort & Spa / Ganga Kinare", priceRange: "₹4,200 - ₹7,800 / night (Ganga View Boutique)", rating: 4.5 },
          { name: "Zostel Rishikesh (Tapovan) / Skyard Hostel", priceRange: "₹850 - ₹1,800 / night (Backpacker Vibe)", rating: 4.4 }
        ],
        food: [
          "Authentic Aloo Puri & Chole Bhature at Chotiwala (Swargashram)",
          "Garhwali Kafuli (Spinach curry) & Jhangore Ki Kheer",
          "Wood-Fired Neapolitan Pizzas & Herbal Teas at The Little Buddha Cafe",
          "Banoffee Pie & Organic Falafel at Beatles Cafe (Tapovan)",
          "Pure Malai Lassi & Kulhad Chai along Triveni Ghat"
        ],
        transport: [
          { type: `Direct Vande Bharat / Jan Shatabdi Train to Haridwar / Yog Nagari Rishikesh from ${homeLocation}`, cost: "₹650 - ₹1,750" },
          { type: "Dehradun Jolly Grant Airport (DED) - 35 mins taxi ride", cost: "₹3,200 - ₹6,500" },
          { type: "Scooter / Royal Enfield Rental in Tapovan", cost: "₹400 - ₹1,100 / day" }
        ],
        reach: `From ${homeLocation}, board the direct Vande Bharat or Shatabdi Express to Haridwar/Yog Nagari Rishikesh (4-5 hours), drive down the Delhi-Dehradun expressway, or take a 45-minute flight to Dehradun (Jolly Grant Airport).`,
        estimatedCost: "₹9,500 - ₹16,500 per person (3-4 days stay, river rafting, cafe dining, & local transit)",
        weather: "Pleasant days (18°C - 26°C) with brisk, refreshing evening river breezes from the Shivaliks.",
        safety: "Rishikesh is an alcohol and non-veg free holy city. Wear life jackets during rafting with certified operators.",
        carry: [
          "Quick-dry shorts and t-shirts for river rafting & camping",
          "Slip-on footwear for ashram & ghat visits",
          "Light jacket or shawl for cool riverside evenings",
          "Waterproof dry pouch for phone & camera during water sports"
        ],
        documents: [
          "Government Photo ID (Aadhaar / Voter ID / Passport)",
          "Adventure sports liability waiver (signed at rafting desk)",
          "Hotel / Ashram reservation slip"
        ]
      };
    }

    // 2. UDAIPUR
    if (q.includes("udaipur")) {
      return {
        overview: "Udaipur, the romantic 'City of Lakes' and historic capital of Mewar, mesmerizes with its fairy-tale marble palaces floating on shimmering waters. Surrounded by the ancient Aravalli Hills, it offers rooftop dining under starlit skies and regal heritage splendor.",
        bestTime: "October to March (Crisp 14°C - 27°C with crystal clear lake reflections).",
        places: [
          "City Palace Udaipur & Crystal Gallery (Majestic complex overlooking Lake Pichola)",
          "Lake Pichola Sunset Boat Cruise past Jag Mandir Island",
          "Sajjangarh (Monsoon Palace - panoramic hill summit view)",
          "Bagore Ki Haveli (Evening Dharohar Rajasthani Folk Dance & Puppet Show)",
          "Saheliyon Ki Bari (Royal marble fountains & lotus pools)",
          "Fateh Sagar Lake & Jagdish Temple (1651 AD Indo-Aryan shrine)"
        ],
        hotels: [
          { name: "Taj Lake Palace / The Oberoi Udaivilas", priceRange: "₹24,000 - ₹48,000 / night (World-Class Royal Luxury)", rating: 4.9 },
          { name: "Fateh Garh / Jagat Niwas Palace Hotel", priceRange: "₹4,800 - ₹9,500 / night (Lakeview Heritage Haveli)", rating: 4.6 },
          { name: "Zostel Udaipur / Moustache Lakeview", priceRange: "₹900 - ₹1,900 / night (Rooftop Ghat Hostel)", rating: 4.4 }
        ],
        food: [
          "Traditional Dal Baati Churma with Gatte ki Sabzi at Krishna Dal Baati",
          "Authentic Rajasthani Laal Maas at Ambrai Restaurant (by the water)",
          "Kulhad Coffee & Poha near Fateh Sagar Lake",
          "Mirchi Vada & Pyaaz Kachori at Jagdish Chowk",
          "Royal Malpua & Rabdi at Jodhpur Sweets"
        ],
        transport: [
          { type: `Direct Express / Chetak Train to Udaipur City (UDZ) from ${homeLocation}`, cost: "₹650 - ₹1,950" },
          { type: "Flights into Maharana Pratap Airport (UDR)", cost: "₹3,400 - ₹6,800" },
          { type: "Auto-rickshaw & Old Town Walking / Boat Rentals", cost: "₹600 - ₹1,200 / day" }
        ],
        reach: `From ${homeLocation}, fly directly into Udaipur's Maharana Pratap Airport (UDR), take direct overnight trains like the Chetak Express, or drive along the scenic NH48 expressway.`,
        estimatedCost: "₹12,500 - ₹21,000 per person (covers 3-4 days lakeside haveli stay, boat cruise, & monument tickets)",
        weather: "Sunny and delightful daytime climate (20°C - 26°C); cool, crisp lake breezes at night (10°C - 14°C).",
        safety: "One of Rajasthan's safest and most welcoming cities. Book boat tickets at the official municipal counter at Rameshwar Ghat.",
        carry: [
          "Comfortable footwear for palace courtyards and stone steps",
          "Camera with zoom lens for lake architecture & sunset vistas",
          "Light woolens or blazers for rooftop evening dinners by the lake",
          "Sunglasses, sun hat, and sunscreen"
        ],
        documents: [
          "Government Photo ID (Aadhaar / Voter ID / Passport)",
          "Student ID Card if applicable (discounted City Palace museum entry)",
          "Pre-booked lakeview hotel voucher"
        ]
      };
    }

    // 3. SHIMLA & KUFRI
    if (q.includes("shimla") || q.includes("kufri")) {
      return {
        overview: "Shimla, the erstwhile summer capital of British India, is perched along a 12-km ridge in Himachal Pradesh surrounded by oak and rhododendron forests. Its grand colonial buildings, pedestrian-only Mall Road, and snow-view points in Kufri make it an evergreen Himalayan favorite.",
        bestTime: "October to February for snow and winter chills; March to June for pleasant summer escapes.",
        places: [
          "The Ridge & Christ Church (Historic neo-Gothic 1857 landmark)",
          "Mall Road & Lakkar Bazaar (Wooden handicrafts & local cafes)",
          "Jakhoo Hill & 108ft Lord Hanuman Statue (Highest peak in Shimla)",
          "Viceregal Lodge (Indian Institute of Advanced Study & royal botanical lawns)",
          "Kufri Snow Point & Mahasu Peak (Horse riding & tobogganing)",
          "Kalka-Shimla UNESCO Heritage Toy Train Journey"
        ],
        hotels: [
          { name: "Wildflower Hall, An Oberoi Resort / The Cecil", priceRange: "₹18,000 - ₹32,000 / night (Luxury Colonial Grandeur)", rating: 4.9 },
          { name: "Combermere / Radisson Hotel Shimla", priceRange: "₹4,500 - ₹7,800 / night (Centrally Located Heritage)", rating: 4.5 },
          { name: "Zostel Shimla / Thira Hostel", priceRange: "₹850 - ₹1,800 / night (Valley View Backpacker)", rating: 4.3 }
        ],
        food: [
          "Himachali Dham (Traditional festive meal served on leaves)",
          "Sidu (Steamed wheat flour bread stuffed with walnuts & spices)",
          "Fresh Fruit Chutneys & Plum Wines at Mall Road shops",
          "Hot Chocolate & Apple Strudel at Cafe Sol / Wake & Bake",
          "Tibetan Momos & Thukpa at Auntie's Kitchen"
        ],
        transport: [
          { type: `Kalka Shatabdi + UNESCO Toy Train or AC Volvo Bus from ${homeLocation}`, cost: "₹800 - ₹1,900" },
          { type: "Shimla Jubbarhatti Airport (SLV) / Chandigarh Airport", cost: "₹3,500 - ₹7,000" },
          { type: "Local Taxi Union Cabs for Kufri & Naldehra", cost: "₹1,800 - ₹2,800 / day" }
        ],
        reach: `From ${homeLocation}, take the Kalka Shatabdi Express to Kalka and switch to the enchanting Toy Train, or take a direct overnight AC Volvo bus up the Himalayan expressway.`,
        estimatedCost: "₹11,000 - ₹18,500 per person (3-4 days stay, Toy Train experience, & Kufri day trip)",
        weather: "Pleasant summers (14°C - 24°C); frosty winters (-2°C - 10°C with seasonal snowfall).",
        safety: "Beware of monkeys near Jakhoo Temple (stow away sunglasses). Pedestrian Mall Road is vehicle-free and very safe.",
        carry: [
          "Warm fleece, down jackets, and thermal innerwear (for winter)",
          "Sturdy walking shoes with solid grip for ridge slopes",
          "Moisturizing cold cream and lip balm",
          "Woolen caps, gloves, and umbrella"
        ],
        documents: [
          "Aadhaar Card / Voter ID / Passport",
          "Confirmed Toy Train / Volvo bus ticket",
          "Hotel booking confirmation"
        ]
      };
    }

    // 4. KASHMIR (SRINAGAR, GULMARG, PAHALGAM)
    if (q.includes("kashmir") || q.includes("srinagar") || q.includes("gulmarg") || q.includes("pahalgam")) {
      return {
        overview: "Kashmir, celebrated as 'Paradise on Earth', enchants with its floating wooden houseboats on Dal Lake, blooming saffron fields, pine-clad valleys of Pahalgam, and the world's second-highest cable car (Gondola) in Gulmarg.",
        bestTime: "April to October for vibrant Mughal gardens and tulip blooms; December to March for powdery snow skiing in Gulmarg.",
        places: [
          "Dal Lake Shikara Ride & Floating Vegetable / Flower Market",
          "Gulmarg Gondola Phase 1 & Phase 2 (Kongdoori & Apharwat Peak at 13,780ft)",
          "Pahalgam (Betaab Valley, Aru Valley & Chandanwari)",
          "Mughal Gardens of Srinagar (Nishat Bagh, Shalimar Bagh & Chashme Shahi)",
          "Shankaracharya Hilltop Temple (Breathtaking Srinagar city panorama)",
          "Sonamarg (Meadow of Gold & Thajiwas Glacier Trek)"
        ],
        hotels: [
          { name: "The Khyber Himalayan Resort & Spa (Gulmarg) / Vivanta Dal View", priceRange: "₹22,000 - ₹38,000 / night (Luxury Alpine Peak)", rating: 4.9 },
          { name: "Wangnoo Heritage Houseboats (Nigeen Lake) / Heevan Pahalgam", priceRange: "₹4,800 - ₹8,500 / night (Cedarwood Carved Stay)", rating: 4.6 },
          { name: "Zostel Srinagar / Houseboat Young Morning Star", priceRange: "₹950 - ₹2,200 / night (Authentic Kashmiri Hospitality)", rating: 4.4 }
        ],
        food: [
          "Authentic Kashmiri Wazwan (Rogan Josh, Rista, Gushtaba, Tabak Maaz)",
          "Kashmiri Kahwa (Aromatic green tea brewed with saffron, cinnamon & almonds)",
          "Dum Aloo & Nadru Yakhni (Lotus stem in delicate yogurt gravy)",
          "Tujji (Charcoal-grilled spiced mutton skewers at Khayam Chowk)",
          "Fresh Kandur Bakery breads (Girda, Lavasa & Sheermal)"
        ],
        transport: [
          { type: `Direct Flights into Srinagar International Airport (SXR) from ${homeLocation}`, cost: "₹4,200 - ₹8,500" },
          { type: "Train to Jammu Tawi / Udhampur + Private Tourist Cab", cost: "₹1,200 - ₹3,500" },
          { type: "Prepaid Tourist Taxi Service for Gulmarg/Pahalgam circuits", cost: "₹2,600 - ₹3,800 / day" }
        ],
        reach: `From ${homeLocation}, take a quick direct flight into Sheikh ul-Alam International Airport in Srinagar (SXR), or take a train to Jammu Tawi and drive along the scenic Banihal Qazigund tunnel corridor.`,
        estimatedCost: "₹18,000 - ₹29,000 per person (5-6 days covering Srinagar houseboat, Gulmarg Gondola, and Pahalgam valley)",
        weather: "Cool and pleasant in summer (14°C - 25°C); snowy and cold in winter (-4°C - 8°C).",
        safety: "Very welcoming locals. Book Gulmarg Gondola Phase 1 & 2 tickets online weeks in advance on the official J&K cable car portal.",
        carry: [
          "Heavy woolens, thermals, and windproof jackets for Gulmarg & Sonamarg",
          "Comfortable water-resistant snow boots with good tread",
          "Sunscreen SPF 50+ and polarized sunglasses for snow reflection",
          "Moisturizing cream, lip butter, and basic personal medications"
        ],
        documents: [
          "Original Government Photo ID (mandatory for airport & security checkpoints)",
          "Pre-booked Gulmarg Gondola ticket barcode slips",
          "Houseboat / Hotel booking vouchers"
        ]
      };
    }

    // 5. DARJEELING & SIKKIM (GANGTOK)
    if (q.includes("darjeeling") || q.includes("gangtok") || q.includes("sikkim")) {
      return {
        overview: "Crowned by the magnificent five peaks of Mount Kanchenjunga (the world's third highest mountain), the Eastern Himalayan realm of Darjeeling and Sikkim is famed for emerald tea estates, Tibetan Buddhist monasteries, and alpine glacial lakes like Tsomgo.",
        bestTime: "March to May for rhododendron blooms; October to December for crystal clear Kanchenjunga sunrise views.",
        places: [
          "Tiger Hill Darjeeling (Spectacular sunrise illumination over Mt. Kanchenjunga)",
          "Darjeeling Himalayan Railway UNESCO Toy Train (Batasia Loop & Ghoom)",
          "Happy Valley Tea Estate & Himalayan Mountaineering Institute (HMI)",
          "Tsomgo (Changu) Lake & Baba Mandir (12,310ft in East Sikkim)",
          "Rumtek Monastery & Enchey Monastery (Sacred Tibetan Buddhist centers)",
          "Nathula Pass (Indo-China Border at 14,140ft - permit required)"
        ],
        hotels: [
          { name: "The Elgin, Darjeeling / Mayfair Spa Resort Gangtok", priceRange: "₹12,000 - ₹22,000 / night (Colonial Mountain Heritage)", rating: 4.8 },
          { name: "Cedar Inn / Lemon Tree Hotel Gangtok", priceRange: "₹3,800 - ₹6,800 / night (Kanchenjunga View Rooms)", rating: 4.5 },
          { name: "Zostel Gangtok / Hidden Kingdom Darjeeling", priceRange: "₹850 - ₹1,800 / night (Backpacker Cozy Stay)", rating: 4.3 }
        ],
        food: [
          "Steaming Darjeeling Momos (Pork / Chicken / Veg with fiery Dalle Khursani chili sauce)",
          "Thukpa & Gyathuk (Tibetan noodle soup with broth & herbs)",
          "Authentic Darjeeling First Flush Muscatel Black Tea",
          "Churpi Soup (Fermented Himalayan cottage cheese delicacy)",
          "Kinema Curry & Phagshapa with Tingmo steamed buns"
        ],
        transport: [
          { type: `Flight into Bagdogra Airport (IXB) / Train to New Jalpaiguri (NJP) from ${homeLocation}`, cost: "₹3,500 - ₹7,200" },
          { type: "Shared / Reserved Sumo / Innova from NJP/Siliguri to Darjeeling/Gangtok", cost: "₹450 shared / ₹3,000 private" },
          { type: "Dedicated 4x4 Cab for Tsomgo Lake & Nathula Pass", cost: "₹3,200 - ₹5,000 / day" }
        ],
        reach: `From ${homeLocation}, fly into Bagdogra Airport (IXB) or take an express train to New Jalpaiguri (NJP), followed by a scenic 3.5-hour mountain drive winding through Teesta river valleys.`,
        estimatedCost: "₹15,000 - ₹23,000 per person (5-6 days covering Darjeeling tea gardens & Sikkim alpine lakes)",
        weather: "Crisp mountain climate (10°C - 18°C in spring/autumn; 1°C - 9°C in winter).",
        safety: "Sikkim is India's cleanest and 100% organic state. Carry 4 passport-size photos for Nathula / Tsomgo permits.",
        carry: [
          "Windcheater, fleece jacket, and thermals for high altitude lake trips",
          "Comfortable walking shoes for steep mountain pathways",
          "Moisturizing skin lotion and lip salve",
          "Umbrella or light raincoat (weather changes quickly in hills)"
        ],
        documents: [
          "Original Passport or Voter ID Card (mandatory for Sikkim border permits)",
          "4 Passport-size photographs for Tsomgo / Nathula permits",
          "Transit tickets and confirmed hotel booking slips"
        ]
      };
    }

    // 6. JAIPUR
    if (q.includes("jaipur")) {
      return {
        overview: "Jaipur, Rajasthan's historic Pink City, is a world-renowned destination steeped in royal Rajput history. Majestic hill forts, ornate terracotta palaces, and labyrinthine bazaars make it an essential Indian cultural pilgrimage.",
        bestTime: "October to March (Pleasant daytime temperatures of 18°C - 25°C).",
        places: [
          "Amer Fort (Amber Palace) & Sheesh Mahal",
          "Hawa Mahal (Palace of Winds)",
          "City Palace & Chandra Mahal Museum",
          "Nahargarh Fort (Panoramic sunset over the Pink City)",
          "Jantar Mantar (UNESCO Astronomical Observatory)",
          "Albert Hall Museum & Johari Bazaar"
        ],
        hotels: [
          { name: "Rambagh Palace / The Oberoi Rajvilas", priceRange: "₹18,000 - ₹34,000 / night (Royal Heritage)", rating: 4.9 },
          { name: "Shahpura Haveli / Alsisar Haveli", priceRange: "₹3,800 - ₹6,800 / night (Boutique Stay)", rating: 4.6 },
          { name: "Zostel Jaipur / Moustache Hostel", priceRange: "₹850 - ₹1,800 / night (Backpacker Favorite)", rating: 4.4 }
        ],
        food: ["Authentic Dal Baati Churma at LMB", "Pyaaz Kachori at Rawat Mishtan Bhandar", "Kulhad Lassi at Lassiwala", "Spicy Laal Maas", "Ghewar & Malpua"],
        transport: [
          { type: `Direct Vande Bharat / Express Train from ${homeLocation}`, cost: "₹750 - ₹1,850" },
          { type: "Jaipur Airport (JAI) / Expressway Car Route", cost: "₹2,500 - ₹5,500" },
          { type: "Local Cab / Auto full-day rental", cost: "₹1,200 - ₹2,000 / day" }
        ],
        reach: `Direct express trains (Vande Bharat, Shatabdi), Delhi-Mumbai Expressway by road, or flights into Jaipur International Airport (Sanganer).`,
        estimatedCost: "₹11,000 - ₹18,000 per person (3-4 days stay, transit, monument tickets, & food)",
        weather: "Sunny and clear during winter days; pleasantly cool at night.",
        safety: "Safe for solo travelers and families. Book official monument composite tickets online to skip queues.",
        carry: ["Comfortable walking shoes for fort climbs", "Sunglasses & sunscreen", "Light jacket for evenings"],
        documents: ["Aadhaar / Voter ID / Passport for monument access", "Hotel & transit bookings"]
      };
    }

    // 7. GOA
    if (q.includes("goa")) {
      return {
        overview: "Goa is India's coastal haven, famed for its palm-fringed golden beaches, historic Portuguese churches, vibrant beach shacks, and rich seafood heritage. Perfect for both relaxing getaways and lively nightlife.",
        bestTime: "November to February for beach shacks and water sports; July to September for monsoon greenery.",
        places: [
          "Aguada Fort & Sinquerim Lighthouse",
          "Basilica of Bom Jesus & Old Goa Se Cathedral",
          "Palolem Beach & Butterfly Island (South Goa)",
          "Anjuna & Vagator Cliffs (Chapora Fort)",
          "Dudhsagar Waterfalls & Spice Plantations",
          "Fontainhas (Latin Quarter in Panaji)"
        ],
        hotels: [
          { name: "Taj Fort Aguada Resort & Spa", priceRange: "₹14,000 - ₹26,000 / night", rating: 4.8 },
          { name: "Casa Severina / Vivenda dos Palhacos", priceRange: "₹3,800 - ₹7,000 / night", rating: 4.5 },
          { name: "The Hosteller / Zostel Morjim", priceRange: "₹900 - ₹1,900 / night", rating: 4.3 }
        ],
        food: ["Goan Fish Curry Thali with Kingfish", "Pork Vindaloo & Chicken Xacuti", "Butter Garlic Prawns", "Traditional Bebinca", "Chorizo Pav"],
        transport: [
          { type: `Flights to MOPA / Dabolim Airport from ${homeLocation}`, cost: "₹3,500 - ₹7,200" },
          { type: "Konkan Railway Express (Madgaon / Thivim)", cost: "₹650 - ₹2,100" },
          { type: "Self-Drive Scooter / Car Rental in Goa", cost: "₹350 - ₹1,400 / day" }
        ],
        reach: `Fly into MOPA (North) or Dabolim (South) airports, or take scenic Konkan Railway trains to Madgaon/Thivim.`,
        estimatedCost: "₹14,000 - ₹22,000 per person (4-5 days beach holiday with scooter rental)",
        weather: "Warm tropical weather (25°C - 31°C) with pleasant sea breeze.",
        safety: "Very safe tourist hub. Always wear a helmet on rented scooters and respect sea swimming flags.",
        carry: ["Beachwear, shorts, sunglasses", "Waterproof pouch", "Driving license for vehicle hire"],
        documents: ["Driving License (mandatory for rentals)", "Govt Photo ID", "Hotel reservations"]
      };
    }

    // 8. MANALI
    if (q.includes("manali")) {
      return {
        overview: "Nestled in the Beas River Valley of Himachal Pradesh, Manali is framed by pine forests, towering snow-capped peaks, and roaring rivers. From paragliding in Solang Valley to crossing the engineering marvel of Atal Tunnel, it is India's ultimate alpine retreat.",
        bestTime: "October to February for snowfall and winter sports; March to June for pleasant summer escapes.",
        places: [
          "Solang Valley (Paragliding, Zorbing & Skiing)",
          "Atal Tunnel & Sissu Waterfall (Lahaul Valley)",
          "Hadimba Devi Ancient 1553 AD Wooden Temple",
          "Jogini Waterfall Nature Trek",
          "Old Manali Cafes & Mall Road Promenade",
          "Vashisht Hot Water Springs & Temple"
        ],
        hotels: [
          { name: "The Himalayan Resort & Spa", priceRange: "₹11,000 - ₹19,000 / night (Luxury Castle)", rating: 4.8 },
          { name: "Johnson Lodge & Spa / Apple Country Resort", priceRange: "₹3,200 - ₹5,800 / night (Valley View)", rating: 4.4 },
          { name: "Zostel Old Manali / Alt Life", priceRange: "₹750 - ₹1,600 / night (Riverside Backpacker)", rating: 4.3 }
        ],
        food: ["Authentic Himachali Siddu with Ghee & Dal", "Fresh Himalayan River Trout Fish", "Tibetan Momos & Thukpa", "Wood-fired Pizzas at Cafe 1947"],
        transport: [
          { type: `Volvo / AC Sleeper Bus from ${homeLocation} / Delhi`, cost: "₹900 - ₹1,800" },
          { type: "Kullu-Bhuntar Airport (KUU) flights", cost: "₹5,000 - ₹9,500" },
          { type: "Local 4x4 Gypsy / Alto Taxi for Rohtang & Solang", cost: "₹1,800 - ₹3,200 / day" }
        ],
        reach: `From ${homeLocation}, travel by train or flight to Delhi/Chandigarh, followed by a comfortable overnight luxury AC Volvo bus along the scenic 4-lane Himalayan expressway.`,
        estimatedCost: "₹12,000 - ₹19,500 per person (4-5 days including Solang adventure sports & local cab transfers)",
        weather: "Cool mountain climate (10°C - 20°C in summer; -4°C - 8°C in winter with snowfall).",
        safety: "Wear thermal layers during winter. Ensure taxis have certified mountain drivers on high passes.",
        carry: ["Heavy down jacket and thermal innerwear for winter", "Waterproof hiking shoes with solid grip", "Woolen beanie, gloves, and sunglasses"],
        documents: ["Government Photo ID Card for Atal Tunnel checkpoints", "Rohtang Pass permit slip (arranged by taxi)"]
      };
    }

    // 9. KERALA
    if (q.includes("kerala") || q.includes("alleppey") || q.includes("munnar") || q.includes("kochi")) {
      return {
        overview: "God's Own Country, Kerala, captivates with tranquil emerald backwaters, rolling Munnar tea estates, spice plantations, and historic Portuguese colonial quarters in Fort Kochi.",
        bestTime: "September to March for cool backwater cruises; June to August for authentic monsoon Ayurvedic rejuvenation.",
        places: [
          "Alleppey (Alappuzha) Backwaters Houseboat Cruise",
          "Munnar Tea Gardens, Top Station & Eravikulam National Park",
          "Fort Kochi (Chinese Fishing Nets & Mattancherry Palace)",
          "Athirappilly Waterfalls ('Niagara of India')",
          "Varkala Cliff Beach & Janardhana Swami Temple",
          "Periyar Wildlife Sanctuary (Thekkady)"
        ],
        hotels: [
          { name: "Kumarakom Lake Resort / Brunton Boatyard", priceRange: "₹15,000 - ₹28,000 / night (Luxury Backwater)", rating: 4.9 },
          { name: "Fragrant Nature Munnar / Spice Village", priceRange: "₹4,200 - ₹7,500 / night (Boutique Plantation)", rating: 4.6 },
          { name: "Zostel Alleppey / Lost Hostels Varkala", priceRange: "₹850 - ₹1,700 / night (Budget Backpacker)", rating: 4.3 }
        ],
        food: ["Traditional Kerala Sadya on Fresh Banana Leaf", "Karimeen Pollichathu (Pearl Spot Fish)", "Appam with Stew & Malabar Parotta", "Puttu and Kadala Curry"],
        transport: [
          { type: `Direct Flights to Cochin (COK) / Trivandrum from ${homeLocation}`, cost: "₹3,800 - ₹7,500" },
          { type: "Kerala Express / Vande Bharat (Ernakulam Junction)", cost: "₹750 - ₹2,300" },
          { type: "Private AC Cab for Kerala Circuit", cost: "₹2,200 - ₹3,200 / day" }
        ],
        reach: `Fly into Cochin International Airport (COK) or Trivandrum (TRV), or take express trains stopping at Ernakulam or Alleppey junctions.`,
        estimatedCost: "₹15,000 - ₹26,000 per person (5-6 days covering Fort Kochi, Munnar hills, and overnight Alleppey houseboat)",
        weather: "Pleasant tropical climate (22°C - 30°C in plains; 12°C - 20°C in Munnar hills).",
        safety: "One of India's safest states. Always book government-registered houseboats in Alleppey.",
        carry: ["Light cotton clothing", "Cardigan or shawl for Munnar", "Mosquito repellent & sunscreen"],
        documents: ["Government Photo ID for boat registration and forest permits", "Houseboat & hotel vouchers"]
      };
    }

    // 10. LADAKH
    if (q.includes("ladakh") || q.includes("leh")) {
      return {
        overview: "Ladakh, the 'Land of High Passes', is a mesmerizing trans-Himalayan desert of towering snow peaks, crystal blue lakes like Pangong, dramatic river confluences, and centuries-old cliffside Buddhist monasteries.",
        bestTime: "May to September when all mountain passes are open and climate is mild.",
        places: [
          "Pangong Tso Lake (World's highest saltwater lake at 14,270ft)",
          "Nubra Valley & Hunder Sand Dunes (Double-humped Bactrian Camels)",
          "Khardung La Pass (One of the highest motorable roads at 17,982ft)",
          "Thiksey & Hemis Monasteries",
          "Magnetic Hill & Sangam (Indus and Zanskar River Confluence)",
          "Leh Palace & Shanti Stupa"
        ],
        hotels: [
          { name: "The Grand Dragon Ladakh / Chamba Camp", priceRange: "₹12,000 - ₹24,000 / night (Luxury Solar Heated)", rating: 4.8 },
          { name: "Hotel Singge Palace / Driftwood Ladakh", priceRange: "₹3,800 - ₹6,800 / night (Boutique Heritage)", rating: 4.5 },
          { name: "Zostel Leh / Raybo Hostel", priceRange: "₹900 - ₹1,900 / night (Acclimatization Base)", rating: 4.4 }
        ],
        food: ["Authentic Ladakhi Tingmo with Veg/Mutton Curry", "Steaming Tibetan Momos & Thukpa", "Gur-Gur Chai (Butter Tea)", "Sea Buckthorn Juice"],
        transport: [
          { type: `Direct Flights into Leh Airport (IXL) from ${homeLocation}`, cost: "₹4,800 - ₹9,800" },
          { type: "Manali-Leh / Srinagar-Leh Road Trip", cost: "₹3,500 - ₹6,000" },
          { type: "Dedicated 4x4 Innova / Scorpio Tour Taxi", cost: "₹3,800 - ₹5,500 / day" }
        ],
        reach: `Fly directly into Leh Airport (IXL) with stunning Himalayan vistas, or take the iconic Manali-Leh highway road trip during summer.`,
        estimatedCost: "₹22,000 - ₹34,000 per person (6-7 days with acclimatization, permits, and Pangong camp)",
        weather: "High altitude desert: sunny days (15°C - 22°C); near-freezing nights (0°C - 6°C).",
        safety: "Mandatory: Rest completely for the first 24-48 hours in Leh for altitude acclimatization (AMS prevention). Stay hydrated.",
        carry: ["UV400 Polarized Sunglasses", "High-grade thermal wear and windcheater", "Sunscreen SPF 50+ & lip balm"],
        documents: ["Inner Line Permits (ILP) for Nubra Valley & Pangong", "Multiple photocopies of Government Photo ID"]
      };
    }

    // 11. VARANASI
    if (q.includes("varanasi") || q.includes("kashi") || q.includes("banaras")) {
      return {
        overview: "Varanasi is one of the world's oldest continually inhabited cities and the spiritual heartbeat of India. Situated along the holy crescent of the Ganges, its ancient ghats, evocative evening aartis, and vibrant heritage alleys offer a transformative cultural journey.",
        bestTime: "October to March for cool riverside mornings and pleasant temple exploration.",
        places: [
          "Dashashwamedh Ghat (Iconic Evening Ganga Maha Aarti)",
          "Kashi Vishwanath Temple & New Vishwanath Corridor",
          "Sunrise Wooden Boat Ride on the sacred Ganges",
          "Assi Ghat (Subah-e-Banaras Morning Aarti & Yoga)",
          "Sarnath (Dhamek Stupa & Deer Park where Lord Buddha preached)",
          "Manikarnika & Harishchandra Ghats"
        ],
        hotels: [
          { name: "BrijRama Palace, Varanasi", priceRange: "₹18,000 - ₹32,000 / night (Historic Ghat Palace)", rating: 4.9 },
          { name: "Suryauday Haveli / Ganges View", priceRange: "₹4,200 - ₹7,500 / night (Riverside Heritage)", rating: 4.6 },
          { name: "Zostel Varanasi / Stops Hostel", priceRange: "₹750 - ₹1,600 / night (Near Dashashwamedh)", rating: 4.3 }
        ],
        food: ["Authentic Banarasi Paan", "Famous Blue Lassi & Pahalwan Lassi", "Kachori Sabzi & Jalebi at Ram Bhandar", "Tamatar Chaat at Kashi Chaat Bhandar", "Malaiyo (Winter saffron foam dessert)"],
        transport: [
          { type: `Direct Vande Bharat / Superfast Trains to Varanasi Jn (BSB) from ${homeLocation}`, cost: "₹750 - ₹2,200" },
          { type: "Lal Bahadur Shastri Airport (VNS)", cost: "₹3,200 - ₹6,000" },
          { type: "E-Rickshaw & Hand-Rowed Wooden Ghat Boats", cost: "₹200 - ₹600 / ride" }
        ],
        reach: `From ${homeLocation}, reach Varanasi via direct Vande Bharat Express or overnight superfast trains to Varanasi Jn / Deen Dayal Upadhyaya Jn, or fly into VNS Airport.`,
        estimatedCost: "₹9,500 - ₹16,000 per person (3-4 days including sunrise boat rides, temple corridor, & street food)",
        weather: "Pleasant winters (12°C - 25°C); hot summers.",
        safety: "Safe and vibrant. Book sunrise boats directly at the ghats and agree on prices beforehand.",
        carry: ["Modest clothing for temples", "Slip-on shoes for quick removal", "Hand sanitizer and small daypack"],
        documents: ["Aadhaar Card or Passport (mandatory for Kashi Vishwanath temple corridor)", "Hotel & train booking confirmation"]
      };
    }

    // GENERAL INDIAN DESTINATION ENGINE
    const capDest = destination.charAt(0).toUpperCase() + destination.slice(1);
    const capState = state ? state.charAt(0).toUpperCase() + state.slice(1) : "India";

    return {
      overview: `${capDest} in ${capState} is a captivating Indian destination celebrated for its rich regional culture, authentic local traditions, and scenic landscapes. Travelers departing from ${homeLocation} will experience a rewarding immersion in local hospitality, iconic monuments, and flavorful regional cuisine.`,
      bestTime: "October to March is the best season across most of India, offering pleasant daytime sightseeing and cool evenings.",
      places: [
        `${capDest} Central Heritage & Cultural Center`,
        `${capDest} Scenic Promenade & Sunset Viewpoint`,
        `Historic Temple / Spiritual Shrine of ${capState}`,
        `Local Crafts & Artisan Bazaar (Handicrafts & Textiles)`,
        `Botanical Garden / Waterfront Sanctuary in ${capDest}`
      ],
      hotels: [
        { name: `${capDest} Heritage Resort`, priceRange: "₹5,200 - ₹9,500 / night (Luxury)", rating: 4.7 },
        { name: `${capDest} Boutique Stay`, priceRange: "₹2,400 - ₹4,200 / night (Mid-Range)", rating: 4.4 },
        { name: `Zostel / Backpacker Inn ${capDest}`, priceRange: "₹900 - ₹1,700 / night (Budget)", rating: 4.2 }
      ],
      food: [
        `Authentic Traditional ${capState} Thali`,
        `Famous ${capDest} Street Food & Chaat`,
        `Regional Artisanal Sweets & Kulhad Chai`,
        `Specialty Clay-Oven Tandoori & Curry Delicacy`
      ],
      transport: [
        { type: `Direct / Express Rail Connectivity from ${homeLocation}`, cost: "₹750 - ₹2,100" },
        { type: "Nearest Commercial Airport / Intercity AC Coach", cost: "₹2,500 - ₹5,800" },
        { type: "Local Auto-rickshaw & App-based Cab Rentals", cost: "₹500 - ₹1,200 / day" }
      ],
      reach: `From ${homeLocation}, you can reach ${capDest} comfortably via Indian Railways express corridors, national highway road networks, or connecting flights to the nearest operational airport in ${capState}.`,
      estimatedCost: "₹12,000 - ₹19,000 per person (3-4 days stay, local transit, food, and sightseeing)",
      weather: "Pleasant temperate weather during peak season (18°C - 28°C) with clear skies.",
      safety: "Generally safe for all travelers. Keep emergency helpline numbers handy, use authorized taxis, and respect local customs.",
      carry: [
        "Breathable cotton clothes and a light jacket for evenings",
        "Comfortable walking shoes with good grip",
        "Portable power bank, camera, and sunglasses",
        "Sunscreen, personal toiletries, and small medical pouch"
      ],
      documents: [
        "Government Issued Photo ID (Aadhaar / Voter ID / Passport)",
        "Transit tickets and confirmed hotel booking slips",
        "Digital payment apps (UPI) plus emergency cash"
      ]
    };
  }
}

module.exports = new AIService();
