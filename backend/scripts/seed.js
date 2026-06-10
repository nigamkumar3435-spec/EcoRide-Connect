const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Models
const User = require('../models/User');
const ChargingStation = require('../models/ChargingStation');
const ServiceCenter = require('../models/ServiceCenter');
const BatteryStation = require('../models/BatteryStation');
const ForumPost = require('../models/ForumPost');
const Blog = require('../models/Blog');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    // Connect to Database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await ChargingStation.deleteMany({});
    await ServiceCenter.deleteMany({});
    await BatteryStation.deleteMany({});
    await ForumPost.deleteMany({});
    await Blog.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing collections...');

    // 1. Seed Users
    const users = await User.create([
      {
        name: 'EcoRide Admin',
        email: 'admin@ecoride.com',
        password: 'adminpassword',
        role: 'admin',
        profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      },
      {
        name: 'Nigam Kumar',
        email: 'user@ecoride.com',
        password: 'userpassword',
        role: 'user',
        profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
      },
      {
        name: 'Aditi Sharma',
        email: 'aditi@example.com',
        password: 'userpassword',
        role: 'user',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      },
    ]);

    const adminUser = users[0];
    const regularUser = users[1];
    const otherUser = users[2];

    console.log('Users seeded...');

    // 2. Seed Charging Stations
    const stations = await ChargingStation.create([
      {
        name: 'Tata Power EZ Charge - Connaught Place',
        address: 'Block E, Inner Circle, Connaught Place',
        city: 'Delhi',
        state: 'Delhi',
        contact: '1800 209 5161',
        chargerType: 'DC Fast',
        chargingCost: 18,
        availableSlots: 4,
        description: 'Official Tata Power EZ Charge station. High-speed DC charger located at Connaught Place. Amenities include nearby cafes, shopping, and metro access.',
        images: [
          'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800',
        ],
        openingHours: '24/7',
        latitude: 28.6304,
        longitude: 77.2177,
      },
      {
        name: 'Tata Power EZ Charge - Bandra Kurla Complex',
        address: 'G Block, Bandra Kurla Complex, Bandra East',
        city: 'Mumbai',
        state: 'Maharashtra',
        contact: '1800 209 5161',
        chargerType: 'Supercharger',
        chargingCost: 22,
        availableSlots: 5,
        description: 'High-capacity Tata Power charging hub inside BKC. Supports CCS2 fast charging for passenger EVs.',
        images: [
          'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800',
        ],
        openingHours: '24/7',
        latitude: 19.0596,
        longitude: 72.8644,
      },
      {
        name: 'Ather Grid - Indiranagar',
        address: '100 Feet Rd, HAL 2nd Stage, Indiranagar',
        city: 'Bangalore',
        state: 'Karnataka',
        contact: '+91 76766 00900',
        chargerType: 'DC Fast',
        chargingCost: 15,
        availableSlots: 3,
        description: 'Ather Grid fast-charging point. Reliable and quick top-up for 2-wheelers and compatible EVs. Situated at a prime location in Indiranagar.',
        images: [
          'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800',
        ],
        openingHours: '06:00 AM - Midnight',
        latitude: 12.9716,
        longitude: 77.6412,
      },
      {
        name: 'Bolt.earth Charging Point - Dwarka Sector 10',
        address: 'Sector 10 Metro Station Parking, Dwarka',
        city: 'Delhi',
        state: 'Delhi',
        contact: '+91 80 6824 3000',
        chargerType: 'AC Slow',
        chargingCost: 10,
        availableSlots: 6,
        description: 'Public Bolt.earth AC charging station located near Dwarka Sector 10 metro station. Affordable overnight or long-stay charging.',
        images: [
          'https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?auto=format&fit=crop&q=80&w=800',
        ],
        openingHours: '05:00 AM - 11:00 PM',
        latitude: 28.5817,
        longitude: 77.0592,
      },
      {
        name: 'Zeon Charging Station - VR Chennai',
        address: 'VR Chennai Mall, Jawaharlal Nehru Rd, Anna Nagar',
        city: 'Chennai',
        state: 'Tamil Nadu',
        contact: '+91 97900 12345',
        chargerType: 'DC Fast',
        chargingCost: 19,
        availableSlots: 4,
        description: 'Zeon Charging multi-plug high-speed station located at VR Chennai Mall. Enjoy shopping, food, and movies while your car charges.',
        images: [
          'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800',
        ],
        openingHours: '10:00 AM - 10:00 PM',
        latitude: 13.0844,
        longitude: 80.2012,
      },
      {
        name: 'Fortum Charge & Drive - Gachibowli',
        address: 'Near Gachibowli Flyover, Gachibowli',
        city: 'Hyderabad',
        state: 'Telangana',
        contact: '+91 800 102 3333',
        chargerType: 'Supercharger',
        chargingCost: 21,
        availableSlots: 4,
        description: 'High-power Fortum CCS2 fast charger in Gachibowli. Ideal for highway travelers and local commuters.',
        images: [
          'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800',
        ],
        openingHours: '24/7',
        latitude: 17.4401,
        longitude: 78.3489,
      },
    ]);

    console.log('Charging Stations seeded...');

    // 3. Seed Battery Swap Stations
    const batteryStations = await BatteryStation.create([
      {
        name: 'EcoSwap Battery Hub Delhi',
        address: 'Shop No. 5, Okhla Industrial Area Phase 3',
        batteryType: 'Lithium-ion 72V 42Ah (Universal)',
        contact: '+91 88888 77777',
        workingHours: '24/7',
        image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=800',
      },
      {
        name: 'QuickSwap Station Mumbai',
        address: 'Opposite Railway Station, Andheri East',
        batteryType: 'LiFePO4 48V 30Ah (2-Wheelers)',
        contact: '+91 77777 66666',
        workingHours: '06:00 AM - Midnight',
        image: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&q=80&w=800',
      },
      {
        name: 'PowerExchange Hub Bangalore',
        address: 'Hosur Road, Koramangala',
        batteryType: 'Lithium-ion 60V (Ather/Bounce Compatible)',
        contact: '+91 66666 55555',
        workingHours: '24/7',
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
      },
    ]);

    console.log('Battery Swap Stations seeded...');

    // 4. Seed Service Centers
    const serviceCenters = await ServiceCenter.create([
      {
        name: 'EvTech Multi-Brand Service Delhi',
        address: 'G-12, Mayapuri Industrial Area Phase 1',
        contact: '+91 99999 88888',
        services: [
          'Battery Health Diagnostics',
          'Motor Controller Repair',
          'Brake System Overhaul',
          'Suspension Tuning',
          'General EV Servicing',
        ],
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
      },
      {
        name: 'Ather & Bounce Auth Service Mumbai',
        address: 'Sakinaka Junction, Kurla Road',
        contact: '+91 88888 99999',
        services: [
          'Software Diagnostics & Updates',
          'Battery Swapping & Reconditioning',
          'Smart Panel Replacements',
          'Wheel Alignment & Balance',
        ],
        image: 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&q=80&w=800',
      },
      {
        name: 'PlugPoint EV Repair Bangalore',
        address: 'Outer Ring Road, Marathahalli',
        contact: '+91 77777 88888',
        services: [
          'Custom Battery Packs Assembly',
          'High-Voltage Wiring Diagnostics',
          'Retrofitting Kits Installation',
          'Regular Scheduled Maintenance',
        ],
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
      },
    ]);

    console.log('EV Service Centers seeded...');

    // 5. Seed Blogs
    await Blog.create([
      {
        title: 'The Ultimate Guide to Maximizing Your Electric Vehicle\'s Battery Lifespan',
        content: 'Electric vehicle (EV) battery packs are engineered to endure for hundreds of thousands of kilometers, but their longevity depends heavily on how they are charged, discharged, and stored. To maximize your battery\'s state-of-health (SoH), it is highly recommended to follow the "80-20 rule". Keeping your battery charged between 20% and 80% reduces mechanical stress on the lithium-ion cells. Only charge to 100% when preparing for a long road trip, and do not let the battery drop below 10% for extended periods.\n\nTemperature regulation is another critical factor. Extreme heat accelerates chemical degradation within the battery pack. Whenever possible, park your EV in shaded areas, garages, or underground structures during hot summer afternoons. Most modern EVs utilize active liquid-cooling systems, but parking in the shade helps reduce the energy consumption needed to keep the cells cool while the vehicle is stationary.\n\nFinally, minimize the use of DC fast chargers. While high-speed DC fast charging (level 3) is incredibly convenient, it generates substantial heat and high current loads, which can cause micro-cracking in the battery anodes over time. Limit your fast-charging sessions to road trips or emergencies, and rely on slower AC level-2 charging for your daily overnight requirements. By practicing these three simple guidelines, you can ensure your battery retains maximum capacity for a decade or more.',
        category: 'Battery Maintenance',
        image: '/images/blog_battery.png',
      },
      {
        title: 'Navigating India\'s EV Subsidies: FAME-II Transition to the New EMPS Policy',
        content: 'The Indian electric mobility revolution has been significantly catalyzed by state-backed financial incentives. The landmark FAME-II (Faster Adoption and Manufacturing of Hybrid and Electric Vehicles) scheme, which offered substantial subsidies to lower the upfront purchase cost of EVs, officially concluded on March 31, 2024. To prevent a sudden shock to the market, the Ministry of Heavy Industries introduced the Electric Mobility Promotion Scheme (EMPS) as a transitional support program specifically targeting two-wheelers and three-wheelers.\n\nUnder the EMPS framework, the subsidy amount is calculated based on battery capacity, capped at a maximum of ₹10,000 for electric two-wheelers and ₹25,000 for electric three-wheelers. While these amounts are lower than the previous FAME-II limits, the focus has shifted toward encouraging local manufacturing, localization of components, and phasing out imports of foreign-made battery cells. This policy change aims to build a robust, self-reliant EV supply chain within India.\n\nFor consumers, it is crucial to understand state-specific policies in addition to the national EMPS guidelines. States like Delhi, Maharashtra, Gujarat, and Karnataka offer supplementary benefits, including 100% exemption from road tax and registration fees for electric vehicles. When purchasing your next EV, ensure that the vehicle manufacturer is certified under the EMPS guidelines so you can avail of the primary subsidies at the dealer checkout.',
        category: 'Government Policies',
        image: '/images/blog_subsidy.png',
      },
      {
        title: 'AC vs. DC EV Charging Explained: Which Is Best for Your Electric Ride?',
        content: 'For new EV owners, understanding the differences in charging standards can be confusing. The fundamental difference between AC (Alternating Current) and DC (Direct Current) charging lies in where the electrical power gets converted. Power from the national electrical grid is always AC, but an EV battery can only store energy in DC form. In AC charging, the conversion from AC to DC happens inside the vehicle via a component called the onboard charger. In DC charging, this conversion happens outside the car within the charger station itself, allowing it to feed direct DC electricity straight to the vehicle\'s battery pack.\n\nBecause DC fast chargers bypass the vehicle\'s onboard charger limits, they can supply power at astronomical speeds. Typical public DC chargers range from 30 kW up to 150 kW+, allowing you to top up a battery from 10% to 80% in 30 to 45 minutes. On the other hand, home wall-box chargers or public destination chargers supply AC power, typically rated between 3.3 kW and 22 kW. Charging on AC takes significantly longer—usually between 4 to 12 hours depending on the battery size.\n\nWhich type of charging should you choose? For regular daily commutes, AC slow charging is the ideal option. It is gentler on the battery, more energy-efficient, and cheaper. DC fast charging should be reserved for highway road trips where time is of the essence. Overusing DC fast charging can lead to slightly faster battery capacity loss over several years due to thermal stress.',
        category: 'Charging Tips',
        image: '/images/blog_ac_dc.png',
      },
      {
        title: 'Top 5 Highly-Anticipated Electric Cars Launching in India in 2026',
        content: 'The year 2026 is shaping up to be a defining moment for the Indian automotive market, with several major manufacturers launching next-generation, dedicated electric vehicle platforms. Unlike early EV offerings that were adapted from internal combustion engine (ICE) designs, these upcoming models are built from the ground up as dedicated "skateboard" EVs, offering larger cabins, flat floors, longer ranges, and superior driving dynamics.\n\nHere are the top 5 EV launches to watch out for in 2026:\n\n1. **Tata Avinya**: Based on Tata\'s Gen-3 pure EV architecture, this ultra-premium crossover offers lounge-like interior space and a range exceeding 500 km, integrated with advanced Level-2+ autonomous features.\n\n2. **Mahindra XUV.e8**: An all-electric sibling to the popular XUV700, built on Mahindra\'s new INGLO platform, featuring a massive triple-screen dashboard and high-performance battery packs.\n\n3. **Hyundai Creta EV**: India\'s best-selling mid-size SUV is getting an all-electric version. Expected to host a 45 kWh battery, offering around 400 km of real-world range at a highly competitive price point.\n\n4. **Maruti Suzuki eVX**: Maruti\'s first global electric SUV, featuring a robust 4-wheel drive system, a 60 kWh battery pack, and a claimed range of 550 km, targetting the mass-market buyers.\n\n5. **Honda Elevate EV**: A key launch for Honda India as they transition to electric power, bringing their legendary reliability, high safety standards, and space optimization to the zero-emission market.',
        category: 'EV News',
        image: '/images/blog_cars_2026.png',
      },
    ]);

    console.log('Blogs seeded...');

    // 6. Seed Reviews
    await Review.create([
      {
        user: regularUser._id,
        station: stations[0]._id, // Delhi Supercharger
        rating: 5,
        comment: 'Absolutely rapid! Took my Nexon EV from 20% to 80% in just 35 minutes. Clean lounge space and the coffee was great too.',
      },
      {
        user: otherUser._id,
        station: stations[0]._id,
        rating: 4,
        comment: 'Good chargers, but there was a queue of two cars. Overall nice setup with security guards helping with the cable.',
      },
      {
        user: regularUser._id,
        station: stations[1]._id, // Mumbai DC Fast
        rating: 5,
        comment: 'Bandra BKC branch is super convenient. Slots were available and the pricing is very reasonable.',
      },
      {
        user: regularUser._id,
        serviceCenter: serviceCenters[0]._id, // Delhi Service Center
        rating: 5,
        comment: 'Did battery diagnostic test. The engineers are very knowledgeable, and they explained the cell health charts in detail.',
      },
      {
        user: otherUser._id,
        serviceCenter: serviceCenters[0]._id,
        rating: 3,
        comment: 'Service quality was good, but they took almost 4 hours for a basic scheduled checkup. Price is okay.',
      },
    ]);

    console.log('Reviews seeded...');

    // 7. Seed Bookings
    await Booking.create([
      {
        user: regularUser._id,
        station: stations[0]._id, // Delhi Supercharger
        bookingDate: '2026-06-12',
        bookingTime: '10:00 AM - 11:00 AM',
        status: 'Approved',
      },
      {
        user: regularUser._id,
        station: stations[1]._id, // Mumbai DC Fast
        bookingDate: '2026-06-15',
        bookingTime: '04:00 PM - 05:00 PM',
        status: 'Pending',
      },
      {
        user: regularUser._id,
        station: stations[2]._id, // Bangalore AC
        bookingDate: '2026-05-20',
        bookingTime: '02:00 PM - 03:00 PM',
        status: 'Completed',
      },
    ]);

    console.log('Bookings seeded...');

    // 8. Seed Forum Posts
    await ForumPost.create([
      {
        title: 'Nexon EV vs Mahindra XUV400: Real World Range Experience?',
        description: 'Hey everyone, I am planning to purchase my first EV this month. I am split between the Nexon EV Empowered Long Range and the Mahindra XUV400 EL Pro. Nexon claims 465 km and XUV400 claims 456 km. Can current owners share what actual real-world range they are getting on highway drives with AC set to 24C?',
        user: regularUser._id,
        likes: [otherUser._id],
        comments: [
          {
            user: otherUser._id,
            comment: 'Owner of XUV400 EL Pro here. I consistently get 310-330 km on highways keeping speed around 85-90 km/h. City range is better, goes up to 360 km. The cabin space is huge!',
          },
        ],
      },
      {
        title: 'Tips for charging electric scooters in residential apartments',
        description: 'Many societies do not allow installation of individual chargers in the parking lot due to load restrictions. How did you guys convince your RWA? Has anyone set up a common sub-meter billing system for EV charging?',
        user: otherUser._id,
        likes: [regularUser._id],
        comments: [
          {
            user: regularUser._id,
            comment: 'We installed a localized charging station with 4 plug points and a prepaid RFID cards reader. The RWA was happy because they earn a small commission on electricity surcharge, and it prevents electricity theft.',
          },
        ],
      },
    ]);

    console.log('Forum Posts seeded...');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
