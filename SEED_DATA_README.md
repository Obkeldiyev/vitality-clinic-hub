# Data Seeding Script

This script helps you upload sample data to your ASL Medline backend.

## Prerequisites

1. Install dependencies:
```bash
npm install form-data
```

2. Make sure your backend is running on `http://localhost:9007` (or update `API_BASE` in the script)

3. Have admin credentials ready

## Usage

### Step 1: Update Configuration

Edit `seed-data.js` and update:

```javascript
const API_BASE = 'http://localhost:9007'; // Your backend URL
```

And in the `main()` function:
```javascript
await login('admin', 'your_admin_password'); // Your admin credentials
```

### Step 2: (Optional) Add Images

Create a folder `seed-images/` and add sample images:
- `branch1.jpg`, `branch2.jpg` - for branches
- `news1.jpg`, `news2.jpg` - for news
- `doctor1.jpg`, `doctor2.jpg` - for doctors
- `gallery1.jpg`, `gallery2.jpg` - for gallery

Then update the script to include image paths.

### Step 3: Run the Script

```bash
node seed-data.js
```

## What Gets Seeded

- ✅ About Us (2 items)
- ✅ Statistics (4 items)
- ✅ Contacts (3 items)
- ✅ Branches (2 items)
- ✅ News (1 item)

## Customization

You can add more data by editing the arrays in each `seed*()` function:

```javascript
async function seedBranches() {
  const branches = [
    {
      title: "Your Branch Name",
      description: "Your description",
      image: "./seed-images/branch.jpg" // optional
    },
    // Add more...
  ];
  // ...
}
```

## Troubleshooting

**401 Unauthorized**: Check your admin credentials
**Connection refused**: Make sure backend is running
**Image not found**: Check image paths in `seed-images/` folder

## Production Use

For production server (e.g., `http://10.10.2.215:8086`):

```javascript
const API_BASE = 'http://10.10.2.215:8086/api';
```
