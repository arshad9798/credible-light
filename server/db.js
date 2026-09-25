import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for high performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS website_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      short_description TEXT NOT NULL,
      full_description TEXT,
      icon TEXT,
      cover_image TEXT NOT NULL,
      features TEXT, -- JSON array
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS service_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      alt_text TEXT,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS portfolio_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      category_name TEXT NOT NULL,
      location TEXT,
      short_description TEXT,
      full_description TEXT,
      project_date TEXT,
      cover_image TEXT NOT NULL,
      is_featured INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES portfolio_categories(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS project_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      alt_text TEXT,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS before_after (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      before_image TEXT NOT NULL,
      after_image TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT NOT NULL,
      client_role TEXT NOT NULL,
      company_name TEXT,
      rating INTEGER DEFAULT 5,
      review_text TEXT NOT NULL,
      avatar_image TEXT,
      project_image TEXT,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS process_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      step_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS business_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stat_value TEXT NOT NULL,
      stat_label TEXT NOT NULL,
      icon TEXT,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      whatsapp TEXT,
      email TEXT,
      city_location TEXT,
      business_type TEXT,
      service_id INTEGER,
      service_name TEXT,
      approx_size TEXT,
      budget_range TEXT,
      requirement_details TEXT,
      uploaded_photo_url TEXT,
      status TEXT DEFAULT 'New', -- 'New', 'Contacted', 'Quotation Sent', 'Follow-up', 'Converted', 'Closed'
      admin_notes TEXT,
      follow_up_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_name TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_type TEXT,
      file_size INTEGER,
      alt_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS gift_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      tag TEXT,
      price INTEGER NOT NULL,
      original_price INTEGER,
      image_url TEXT NOT NULL,
      description TEXT,
      features TEXT, -- JSON array
      customization_type TEXT DEFAULT 'lamp',
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS custom_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_type TEXT NOT NULL,
      product_name TEXT NOT NULL,
      custom_text TEXT NOT NULL,
      secondary_text TEXT,
      font_family TEXT,
      glow_color TEXT,
      size TEXT,
      backing_style TEXT,
      base_type TEXT,
      power_accessory TEXT,
      uploaded_photo_url TEXT,
      estimated_price INTEGER,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      whatsapp TEXT,
      delivery_city TEXT,
      status TEXT DEFAULT 'New',
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  // Check if admin exists
  const adminCheck = db.prepare('SELECT COUNT(*) as count FROM admin_users').get();
  if (adminCheck.count === 0) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    db.prepare(`
      INSERT INTO admin_users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `).run('admin', 'admin@crediblelight.in', passwordHash, 'superadmin');
  }

  // Settings
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM website_settings').get();
  if (settingsCount.count === 0) {
    const defaultSettings = [
      ['business_name', 'Credible Light'],
      ['business_tagline', 'SIGNAGE & INTERIORS'],
      ['phone_number', '+91 87896 40490'],
      ['whatsapp_number', '+91 87896 40490'],
      ['email', 'info@crediblelight.in'],
      ['address', 'Main Road, Bistupur, Jamshedpur, Jharkhand 831001'],
      ['business_hours', 'Mon - Sat: 9:00 AM - 7:00 PM'],
      ['hero_badge', 'BRIGHT IDEAS FOR A BETTER TOMORROW'],
      ['hero_heading_prefix', 'Premium '],
      ['hero_heading_highlight1', 'Sign Board'],
      ['hero_heading_middle', ' & '],
      ['hero_heading_highlight2', 'Interior Solutions'],
      ['hero_heading_suffix', ' for Your Business'],
      ['hero_description', 'A complete range of LED sign boards, acrylic letters, shop signage and interior branding to make your business stand out.'],
      ['hero_image', '/uploads/hero_storefront.jpg'],
      ['hero_cta_primary', 'Get Free Quote'],
      ['hero_cta_secondary', 'WhatsApp Us'],
      ['quote_banner_image', '/uploads/quote_banner_reception.jpg'],
      ['whatsapp_qr_image', '/uploads/whatsapp_qr.png'],
      ['seo_title', 'Credible Light | Premium LED Sign Boards, 3D Letters & Interior Branding'],
      ['seo_meta_description', 'Top-rated commercial signage & interior solutions. High-converting 3D acrylic letters, LED sign boards, shop fronts, and office interior branding. Call +91 87896 40490 for free mockup & quotation.'],
      ['seo_keywords', 'Sign Board, LED Sign Board, 3D Acrylic Letters, Shop Signage, Interior Branding, ACP Board, Name Plates, Glow Sign, Credible Light, Jamshedpur'],
      ['og_title', 'Credible Light – Premium Signage & Interior Solutions'],
      ['og_description', 'Custom LED sign boards, acrylic letters, shop signage and interior branding designed to make your business stand out.'],
      ['og_image', '/uploads/hero_storefront.jpg']
    ];

    const insertSetting = db.prepare('INSERT INTO website_settings (key, value) VALUES (?, ?)');
    for (const [k, v] of defaultSettings) {
      insertSetting.run(k, v);
    }
  }

  // Categories
  const categoriesCount = db.prepare('SELECT COUNT(*) as count FROM portfolio_categories').get();
  if (categoriesCount.count === 0) {
    const categories = [
      { slug: 'all', name: 'All', order: 0 },
      { slug: 'shop-sign-boards', name: 'Shop Sign Boards', order: 1 },
      { slug: 'interior-design', name: 'Interior Design', order: 2 },
      { slug: 'led-boards', name: 'LED Boards', order: 3 },
      { slug: 'acrylic-letters', name: 'Acrylic Letters', order: 4 },
      { slug: 'office-branding', name: 'Office Branding', order: 5 },
      { slug: 'restaurant', name: 'Restaurant', order: 6 },
      { slug: 'showroom', name: 'Showroom', order: 7 }
    ];
    const insertCat = db.prepare('INSERT INTO portfolio_categories (slug, name, display_order) VALUES (?, ?, ?)');
    for (const c of categories) {
      insertCat.run(c.slug, c.name, c.order);
    }
  }

  // Services
  const servicesCount = db.prepare('SELECT COUNT(*) as count FROM services').get();
  if (servicesCount.count === 0) {
    const services = [
      {
        slug: '3d-acrylic-letters',
        name: '3D Acrylic Letters',
        short_description: 'Premium 3D letters for shops, offices and brands with radiant LED halo and face illumination.',
        full_description: 'Our custom fabricated 3D Acrylic letters are laser cut with surgical precision, featuring high-transmission virgin cast acrylic with imported IP67 LED modules. Perfect for storefronts, reception backdrops, and corporate landmarks.',
        cover_image: '/uploads/service_3d_acrylic.jpg',
        features: JSON.stringify(['Cast Virgin Acrylic', 'Waterproof IP67 LEDs', '3D Dimensional Depth', '5-Year Color Warranty', 'Custom Typography']),
        display_order: 1
      },
      {
        slug: 'led-sign-boards',
        name: 'LED Sign Boards',
        short_description: 'Bright and attractive LED signage designed for maximum day and night visibility.',
        full_description: 'Engineered for exceptional nighttime brilliance, our LED sign boards combine high-lumen Samsung diodes with precision power supplies to guarantee low energy consumption and long-lasting vibrancy.',
        cover_image: '/uploads/service_led_boards.jpg',
        features: JSON.stringify(['Ultra Bright Lumens', 'Low Power Consumption', 'Weather Resistant Casing', 'Custom Colors & Neon Scripts']),
        display_order: 2
      },
      {
        slug: 'shop-office-signage',
        name: 'Shop & Office Signage',
        short_description: 'Custom sign boards for all business types from retail boutiques to commercial hubs.',
        full_description: 'Turn your commercial building into an iconic local landmark. We design, fabricate, and install end-to-end retail store facades, outdoor fascias, and office entry sign boards.',
        cover_image: '/uploads/service_shop_office.jpg',
        features: JSON.stringify(['Custom Architectural Facade', 'Architectural Standoffs', 'Night Illumination', 'Municipal Compliance']),
        display_order: 3
      },
      {
        slug: 'interior-branding',
        name: 'Interior Branding',
        short_description: 'Complete interior branding solutions including reception desks, feature walls, and directional signs.',
        full_description: 'Elevate client perception the second they walk through your doors. We create luxury corporate reception feature walls, wooden fluted branding panels, frosted glass graphics, and metallic logos.',
        cover_image: '/uploads/service_interior_branding.jpg',
        features: JSON.stringify(['Fluted Wood Backdrops', 'Metallic Standoff Emblems', 'Warm Ambient Halo Glow', 'Ergonomic Reception Integration']),
        display_order: 4
      },
      {
        slug: 'acp-metal-boards',
        name: 'ACP / Metal Boards',
        short_description: 'Durable and stylish metal and aluminum composite panel sign boards built to endure.',
        full_description: 'Fabricated with top-tier PVDF coated Aluminum Composite Panels (ACP) and CNC routed lettering with internal acrylic backing. Rust-proof, storm-proof, and visually immaculate.',
        cover_image: '/uploads/service_acp_metal.jpg',
        features: JSON.stringify(['3mm/4mm Premium ACP', 'CNC Precision Routing', 'UV & Weatherproof Coating', 'Heavy Structural Framework']),
        display_order: 5
      },
      {
        slug: 'acrylic-name-plates',
        name: 'Acrylic Name Plates',
        short_description: 'Professional name plates for home, executive offices, clinics, and doctor consultation chambers.',
        full_description: 'Crystal-clear cast acrylic plaques with laser engraved and gold inlaid lettering, suspended with solid brass golden standoffs. Epitome of refined executive presence.',
        cover_image: '/uploads/service_name_plates.jpg',
        features: JSON.stringify(['Frosted & Clear Cast Acrylic', 'Gold/Silver Embossed Text', 'Solid Brass Standoff Studs', 'Executive Finish']),
        display_order: 6
      }
    ];

    const insertService = db.prepare(`
      INSERT INTO services (slug, name, short_description, full_description, cover_image, features, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const s of services) {
      insertService.run(s.slug, s.name, s.short_description, s.full_description, s.cover_image, s.features, s.display_order);
    }
  }

  // Projects
  const projectsCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
  if (projectsCount.count === 0) {
    const projects = [
      {
        slug: 'the-spice-hub-restaurant',
        title: 'The Spice Hub',
        category_slug: 'restaurant',
        category_name: 'Restaurant Sign Board',
        location: 'Bistupur Commercial Hub',
        short_description: 'Warm golden 3D illuminated channel lettering on dark textured architectural facade.',
        full_description: 'Engineered a warm ambient outdoor sign board for The Spice Hub restaurant using front-lit warm golden 3D acrylic letters with weatherproof LED modules and dark wood textured ACP backing.',
        project_date: 'February 2026',
        cover_image: '/uploads/portfolio_spice_hub.jpg',
        is_featured: 1,
        display_order: 1
      },
      {
        slug: 'glam-beauty-lounge',
        title: 'Glam Beauty Lounge',
        category_slug: 'interior-design',
        category_name: 'Salon Interior Branding',
        location: 'Sakchi Boulevard',
        short_description: 'Soft halo backlit acrylic signage on dark fluted acoustic wall with circular LED mirrors.',
        full_description: 'Turnkey interior branding project featuring custom warm rose-white LED channel letters mounted on fluted wood panels, complete with ambient indirect illumination and mirror styling stations.',
        project_date: 'January 2026',
        cover_image: '/uploads/portfolio_glam_salon.jpg',
        is_featured: 1,
        display_order: 2
      },
      {
        slug: 'tata-corporate-office',
        title: 'Tata Corporate Signage',
        category_slug: 'office-branding',
        category_name: 'Office Signage',
        location: 'Corporate Tower, Northern Town',
        short_description: 'Massive precision-fabricated blue and silver backlit commercial building logo.',
        full_description: 'Fabricated high-altitude weather-sealed corporate emblem and bold typography with 6500K bright white LED arrays and structural wind-resistant steel frame.',
        project_date: 'December 2025',
        cover_image: '/uploads/portfolio_tata_office.jpg',
        is_featured: 1,
        display_order: 3
      },
      {
        slug: 'trends-retail-showroom',
        title: 'Trends Fashion Showroom',
        category_slug: 'showroom',
        category_name: 'Showroom Sign Board',
        location: 'City Mall Ground Floor',
        short_description: 'High-contrast 3D acrylic illuminated letters on black granite stone cladding.',
        full_description: 'High visibility retail sign board engineered to meet brand guidelines with laser-cut acrylic front panels and warm white LED perimeter illumination.',
        project_date: 'November 2025',
        cover_image: '/uploads/portfolio_trends_showroom.jpg',
        is_featured: 1,
        display_order: 4
      },
      {
        slug: 'carewell-multispeciality-clinic',
        title: 'CareWell MultiSpeciality Clinic',
        category_slug: 'shop-sign-boards',
        category_name: 'Clinic Signage',
        location: 'Health City Complex',
        short_description: 'Vibrant medical cross logo with 3D illuminated letters for 24/7 night emergency visibility.',
        full_description: 'Outdoor weatherproof healthcare signage with dual-color LED illumination (medical green & cyan blue) and robust ACP backing for long-term outdoor endurance.',
        project_date: 'January 2026',
        cover_image: '/uploads/portfolio_carewell_clinic.jpg',
        is_featured: 1,
        display_order: 5
      },
      {
        slug: 'coffee-culture-cafe',
        title: 'Coffee Culture Cafe',
        category_slug: 'led-boards',
        category_name: 'Cafe Sign Board',
        location: 'Heritage Park Market',
        short_description: 'Warm glowing cursive acrylic script signage with wooden cornice and Edison bulb accents.',
        full_description: 'Custom handcrafted sign board for an artisan cafe, featuring warm golden LED illumination, vintage dark timber trim, and weather-sealed circuitry.',
        project_date: 'October 2025',
        cover_image: '/uploads/portfolio_coffee_culture.jpg',
        is_featured: 1,
        display_order: 6
      },
      {
        slug: 'orion-group-reception',
        title: 'Orion Group Headquarters',
        category_slug: 'interior-design',
        category_name: 'Interior Design',
        location: 'Business Park Tower 3',
        short_description: 'Luxury fluted timber feature wall with halo-illuminated golden emblem and marble desk.',
        full_description: 'Comprehensive reception lobby branding with recessed LED cove lighting, solid timber fluting, and laser-crafted brushed brass lettering.',
        project_date: 'February 2026',
        cover_image: '/uploads/portfolio_reception_interior.jpg',
        is_featured: 1,
        display_order: 7
      },
      {
        slug: 'gym-fitness-studio',
        title: 'Gym Fitness Studio',
        category_slug: 'acrylic-letters',
        category_name: '3D Acrylic Letters',
        location: 'Prime Arena Plaza',
        short_description: 'Industrial style 3D dimensional lettering with cool white edge glow on dark steel facade.',
        full_description: 'High-impact fitness brand sign board with front and edge illuminated 3D letters, engineered for maximum curb appeal.',
        project_date: 'September 2025',
        cover_image: '/uploads/portfolio_gym_fitness.jpg',
        is_featured: 1,
        display_order: 8
      }
    ];

    const getCat = db.prepare('SELECT id FROM portfolio_categories WHERE slug = ?');
    const insertProj = db.prepare(`
      INSERT INTO projects (slug, title, category_id, category_name, location, short_description, full_description, project_date, cover_image, is_featured, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of projects) {
      const cat = getCat.get(p.category_slug) || { id: 1 };
      insertProj.run(p.slug, p.title, cat.id, p.category_name, p.location, p.short_description, p.full_description, p.project_date, p.cover_image, p.is_featured, p.display_order);
    }
  }

  // Before / After
  const baCount = db.prepare('SELECT COUNT(*) as count FROM before_after').get();
  if (baCount.count === 0) {
    db.prepare(`
      INSERT INTO before_after (title, category, description, before_image, after_image, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Commercial Storefront Renovation',
      'Restaurant & Retail Signage',
      'Dramatic transformation from an old faded flex board to premium 3D illuminated channel letters and sleek dark ACP architectural facade.',
      '/uploads/before_storefront.jpg',
      '/uploads/after_storefront.jpg',
      1,
      1
    );
  }

  // Testimonials
  const testCount = db.prepare('SELECT COUNT(*) as count FROM testimonials').get();
  if (testCount.count === 0) {
    const testimonials = [
      {
        client_name: 'Rohit Mishra',
        client_role: 'Restaurant Owner',
        company_name: 'The Spice Hub',
        rating: 5,
        review_text: 'Excellent work! The sign board quality and timing is amazing. It transformed our restaurant front and increased our footfall by over 40% in the first month. Highly recommended.',
        avatar_image: '/uploads/client_rohit.jpg',
        project_image: '/uploads/portfolio_spice_hub.jpg',
        display_order: 1
      },
      {
        client_name: 'Neha Kapoor',
        client_role: 'Salon Owner',
        company_name: 'Glam Beauty Lounge',
        rating: 5,
        review_text: 'Very professional team. They understood my requirement and delivered exactly what I wanted. The warm halo lighting and fluted wooden backdrop are breathtaking!',
        avatar_image: '/uploads/client_neha.jpg',
        project_image: '/uploads/portfolio_glam_salon.jpg',
        display_order: 2
      },
      {
        client_name: 'Dr. Amit Verma',
        client_role: 'Clinic Director',
        company_name: 'CareWell Clinic',
        rating: 5,
        review_text: 'Great service and timely installation. The medical signage looks premium and attractive, visible clearly even from 500 meters at night. Very satisfied.',
        avatar_image: '/uploads/client_amit.jpg',
        project_image: '/uploads/portfolio_carewell_clinic.jpg',
        display_order: 3
      }
    ];

    const insertTestimonial = db.prepare(`
      INSERT INTO testimonials (client_name, client_role, company_name, rating, review_text, avatar_image, project_image, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const t of testimonials) {
      insertTestimonial.run(t.client_name, t.client_role, t.company_name, t.rating, t.review_text, t.avatar_image, t.project_image, t.display_order);
    }
  }

  // Process Steps
  const processCount = db.prepare('SELECT COUNT(*) as count FROM process_steps').get();
  if (processCount.count === 0) {
    const steps = [
      { step: 1, title: 'Share Requirement', desc: 'Upload your shop photo or tell us your concept and dimensions.', icon: 'FileText' },
      { step: 2, title: 'Get Design', desc: 'Our architectural design team prepares a photorealistic 3D mockup.', icon: 'Compass' },
      { step: 3, title: 'Approve & Pay', desc: 'Review the technical specs, confirm design and transparent estimate.', icon: 'CheckCircle' },
      { step: 4, title: 'Manufacturing', desc: 'High-precision laser CNC fabrication using virgin acrylic & IP67 LEDs.', icon: 'Cpu' },
      { step: 5, title: 'Installation', desc: 'Professional on-site mounting, wiring, and testing by certified technicians.', icon: 'Wrench' }
    ];
    const insertStep = db.prepare('INSERT INTO process_steps (step_number, title, description, icon, display_order) VALUES (?, ?, ?, ?, ?)');
    for (const s of steps) {
      insertStep.run(s.step, s.title, s.desc, s.icon, s.step);
    }
  }

  // Business Stats
  const statsCount = db.prepare('SELECT COUNT(*) as count FROM business_stats').get();
  if (statsCount.count === 0) {
    const stats = [
      { val: '500+', label: 'Businesses Served', icon: 'Building2', order: 1 },
      { val: '1000+', label: 'Projects Completed', icon: 'Award', order: 2 },
      { val: '10+', label: 'Years Experience', icon: 'Calendar', order: 3 },
      { val: '100%', label: 'Customer Satisfaction', icon: 'HeartHandshake', order: 4 }
    ];
    const insertStat = db.prepare('INSERT INTO business_stats (stat_value, stat_label, icon, display_order) VALUES (?, ?, ?, ?)');
    for (const st of stats) {
      insertStat.run(st.val, st.label, st.icon, st.order);
    }
  }

  // FAQs
  const faqCount = db.prepare('SELECT COUNT(*) as count FROM faqs').get();
  if (faqCount.count === 0) {
    const faqs = [
      {
        question: 'What types of sign boards do you manufacture?',
        answer: 'We manufacture all kinds of commercial signage including 3D Acrylic Letters, LED Backlit Boards, Neon Flex Signs, ACP Cladding Boards, Stainless Steel/Brass Letters, Glow Sign Boards, and Doctor/Office Acrylic Name Plates.'
      },
      {
        question: 'How long does it take from order to installation?',
        answer: 'Typically, 3D design mockups are delivered within 24 hours. Once approved, fabrication takes 3 to 5 business days, followed by professional same-day on-site installation.'
      },
      {
        question: 'Do you provide a warranty on LED lighting and materials?',
        answer: 'Yes! We provide up to a 3-year warranty on LED modules and power supplies, and a 5-year warranty against fading or yellowing on virgin acrylic and ACP sheets.'
      },
      {
        question: 'Can you visit our shop or office for measurements?',
        answer: 'Absolutely. We offer free on-site visits across the region for accurate structural measurements, facade inspection, and electrical load checking.'
      },
      {
        question: 'How do I request a free quote and 3D mockup?',
        answer: 'Simply fill out the form above with your shop photo and dimensions, or message us directly on WhatsApp at +91 87896 40490. Our design team will respond within minutes!'
      }
    ];
    const insertFaq = db.prepare('INSERT INTO faqs (question, answer, display_order) VALUES (?, ?, ?)');
    let i = 1;
    for (const f of faqs) {
      insertFaq.run(f.question, f.answer, i++);
    }
  }

  // Initial media library records
  const mediaCount = db.prepare('SELECT COUNT(*) as count FROM media').get();
  if (mediaCount.count === 0) {
    const defaultMedia = [
      { name: 'hero_storefront.jpg', url: '/uploads/hero_storefront.jpg', type: 'image/jpeg', alt: 'Credible Light Luxury Storefront' },
      { name: 'service_3d_acrylic.jpg', url: '/uploads/service_3d_acrylic.jpg', type: 'image/jpeg', alt: '3D Acrylic Letters' },
      { name: 'service_led_boards.jpg', url: '/uploads/service_led_boards.jpg', type: 'image/jpeg', alt: 'LED Sign Boards' },
      { name: 'service_shop_office.jpg', url: '/uploads/service_shop_office.jpg', type: 'image/jpeg', alt: 'Shop & Office Signage' },
      { name: 'service_interior_branding.jpg', url: '/uploads/service_interior_branding.jpg', type: 'image/jpeg', alt: 'Interior Branding Reception' },
      { name: 'service_acp_metal.jpg', url: '/uploads/service_acp_metal.jpg', type: 'image/jpeg', alt: 'ACP Metal Boards' },
      { name: 'service_name_plates.jpg', url: '/uploads/service_name_plates.jpg', type: 'image/jpeg', alt: 'Acrylic Name Plates' },
      { name: 'quote_banner_reception.jpg', url: '/uploads/quote_banner_reception.jpg', type: 'image/jpeg', alt: 'Credible Light Reception' },
      { name: 'portfolio_spice_hub.jpg', url: '/uploads/portfolio_spice_hub.jpg', type: 'image/jpeg', alt: 'The Spice Hub Restaurant' },
      { name: 'portfolio_glam_salon.jpg', url: '/uploads/portfolio_glam_salon.jpg', type: 'image/jpeg', alt: 'Glam Beauty Lounge' },
      { name: 'portfolio_tata_office.jpg', url: '/uploads/portfolio_tata_office.jpg', type: 'image/jpeg', alt: 'Tata Corporate Office' },
      { name: 'portfolio_carewell_clinic.jpg', url: '/uploads/portfolio_carewell_clinic.jpg', type: 'image/jpeg', alt: 'CareWell MultiSpeciality Clinic' },
      { name: 'portfolio_coffee_culture.jpg', url: '/uploads/portfolio_coffee_culture.jpg', type: 'image/jpeg', alt: 'Coffee Culture Cafe' },
      { name: 'whatsapp_qr.png', url: '/uploads/whatsapp_qr.png', type: 'image/png', alt: 'Scan to WhatsApp QR Code' }
    ];
    const insertMedia = db.prepare('INSERT INTO media (file_name, file_url, file_type, file_size, alt_text) VALUES (?, ?, ?, ?, ?)');
    for (const m of defaultMedia) {
      insertMedia.run(m.name, m.url, m.type, 850000, m.alt);
    }
  }

  // Initial Gift Products
  const giftCheck = db.prepare('SELECT COUNT(*) as count FROM gift_products').get();
  if (giftCheck.count === 0) {
    const defaultGifts = [
      {
        category: 'spotify_plaque',
        name: 'Spotify Song Code & Photo Acrylic Plaque',
        slug: 'spotify-acrylic-lamp',
        tag: 'Bestseller',
        price: 1299,
        original_price: 1999,
        image_url: '/uploads/gift_spotify_plaque.jpg',
        description: 'Scannable Spotify music barcode, personal couple/family photo, customized favorite song title & artist. Mounted on solid beech wood warm LED base.',
        features: JSON.stringify(['Scannable Spotify Code', 'Cast Optical Acrylic', 'Warm LED Wooden Base', 'Free Custom Photo Printing', 'USB Powered']),
        customization_type: 'spotify',
        display_order: 1
      },
      {
        category: 'acrylic_lamp',
        name: 'Couple Infinity Heart 3D Illusion Lamp',
        slug: 'couple-infinity-lamp',
        tag: 'Romantic Favorite',
        price: 1199,
        original_price: 1799,
        image_url: '/uploads/gift_couple_infinity_lamp.jpg',
        description: 'Spectacular 3D wireframe optical illusion heart lamp custom engraved with two names and your special anniversary/wedding date.',
        features: JSON.stringify(['Precision Laser Cut', 'Two Names Engraving', 'Date Engraved on Base', 'Warm Romantic Glow', 'Low Energy 5V USB']),
        customization_type: 'lamp',
        display_order: 2
      },
      {
        category: 'neon_sign',
        name: 'Custom Handwritten Script Neon Sign',
        slug: 'custom-script-neon',
        tag: 'Trending #1',
        price: 2499,
        original_price: 3999,
        image_url: '/uploads/gift_neon_better_together.jpg',
        description: 'Custom flex LED neon sign made with your own text, wedding hashtag, or business name. Choose from 8 vibrant glowing colors and multiple fonts.',
        features: JSON.stringify(['Unbreakable Silicone Neon', '50,000 Hours Lifespan', 'Cut-to-Shape 6mm Acrylic', 'Power Adapter Included', 'Free Mounting Kit']),
        customization_type: 'neon',
        display_order: 3
      },
      {
        category: 'neon_sign',
        name: 'Good Vibes Only Neon Art Sign',
        slug: 'good-vibes-neon-sign',
        tag: 'Instagram Viral',
        price: 2199,
        original_price: 3299,
        image_url: '/uploads/gift_neon_good_vibes.jpg',
        description: 'Dual-color illuminated neon sign in vibrant pink & electric ice blue. Perfect for cafe walls, gaming setup, bedrooms, and beauty lounges.',
        features: JSON.stringify(['Dual-Color Glow', 'Silent & Touch-Cool', 'Clear Acrylic Backplate', 'Dimmer Compatible', 'Instant Wall Mount']),
        customization_type: 'neon',
        display_order: 4
      },
      {
        category: 'acrylic_lamp',
        name: 'Custom Photo Engraved 3D Acrylic Portrait Lamp',
        slug: 'photo-portrait-lamp',
        tag: 'Personalized',
        price: 1399,
        original_price: 2199,
        image_url: '/uploads/gift_spotify_plaque.jpg',
        description: 'Your favorite memories turned into an illuminated 3D laser-etched piece of art on pristine high-grade cast acrylic.',
        features: JSON.stringify(['HD Micro-Laser Etching', 'Solid Beech Wood Base', 'Touch On/Off Switch', 'Gift Box Packaging', 'Lifetime Acrylic Clarity']),
        customization_type: 'lamp',
        display_order: 5
      },
      {
        category: 'photo_block',
        name: 'Executive Acrylic LED Desk Nameplate',
        slug: 'executive-acrylic-desk-lamp',
        tag: 'Corporate & Home',
        price: 999,
        original_price: 1599,
        image_url: '/uploads/service_name_plates.jpg',
        description: 'High-class executive nameplate with warm LED slot base, frosted acrylic plaque, and laser engraved doctor/advocate/CEO title.',
        features: JSON.stringify(['Executive Crystal Finish', 'Custom Name & Designation', 'Golden Standoff / Wood Base', 'Warm Ambient Desk Glow']),
        customization_type: 'lamp',
        display_order: 6
      }
    ];

    const insertGift = db.prepare(`
      INSERT INTO gift_products (category, name, slug, tag, price, original_price, image_url, description, features, customization_type, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const g of defaultGifts) {
      insertGift.run(g.category, g.name, g.slug, g.tag, g.price, g.original_price, g.image_url, g.description, g.features, g.customization_type, g.display_order);
    }
  }
}

export default db;
