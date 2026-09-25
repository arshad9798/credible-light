import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db, { initDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'credible-light-super-secret-key-2026';
const PORT = process.env.PORT || 5000;

// Initialize database
initDatabase();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploads statically
app.use('/uploads', express.static(uploadsDir));

// Multer storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const unique = `${base}_${Date.now()}${ext}`;
    cb(null, unique);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to extract settings dictionary
function getSettingsDict() {
  const rows = db.prepare('SELECT key, value FROM website_settings').all();
  const dict = {};
  for (const row of rows) {
    dict[row.key] = row.value;
  }
  return dict;
}

// Authentication Middleware
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
  }
}

// ==========================================
// PUBLIC APIs
// ==========================================

// Fast single bootstrap endpoint for complete site initialization
app.get('/api/public/bootstrap', (req, res) => {
  try {
    const settings = getSettingsDict();
    const services = db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC, id ASC').all();
    const categories = db.prepare('SELECT * FROM portfolio_categories ORDER BY display_order ASC').all();
    const projects = db.prepare('SELECT * FROM projects ORDER BY display_order ASC, id DESC').all();
    const beforeAfter = db.prepare('SELECT * FROM before_after WHERE is_active = 1 ORDER BY display_order ASC').all();
    const testimonials = db.prepare('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY display_order ASC').all();
    const processSteps = db.prepare('SELECT * FROM process_steps ORDER BY display_order ASC, step_number ASC').all();
    const businessStats = db.prepare('SELECT * FROM business_stats ORDER BY display_order ASC').all();
    const faqs = db.prepare('SELECT * FROM faqs WHERE is_active = 1 ORDER BY display_order ASC').all();
    const giftProducts = db.prepare('SELECT * FROM gift_products WHERE is_active = 1 ORDER BY display_order ASC').all();

    // Parse JSON features for services
    services.forEach(s => {
      try {
        s.features = JSON.parse(s.features || '[]');
      } catch (e) {
        s.features = [];
      }
    });

    // Parse JSON features for gift products
    giftProducts.forEach(g => {
      try {
        g.features = JSON.parse(g.features || '[]');
      } catch (e) {
        g.features = [];
      }
    });

    res.json({
      success: true,
      data: {
        settings,
        services,
        categories,
        projects,
        beforeAfter,
        testimonials,
        processSteps,
        businessStats,
        faqs,
        giftProducts
      }
    });
  } catch (error) {
    console.error('Bootstrap error:', error);
    res.status(500).json({ error: 'Failed to load website data' });
  }
});

// Services List
app.get('/api/public/services', (req, res) => {
  const services = db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC').all();
  services.forEach(s => {
    try {
      s.features = JSON.parse(s.features || '[]');
    } catch (e) {
      s.features = [];
    }
  });
  res.json({ success: true, data: services });
});

// Single Service by slug
app.get('/api/public/services/:slug', (req, res) => {
  const service = db.prepare('SELECT * FROM services WHERE slug = ?').get(req.params.slug);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  try {
    service.features = JSON.parse(service.features || '[]');
  } catch (e) {
    service.features = [];
  }
  const images = db.prepare('SELECT * FROM service_images WHERE service_id = ? ORDER BY display_order ASC').all(service.id);
  service.gallery = images;
  res.json({ success: true, data: service });
});

// Projects List
app.get('/api/public/projects', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM projects';
  const params = [];
  if (category && category !== 'all') {
    query += ' WHERE category_name LIKE ? OR category_id IN (SELECT id FROM portfolio_categories WHERE slug = ?)';
    params.push(`%${category}%`, category);
  }
  query += ' ORDER BY display_order ASC, id DESC';
  const projects = db.prepare(query).all(...params);
  res.json({ success: true, data: projects });
});

// Single Project by slug
app.get('/api/public/projects/:slug', (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE slug = ?').get(req.params.slug);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  const images = db.prepare('SELECT * FROM project_images WHERE project_id = ? ORDER BY display_order ASC').all(project.id);
  project.gallery = images;
  res.json({ success: true, data: project });
});

