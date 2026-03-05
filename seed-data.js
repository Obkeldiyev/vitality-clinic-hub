/**
 * Data Seeding Script for ASL Medline Clinic
 * 
 * This script uploads sample data to the backend API
 * Run with: node seed-data.js
 * 
 * Make sure to:
 * 1. Login as admin first to get token
 * 2. Update API_BASE if needed
 * 3. Have sample images ready in ./seed-images/ folder
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Configuration
const API_BASE = 'http://localhost:9007'; // Change to your backend URL
let ACCESS_TOKEN = ''; // Will be set after login

// ============================================================================
// Helper Functions
// ============================================================================

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...options.headers,
  };
  
  if (ACCESS_TOKEN && !(options.body instanceof FormData)) {
    headers['access_token'] = ACCESS_TOKEN;
    headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
  }
  
  if (ACCESS_TOKEN && options.body instanceof FormData) {
    options.body.append('access_token', ACCESS_TOKEN);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`API Error: ${data.message || response.statusText}`);
  }
  
  return data;
}

async function login(username, password) {
  console.log('🔐 Logging in as admin...');
  const data = await request('/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  
  ACCESS_TOKEN = data.tokens.access_token;
  console.log('✅ Login successful!');
  return data;
}

async function uploadWithMedia(endpoint, data, imageFiles = []) {
  const formData = new FormData();
  
  // Add text fields
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });
  
  // Add image files
  for (const imagePath of imageFiles) {
    if (fs.existsSync(imagePath)) {
      formData.append('media', fs.createReadStream(imagePath));
    } else {
      console.warn(`⚠️  Image not found: ${imagePath}`);
    }
  }
  
  return request(endpoint, {
    method: 'POST',
    body: formData,
  });
}

// ============================================================================
// Seed Data
// ============================================================================

async function seedAboutUs() {
  console.log('\n📝 Seeding About Us...');
  
  const items = [
    {
      title_uz: "Bizning missiyamiz",
      title_ru: "Наша миссия",
      title_en: "Our Mission",
      content_uz: "Har bir bemorga yuqori sifatli tibbiy xizmat ko'rsatish va sog'lom hayot tarzini targ'ib qilish",
      content_ru: "Предоставление качественной медицинской помощи каждому пациенту и пропаганда здорового образа жизни",
      content_en: "Providing quality medical care to every patient and promoting a healthy lifestyle",
    },
    {
      title_uz: "Bizning qadriyatlarimiz",
      title_ru: "Наши ценности",
      title_en: "Our Values",
      content_uz: "Professional yondashuv, zamonaviy texnologiyalar va bemor uchun g'amxo'rlik",
      content_ru: "Профессиональный подход, современные технологии и забота о пациенте",
      content_en: "Professional approach, modern technology and patient care",
    },
  ];
  
  for (const item of items) {
    try {
      await request('/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      console.log(`✅ Created: ${item.title_en}`);
    } catch (err) {
      console.error(`❌ Failed: ${item.title_en}`, err.message);
    }
  }
}

async function seedStatistics() {
  console.log('\n📊 Seeding Statistics...');
  
  const stats = [
    { title_uz: "Tajriba", title_ru: "Опыт", title_en: "Experience", number: 15 },
    { title_uz: "Bemorlar", title_ru: "Пациенты", title_en: "Patients", number: 50000 },
    { title_uz: "Shifokorlar", title_ru: "Врачи", title_en: "Doctors", number: 100 },
    { title_uz: "Bo'limlar", title_ru: "Отделения", title_en: "Departments", number: 12 },
  ];
  
  for (const stat of stats) {
    try {
      await request('/statistics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stat),
      });
      console.log(`✅ Created: ${stat.title_en} - ${stat.number}`);
    } catch (err) {
      console.error(`❌ Failed: ${stat.title_en}`, err.message);
    }
  }
}

async function seedContacts() {
  console.log('\n📞 Seeding Contacts...');
  
  const contacts = [
    { type: "Phone", contact: "+998 71 203-90-03" },
    { type: "Email", contact: "info@aslmedline.uz" },
    { type: "Address", contact: "Tashkent, Yunusabad district, Amir Temur street 108" },
  ];
  
  for (const contact of contacts) {
    try {
      await request('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });
      console.log(`✅ Created: ${contact.type} - ${contact.contact}`);
    } catch (err) {
      console.error(`❌ Failed: ${contact.type}`, err.message);
    }
  }
}

async function seedBranches() {
  console.log('\n🏥 Seeding Branches...');
  
  const branches = [
    {
      title: "Kardiologiya markazi",
      description: "Yurak kasalliklari diagnostikasi va davolash",
      // Add image if you have: ./seed-images/branch1.jpg
    },
    {
      title: "Nevrologiya bo'limi",
      description: "Asab tizimi kasalliklari bo'yicha mutaxassislar",
    },
  ];
  
  for (const branch of branches) {
    try {
      const images = branch.image ? [branch.image] : [];
      delete branch.image;
      
      await uploadWithMedia('/branch', branch, images);
      console.log(`✅ Created: ${branch.title}`);
    } catch (err) {
      console.error(`❌ Failed: ${branch.title}`, err.message);
    }
  }
}

async function seedNews() {
  console.log('\n📰 Seeding News...');
  
  const newsItems = [
    {
      title_uz: "Yangi uskunalar keldi",
      title_ru: "Поступило новое оборудование",
      title_en: "New equipment arrived",
      description_uz: "Klinikamizga zamonaviy diagnostika uskunalari keltirildi",
      description_ru: "В нашу клинику поступило современное диагностическое оборудование",
      description_en: "Modern diagnostic equipment has arrived at our clinic",
      // Add image: ./seed-images/news1.jpg
    },
  ];
  
  for (const news of newsItems) {
    try {
      const images = news.image ? [news.image] : [];
      delete news.image;
      
      await uploadWithMedia('/news', news, images);
      console.log(`✅ Created: ${news.title_en}`);
    } catch (err) {
      console.error(`❌ Failed: ${news.title_en}`, err.message);
    }
  }
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  console.log('🚀 Starting data seeding...\n');
  
  try {
    // Step 1: Login
    await login('admin', 'your_admin_password'); // UPDATE THIS!
    
    // Step 2: Seed data
    await seedAboutUs();
    await seedStatistics();
    await seedContacts();
    await seedBranches();
    await seedNews();
    
    console.log('\n✅ All data seeded successfully!');
  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, login, seedAboutUs, seedStatistics, seedContacts, seedBranches, seedNews };
