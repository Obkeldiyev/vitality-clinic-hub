# Data Seeding Script

This script uploads sample data to your ASL Medline backend at **https://aslmedline.uz**.

## Prerequisites

1. Install dependencies:
```bash
npm install form-data
```

2. Have admin credentials ready

## Usage

### Step 1: Update Admin Credentials

Edit `seed-data.cjs` line 245:

```javascript
const username = 'admin'; // Your admin username
const password = 'your_admin_password'; // Your admin password
```

### Step 2: Run the Script

```bash
node seed-data.cjs
```

The script will:
1. Login to https://aslmedline.uz/api
2. Upload sample data for:
   - About Us (2 items)
   - Statistics (4 items)
   - Contacts (3 items)
   - Branches (2 items)
   - News (2 items)
   - Doctors (2 items)
   - Gallery (1 item)

## Adding Images

To upload images with your data:

1. Create folder: `mkdir seed-images`
2. Add images: `branch1.jpg`, `news1.jpg`, `doctor1.jpg`, etc.
3. Update the script to include image paths:

```javascript
const newsItems = [
  {
    title_uz: "Yangi uskunalar",
    // ... other fields
    image: "./seed-images/news1.jpg" // Add this line
  },
];
```

## What Gets Seeded

✅ **About Us**: Mission and values  
✅ **Statistics**: Experience, patients, doctors, departments  
✅ **Contacts**: Phone, email, address  
✅ **Branches**: Cardiology, Neurology  
✅ **News**: Equipment, new doctors  
✅ **Doctors**: 2 sample doctors  
✅ **Gallery**: Clinic interior  

## Troubleshooting

**401 Unauthorized**: Wrong admin credentials  
**Connection refused**: Check if https://aslmedline.uz is accessible  
**ENOTFOUND**: DNS issue, check domain  
**Image upload failed**: Check image paths and file sizes