// Create Public Enquiry / Quote Request
app.post('/api/public/enquiries', upload.single('photo'), (req, res) => {
  try {
    const {
      name,
      phone,
      whatsapp,
      email,
      location,
      business_type,
      service_id,
      service_name,
      approx_size,
      budget_range,
      requirement_details
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and Phone number are required' });
    }

    let photoUrl = null;
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
      // Also register file in media library
      db.prepare(`
        INSERT INTO media (file_name, file_url, file_type, file_size, alt_text)
        VALUES (?, ?, ?, ?, ?)
      `).run(req.file.filename, photoUrl, req.file.mimetype, req.file.size, `Customer Enquiry - ${name}`);
    }

    const result = db.prepare(`
      INSERT INTO enquiries (
        customer_name, phone, whatsapp, email, city_location,
        business_type, service_id, service_name, approx_size,
        budget_range, requirement_details, uploaded_photo_url, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')
    `).run(
      name,
      phone,
      whatsapp || phone,
      email || '',
      location || '',
      business_type || '',
      service_id ? parseInt(service_id, 10) : null,
      service_name || 'General Signage Enquiry',
      approx_size || '',
      budget_range || '',
      requirement_details || '',
      photoUrl
    );

    // Generate dynamic WhatsApp reply link
    const waNumber = '918789640490';
    const waMessage = encodeURIComponent(
      `Hi Credible Light! I just submitted a quote request on your website.\n\n` +
      `👤 Name: ${name}\n` +
      `📞 Phone: ${phone}\n` +
      `🏷️ Service: ${service_name || 'Signage / Interior'}\n` +
      `📏 Approx Size: ${approx_size || 'To be measured'}\n` +
      `📍 Location: ${location || 'Local'}\n\n` +
      `Please provide a free design mockup and quotation.`
    );
    const whatsappLink = `https://wa.me/${waNumber}?text=${waMessage}`;

    res.status(201).json({
      success: true,
      enquiryId: result.lastInsertRowid,
      whatsappLink,
      message: 'Thank you! Your quotation request has been received. Our team will contact you shortly.'
    });
  } catch (error) {
    console.error('Enquiry submission error:', error);
    res.status(500).json({ error: 'Failed to submit quote request. Please try again or WhatsApp us directly.' });
  }
});

// Get Gift Products
app.get('/api/public/gift-products', (req, res) => {
  const items = db.prepare('SELECT * FROM gift_products WHERE is_active = 1 ORDER BY display_order ASC').all();
  items.forEach(g => {
    try {
      g.features = JSON.parse(g.features || '[]');
    } catch (e) {
      g.features = [];
    }
  });
  res.json({ success: true, data: items });
});

