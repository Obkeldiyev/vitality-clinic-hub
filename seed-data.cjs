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
const API_BASE = 'https://aslmedline.uz/api'; // Production API
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
  
  const url = `${API_BASE}${endpoint}`;
  const headers = formData.getHeaders();
  
  if (ACCESS_TOKEN) {
    headers['access_token'] = ACCESS_TOKEN;
    headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(`API Error: ${result.message || response.statusText}`);
  }
  
  return result;
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
    {
      title_uz: "Yangi shifokorlar jamoasi",
      title_ru: "Новая команда врачей",
      title_en: "New team of doctors",
      description_uz: "Klinikamizga tajribali mutaxassislar qo'shildi",
      description_ru: "К нашей клинике присоединились опытные специалисты",
      description_en: "Experienced specialists have joined our clinic",
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

async function seedDoctors() {
  console.log('\n👨‍⚕️ Seeding Doctors...');
  
  const doctors = [
    {
      first_name: "Alisher",
      second_name: "Karimov",
      third_name: "Akmalovich",
      description: "Kardiolog, 15 yillik tajriba",
      // Add image: ./seed-images/doctor1.jpg
    },
    {
      first_name: "Dilnoza",
      second_name: "Rahimova",
      third_name: "Shavkatovna",
      description: "Nevrolog, 10 yillik tajriba",
    },
  ];
  
  for (const doctor of doctors) {
    try {
      const images = doctor.image ? [doctor.image] : [];
      delete doctor.image;
      
      await uploadWithMedia('/doctor', doctor, images);
      console.log(`✅ Created: ${doctor.first_name} ${doctor.second_name}`);
    } catch (err) {
      console.error(`❌ Failed: ${doctor.first_name} ${doctor.second_name}`, err.message);
    }
  }
}

async function seedGallery() {
  console.log('\n🖼️  Seeding Gallery...');
  
  const galleries = [
    {
      title: "Klinika interyeri",
      description: "Zamonaviy va qulay muhit",
      // Add images: ./seed-images/gallery1.jpg, ./seed-images/gallery2.jpg
    },
  ];
  
  for (const gallery of galleries) {
    try {
      const images = gallery.images ? gallery.images : [];
      delete gallery.images;
      
      await uploadWithMedia('/gallery', gallery, images);
      console.log(`✅ Created: ${gallery.title}`);
    } catch (err) {
      console.error(`❌ Failed: ${gallery.title}`, err.message);
    }
  }
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  console.log('🚀 Starting data seeding to https://aslmedline.uz...\n');
  
  try {
    // Step 1: Login
    console.log('⚠️  Please enter your admin credentials:');
    const username = 'admin'; // UPDATE THIS!
    const password = 'admin1234'; // UPDATE THIS!
    
    await login(username, password);
    
    // Step 2: Seed only news, gallery, branches, doctors
    await seedBranches();
    await seedNews();
    await seedDoctors();
    await seedGallery();
    
    console.log('\n✅ All data seeded successfully to https://aslmedline.uz!');
  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, login, seedBranches, seedNews, seedDoctors, seedGallery };
