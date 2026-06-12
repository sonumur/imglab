# ⚡ Quick Start Guide

Get ImgLab running in 5 minutes!

## 🚀 Quick Setup

### 1. Clone or Download
```bash
# If using git
git clone https://github.com/yourusername/ImgLab.git
cd ImgLab

# Or just extract the folder and navigate to it
cd ImgLab
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
npm start

# Or for development with auto-restart:
npm install -g nodemon
nodemon server.js
```

### 4. Open in Browser
```
http://localhost:3000
```

---

## 📱 What You Get

✅ **Calculators**
- CGPA to Percentage
- Percentage to CGPA
- SGPA to CGPA

✅ **Dashboard** (`/dashboard`)
- View calculation history
- Save important calculations
- Export as CSV/JSON
- Usage analytics

✅ **REST API** (`/api/*`)
- POST calculations
- GET history
- Save/restore calculations
- Export data

---

## 🎯 Common Actions

### Convert CGPA to Percentage
1. Click "CGPA to Percentage" button on home page
2. Enter CGPA value
3. Click Calculate
4. View result and option to save

### View Dashboard
1. Go to `http://localhost:3000/dashboard`
2. See all your calculations
3. Click tabs: Recent → Saved → Analytics → Export

### Export Your Data
**As CSV:**
```bash
curl http://localhost:3000/api/export/csv > my-grades.csv
```

**As JSON:**
```bash
curl http://localhost:3000/api/export/json > my-grades.json
```

### Use the API
```bash
# Calculate CGPA to Percentage
curl -X POST http://localhost:3000/api/calculate/cgpa-to-percentage \
  -H "Content-Type: application/json" \
  -d '{"cgpa": 7.5}'

# Get recent calculations
curl http://localhost:3000/api/history?limit=10
```

---

## 🔧 Troubleshooting

### "Command not found: npm"
Install Node.js from [nodejs.org](https://nodejs.org)

### "Port 3000 already in use"
Change port:
```bash
PORT=3001 npm start
```

### "Database locked" error
Just restart the server:
```bash
npm start
```

### Show detailed output
```bash
NODE_DEBUG=* npm start
```

---

## 📚 Next Steps

1. Read [README.md](README.md) for full documentation
2. Check [API.md](API.md) for API details
3. See [DEPLOYMENT.md](DEPLOYMENT.md) to go live
4. Explore `/public` folder to customize UI

---

## 💡 Tips & Tricks

**Save a calculation:**
- In dashboard, hover over calculation → click "💾 Save"

**Search history:**
- Use browser's Find (Ctrl+F / Cmd+F) on dashboard

**Batch export:**
```bash
npm run export-all  # Not yet implemented
```

**Clear old data:**
```bash
curl -X DELETE http://localhost:3000/api/cleanup?days=30
```

---

## 🎓 Learning Resources

- **Express.js**: [expressjs.com](https://expressjs.com)
- **SQLite**: [sqlite.org](https://www.sqlite.org)
- **REST APIs**: [restfulapi.net](https://restfulapi.net)
- **JavaScript**: [mdn.org](https://developer.mozilla.org)

---

## 🤝 Contributing

Want to help? Follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-calculator`
3. Make changes and test
4. Commit: `git commit -m "Add new calculator""`
5. Push and create Pull Request

---

## 📞 Support

Stuck? Try these:
- Check [README.md](README.md)
- Read [API.md](API.md)
- Run with logs: `NODE_DEBUG=* npm start`
- Check browser console (F12 → Console tab)
- Create an issue on GitHub

---

**Happy calculating!** 🎓✨