// Submit Custom Gift / Neon Sign Order
app.post('/api/public/custom-orders', upload.single('photo'), (req, res) => {
  try {
    const {
      order_type,
      product_name,
      custom_text,
      secondary_text,
      font_family,
      glow_color,
      size,
      backing_style,
      base_type,
      power_accessory,
      estimated_price,
      customer_name,
      phone,
      whatsapp,
      delivery_city
    } = req.body;

    if (!customer_name || !phone || !custom_text) {
      return res.status(400).json({ error: 'Customer Name, Phone number, and Custom Text are required' });
    }

    let photoUrl = null;
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
      db.prepare(`
        INSERT INTO media (file_name, file_url, file_type, file_size, alt_text)
        VALUES (?, ?, ?, ?, ?)
      `).run(req.file.filename, photoUrl, req.file.mimetype, req.file.size, `Custom Gift Photo - ${customer_name}`);
    }

    const priceVal = estimated_price ? parseInt(estimated_price, 10) : 1499;

    // 1. Insert into custom_orders
    const result = db.prepare(`
      INSERT INTO custom_orders (
        order_type, product_name, custom_text, secondary_text,
        font_family, glow_color, size, backing_style, base_type,
        power_accessory, uploaded_photo_url, estimated_price,
        customer_name, phone, whatsapp, delivery_city, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')
    `).run(
      order_type || 'custom_gift',
      product_name || 'Custom Neon / Acrylic Lamp',
      custom_text,
      secondary_text || '',
      font_family || 'Default',
      glow_color || 'Warm Glow',
      size || 'Standard',
      backing_style || 'Default',
      base_type || 'Wooden Base',
      power_accessory || 'Adapter Included',
      photoUrl,
      priceVal,
      customer_name,
      phone,
      whatsapp || phone,
      delivery_city || 'India'
    );

    // 2. Also register in enquiries so admin sees it in general CRM
    db.prepare(`
      INSERT INTO enquiries (
        customer_name, phone, whatsapp, city_location,
        service_name, requirement_details, uploaded_photo_url, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'New')
    `).run(
      customer_name,
      phone,
      whatsapp || phone,
      delivery_city || '',
      `[Custom Gift/Neon] ${product_name || 'Custom Order'}`,
      `Text: "${custom_text}" | Subtitle: "${secondary_text || ''}" | Font: ${font_family || ''} | Color: ${glow_color || ''} | Size: ${size || ''} | Backing/Base: ${backing_style || base_type || ''} | Est. Price: ₹${priceVal}`,
      photoUrl
    );

    // 3. Format complete detailed WhatsApp message
    const waNumber = '918789640490';
    let waText = `🛍️ *NEW CUSTOM ORDER - CREDIBLE LIGHT*\n` +
      `----------------------------------------\n` +
      `🏷️ *Product*: ${product_name || 'Custom Neon / Acrylic Gift'}\n` +
      `✍️ *Custom Text*: "${custom_text}"\n`;

    if (secondary_text && secondary_text.trim()) {
      waText += `🎵 *Song/Subtitle/Date*: ${secondary_text}\n`;
    }
    if (font_family) {
      waText += `🔤 *Font Style*: ${font_family}\n`;
    }
    if (glow_color) {
      waText += `✨ *Illumination Color*: ${glow_color}\n`;
    }
    if (size) {
      waText += `📏 *Dimensions/Size*: ${size}\n`;
    }
    if (backing_style) {
      waText += `🖼️ *Acrylic Backing*: ${backing_style}\n`;
    }
    if (base_type) {
      waText += `🪵 *Base Type*: ${base_type}\n`;
    }
    if (power_accessory) {
      waText += `⚡ *Power/Addons*: ${power_accessory}\n`;
    }
    waText += `💰 *Estimated Price*: ₹${priceVal.toLocaleString('en-IN')}\n` +
      `----------------------------------------\n` +
      `👤 *Customer*: ${customer_name}\n` +
      `📞 *Phone/WhatsApp*: ${phone}\n` +
      `📍 *Delivery City*: ${delivery_city || 'Local'}\n`;

    if (photoUrl) {
      waText += `📷 *Custom Photo*: Uploaded with order\n`;
    }

    waText += `----------------------------------------\n` +
      `Please confirm my custom order, share the digital preview & payment details!`;

    const whatsappLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

    res.status(201).json({
      success: true,
      orderId: result.lastInsertRowid,
      whatsappLink,
      message: 'Custom order created successfully! Connect with our design studio on WhatsApp.'
    });
  } catch (error) {
    console.error('Custom order error:', error);
    res.status(500).json({ error: 'Failed to create custom order. Please contact via WhatsApp directly.' });
  }
});

// ==========================================
// AUTHENTICATION APIs
// ==========================================

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username/Email and Password are required' });
  }

  const user = db.prepare('SELECT * FROM admin_users WHERE username = ? OR email = ?').get(username, username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const match = bcrypt.compareSync(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});

app.get('/api/auth/me', authenticateAdmin, (req, res) => {
  const user = db.prepare('SELECT id, username, email, role, created_at FROM admin_users WHERE id = ?').get(req.admin.id);
  res.json({ success: true, user });
});

// ==========================================
// ADMIN DASHBOARD & MANAGEMENT APIs
// ==========================================

// Dashboard KPI Stats
app.get('/api/admin/dashboard/stats', authenticateAdmin, (req, res) => {
  const totalEnquiries = db.prepare('SELECT COUNT(*) as count FROM enquiries').get().count;
  const newEnquiries = db.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'New'").get().count;
  const contactedLeads = db.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'Contacted'").get().count;
  const convertedLeads = db.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'Converted'").get().count;
  const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
  const totalServices = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
  const totalReviews = db.prepare('SELECT COUNT(*) as count FROM testimonials').get().count;

  const recentEnquiries = db.prepare('SELECT * FROM enquiries ORDER BY id DESC LIMIT 6').all();

  res.json({
    success: true,
    stats: {
      totalEnquiries,
      newEnquiries,
      contactedLeads,
      convertedLeads,
      conversionRate: totalEnquiries > 0 ? Math.round((convertedLeads / totalEnquiries) * 100) : 0,
      totalProjects,
      totalServices,
      totalReviews
    },
    recentEnquiries
  });
});

// Enquiries List & Filter
app.get('/api/admin/enquiries', authenticateAdmin, (req, res) => {
  const { status, search } = req.query;
  let query = 'SELECT * FROM enquiries';
  const params = [];
  const conditions = [];

  if (status && status !== 'All') {
    conditions.push('status = ?');
    params.push(status);
  }
  if (search) {
    conditions.push('(customer_name LIKE ? OR phone LIKE ? OR whatsapp LIKE ? OR city_location LIKE ? OR service_name LIKE ?)');
    const s = `%${search}%`;
    params.push(s, s, s, s, s);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY id DESC';

  const enquiries = db.prepare(query).all(...params);
  res.json({ success: true, data: enquiries });
});

// Update Enquiry Status & Notes
app.put('/api/admin/enquiries/:id', authenticateAdmin, (req, res) => {
  const { status, admin_notes, follow_up_date } = req.body;
  db.prepare(`
    UPDATE enquiries
    SET status = COALESCE(?, status),
        admin_notes = COALESCE(?, admin_notes),
        follow_up_date = COALESCE(?, follow_up_date),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status, admin_notes, follow_up_date, req.params.id);

  const updated = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: updated });
});

// Delete Enquiry
app.delete('/api/admin/enquiries/:id', authenticateAdmin, (req, res) => {
  db.prepare('DELETE FROM enquiries WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Enquiry deleted' });
});

// Custom Orders Admin API
app.get('/api/admin/custom-orders', authenticateAdmin, (req, res) => {
  const orders = db.prepare('SELECT * FROM custom_orders ORDER BY id DESC').all();
  res.json({ success: true, data: orders });
});

app.put('/api/admin/custom-orders/:id', authenticateAdmin, (req, res) => {
  const { status, admin_notes } = req.body;
  db.prepare(`
    UPDATE custom_orders
    SET status = COALESCE(?, status),
        admin_notes = COALESCE(?, admin_notes)
    WHERE id = ?
  `).run(status, admin_notes, req.params.id);

  const updated = db.prepare('SELECT * FROM custom_orders WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: updated });
});

// Gift Products Admin API
app.get('/api/admin/gift-products', authenticateAdmin, (req, res) => {
  const items = db.prepare('SELECT * FROM gift_products ORDER BY display_order ASC, id ASC').all();
  items.forEach(g => {
    try {
      g.features = JSON.parse(g.features || '[]');
    } catch (e) {
      g.features = [];
    }
  });
  res.json({ success: true, data: items });
});

app.post('/api/admin/gift-products', authenticateAdmin, (req, res) => {
  const { category, name, slug, tag, price, original_price, image_url, description, features, customization_type, display_order, is_active } = req.body;
  const featJson = Array.isArray(features) ? JSON.stringify(features) : (features || '[]');
  const gSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const result = db.prepare(`
    INSERT INTO gift_products (category, name, slug, tag, price, original_price, image_url, description, features, customization_type, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(category || 'acrylic_lamp', name, gSlug, tag || 'Popular', price || 1299, original_price || 1999, image_url || '/uploads/gift_spotify_plaque.jpg', description || '', featJson, customization_type || 'lamp', display_order || 0, is_active !== undefined ? is_active : 1);

  const newItem = db.prepare('SELECT * FROM gift_products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, data: newItem });
});

app.put('/api/admin/gift-products/:id', authenticateAdmin, (req, res) => {
  const { category, name, slug, tag, price, original_price, image_url, description, features, customization_type, display_order, is_active } = req.body;
  const featJson = Array.isArray(features) ? JSON.stringify(features) : (features || '[]');

  db.prepare(`
    UPDATE gift_products
    SET category = COALESCE(?, category),
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        tag = COALESCE(?, tag),
        price = COALESCE(?, price),
        original_price = COALESCE(?, original_price),
        image_url = COALESCE(?, image_url),
        description = COALESCE(?, description),
        features = COALESCE(?, features),
        customization_type = COALESCE(?, customization_type),
        display_order = COALESCE(?, display_order),
        is_active = COALESCE(?, is_active)
    WHERE id = ?
  `).run(category, name, slug, tag, price, original_price, image_url, description, featJson, customization_type, display_order, is_active, req.params.id);

  const updated = db.prepare('SELECT * FROM gift_products WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: updated });
});

app.delete('/api/admin/gift-products/:id', authenticateAdmin, (req, res) => {
  db.prepare('DELETE FROM gift_products WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Gift product deleted' });
});

// Services CRUD
app.get('/api/admin/services', authenticateAdmin, (req, res) => {
  const services = db.prepare('SELECT * FROM services ORDER BY display_order ASC, id ASC').all();
  services.forEach(s => {
    try {
      s.features = JSON.parse(s.features || '[]');
    } catch (e) {
      s.features = [];
    }
  });
  res.json({ success: true, data: services });
});

app.post('/api/admin/services', authenticateAdmin, (req, res) => {
  const { name, slug, short_description, full_description, cover_image, features, display_order, is_active } = req.body;
  const sSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const featJson = Array.isArray(features) ? JSON.stringify(features) : (features || '[]');

  const result = db.prepare(`
    INSERT INTO services (slug, name, short_description, full_description, cover_image, features, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(sSlug, name, short_description, full_description || '', cover_image || '/uploads/service_3d_acrylic.jpg', featJson, display_order || 0, is_active !== undefined ? is_active : 1);

  const newService = db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, data: newService });
});

app.put('/api/admin/services/:id', authenticateAdmin, (req, res) => {
  const { name, slug, short_description, full_description, cover_image, features, display_order, is_active } = req.body;
  const featJson = Array.isArray(features) ? JSON.stringify(features) : (features || '[]');

  db.prepare(`
    UPDATE services
    SET name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        short_description = COALESCE(?, short_description),
        full_description = COALESCE(?, full_description),
        cover_image = COALESCE(?, cover_image),
        features = COALESCE(?, features),
        display_order = COALESCE(?, display_order),
        is_active = COALESCE(?, is_active),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(name, slug, short_description, full_description, cover_image, featJson, display_order, is_active, req.params.id);

  const updated = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: updated });
});

app.delete('/api/admin/services/:id', authenticateAdmin, (req, res) => {
  db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Service deleted' });
});

// Projects CRUD
app.get('/api/admin/projects', authenticateAdmin, (req, res) => {
  const projects = db.prepare('SELECT * FROM projects ORDER BY display_order ASC, id DESC').all();
  res.json({ success: true, data: projects });
});

app.post('/api/admin/projects', authenticateAdmin, (req, res) => {
  const { title, slug, category_id, category_name, location, short_description, full_description, project_date, cover_image, is_featured, display_order } = req.body;
  const pSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const result = db.prepare(`
    INSERT INTO projects (slug, title, category_id, category_name, location, short_description, full_description, project_date, cover_image, is_featured, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(pSlug, title, category_id || 1, category_name || 'Signage', location || '', short_description || '', full_description || '', project_date || '2026', cover_image || '/uploads/portfolio_spice_hub.jpg', is_featured ? 1 : 0, display_order || 0);

  const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, data: newProject });
});

app.put('/api/admin/projects/:id', authenticateAdmin, (req, res) => {
  const { title, slug, category_id, category_name, location, short_description, full_description, project_date, cover_image, is_featured, display_order } = req.body;

  db.prepare(`
    UPDATE projects
    SET title = COALESCE(?, title),
        slug = COALESCE(?, slug),
        category_id = COALESCE(?, category_id),
        category_name = COALESCE(?, category_name),
        location = COALESCE(?, location),
        short_description = COALESCE(?, short_description),
        full_description = COALESCE(?, full_description),
        project_date = COALESCE(?, project_date),
        cover_image = COALESCE(?, cover_image),
        is_featured = COALESCE(?, is_featured),
        display_order = COALESCE(?, display_order)
    WHERE id = ?
  `).run(title, slug, category_id, category_name, location, short_description, full_description, project_date, cover_image, is_featured, display_order, req.params.id);

  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: updated });
});

app.delete('/api/admin/projects/:id', authenticateAdmin, (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Project deleted' });
});

// Categories
app.get('/api/admin/categories', authenticateAdmin, (req, res) => {
  const categories = db.prepare('SELECT * FROM portfolio_categories ORDER BY display_order ASC').all();
  res.json({ success: true, data: categories });
});

// Testimonials CRUD
app.get('/api/admin/testimonials', authenticateAdmin, (req, res) => {
  const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY display_order ASC, id ASC').all();
  res.json({ success: true, data: testimonials });
});

app.post('/api/admin/testimonials', authenticateAdmin, (req, res) => {
  const { client_name, client_role, company_name, rating, review_text, avatar_image, project_image, display_order, is_active } = req.body;
  const result = db.prepare(`
    INSERT INTO testimonials (client_name, client_role, company_name, rating, review_text, avatar_image, project_image, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(client_name, client_role, company_name || '', rating || 5, review_text, avatar_image || '/uploads/client_rohit.jpg', project_image || '/uploads/portfolio_spice_hub.jpg', display_order || 0, is_active !== undefined ? is_active : 1);

  const item = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, data: item });
});

app.put('/api/admin/testimonials/:id', authenticateAdmin, (req, res) => {
  const { client_name, client_role, company_name, rating, review_text, avatar_image, project_image, display_order, is_active } = req.body;
  db.prepare(`
    UPDATE testimonials
    SET client_name = COALESCE(?, client_name),
        client_role = COALESCE(?, client_role),
        company_name = COALESCE(?, company_name),
        rating = COALESCE(?, rating),
        review_text = COALESCE(?, review_text),
        avatar_image = COALESCE(?, avatar_image),
        project_image = COALESCE(?, project_image),
        display_order = COALESCE(?, display_order),
        is_active = COALESCE(?, is_active)
    WHERE id = ?
  `).run(client_name, client_role, company_name, rating, review_text, avatar_image, project_image, display_order, is_active, req.params.id);

  const updated = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: updated });
});

app.delete('/api/admin/testimonials/:id', authenticateAdmin, (req, res) => {
  db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Testimonial deleted' });
});

// Before / After CRUD
app.get('/api/admin/before-after', authenticateAdmin, (req, res) => {
  const list = db.prepare('SELECT * FROM before_after ORDER BY display_order ASC').all();
  res.json({ success: true, data: list });
});

app.put('/api/admin/before-after/:id', authenticateAdmin, (req, res) => {
  const { title, category, description, before_image, after_image, is_active } = req.body;
  db.prepare(`
    UPDATE before_after
    SET title = COALESCE(?, title),
        category = COALESCE(?, category),
        description = COALESCE(?, description),
        before_image = COALESCE(?, before_image),
        after_image = COALESCE(?, after_image),
        is_active = COALESCE(?, is_active)
    WHERE id = ?
  `).run(title, category, description, before_image, after_image, is_active, req.params.id);

  const updated = db.prepare('SELECT * FROM before_after WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: updated });
});

// Website Settings & SEO
app.get('/api/admin/settings', authenticateAdmin, (req, res) => {
  res.json({ success: true, data: getSettingsDict() });
});

app.put('/api/admin/settings', authenticateAdmin, (req, res) => {
  const settings = req.body;
  const updateStmt = db.prepare(`
    INSERT INTO website_settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `);

  const tx = db.transaction((items) => {
    for (const [key, value] of Object.entries(items)) {
      updateStmt.run(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  });

  tx(settings);
  res.json({ success: true, data: getSettingsDict(), message: 'Settings updated successfully' });
});

// Media Library
app.get('/api/admin/media', authenticateAdmin, (req, res) => {
  const { search } = req.query;
  let query = 'SELECT * FROM media';
  const params = [];
  if (search) {
    query += ' WHERE file_name LIKE ? OR alt_text LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }
  query += ' ORDER BY id DESC';
  const mediaList = db.prepare(query).all(...params);
  res.json({ success: true, data: mediaList });
});

app.post('/api/admin/media/upload', authenticateAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const altText = req.body.alt_text || req.file.originalname;

  const result = db.prepare(`
    INSERT INTO media (file_name, file_url, file_type, file_size, alt_text)
    VALUES (?, ?, ?, ?, ?)
  `).run(req.file.filename, fileUrl, req.file.mimetype, req.file.size, altText);

  const mediaItem = db.prepare('SELECT * FROM media WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, data: mediaItem });
});

app.delete('/api/admin/media/:id', authenticateAdmin, (req, res) => {
  const item = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id);
  if (item) {
    const filePath = path.join(uploadsDir, item.file_name);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('File delete error:', e);
      }
    }
    db.prepare('DELETE FROM media WHERE id = ?').run(req.params.id);
  }
  res.json({ success: true, message: 'Media item deleted' });
});

// Serve built frontend if available
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Start Express Server
app.listen(PORT, () => {
  console.log(`Credible Light Server running on port ${PORT}`);
});
