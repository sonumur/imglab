# 📊 ImgLab Tools – Full-Stack CGPA Calculator

A modern, production-ready full-stack web application for instant CGPA, percentage, and grade conversions for Indian university students.

## ✨ Features

### 🎯 Core Functionality
- **CGPA to Percentage**: Convert CGPA (0-10 scale) to percentage
- **Percentage to CGPA**: Convert percentage back to CGPA
- **SGPA to CGPA**: Calculate average CGPA from semester-wise SGPA values
- **Grade Calculator**: Calculate grades based on university-specific criteria

### 🗄️ Database & Storage
- **SQLite Database**: Persistent storage of all calculations
- **Calculation History**: Automatic tracking of recent calculations
- **Saved Calculations**: Mark important calculations for quick reference
- **Usage Analytics**: Track most-used calculation types
- **Auto-Cleanup**: Automatically remove old calculations after 30 days

### 📊 Dashboard
- **Statistics Overview**: Total calculations, saved items, most-used feature
- **Calculation History**: View all recent calculations with timestamps
- **Saved Items Management**: Create, view, and delete saved calculations
- **Usage Analytics**: Visual breakdown of calculation usage patterns
- **Data Export**: Download calculations as CSV or JSON

### 🔐 Security & Performance
- **Helmet.js**: Industry-standard security headers
- **GZIP Compression**: Automatic response compression
- **Body Parser**: Safe JSON/form data parsing
- **Content Security Policy**: Protection against XSS attacks
- **CORS-friendly**: Safe cross-origin requests

### 🌐 REST API
Full RESTful API for programmatic access:

```
POST   /api/calculate/cgpa-to-percentage
POST   /api/calculate/percentage-to-cgpa
POST   /api/calculate/sgpa-to-cgpa
GET    /api/history
GET    /api/saved
POST   /api/save
DELETE /api/saved/:id
GET    /api/analytics
GET    /api/export/csv
GET    /api/export/json
```

## 📦 Installation

### Requirements
- Node.js 16.0+
- npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

Server runs on `http://localhost:3000`

## 📁 Project Structure

```
.
├── server.js           # Express server & routing
├── db.js               # SQLite database management
├── routes-api.js       # RESTful API endpoints
├── package.json        # Dependencies & scripts
├── data/               # Database files (auto-created)
│   └── ImgLab.db    # SQLite database
└── public/
    ├── index.html      # Main calculator page
    ├── dashboard.html  # Analytics & history dashboard
    ├── css/
    │   ├── style.css   # Main styles
    │   └── dashboard.css # Dashboard styles
    └── js/
        └── calc.js     # Calculator logic
```

## 🔌 API Usage Examples

### Calculate CGPA to Percentage
```bash
curl -X POST http://localhost:3000/api/calculate/cgpa-to-percentage \
  -H "Content-Type: application/json" \
  -d '{"cgpa": 7.5, "university": "VTU"}'
```

**Response:**
```json
{
  "id": "uuid-string",
  "type": "cgpa_to_percentage",
  "input": 7.5,
  "output": 71.25,
  "university": "VTU",
  "formula": "Percentage = CGPA × 9.5"
}
```

### Get Calculation History
```bash
curl http://localhost:3000/api/history?limit=10
```

### Save a Calculation
```bash
curl -X POST http://localhost:3000/api/save \
  -H "Content-Type: application/json" \
  -d '{"calculation_id": "uuid", "name": "My Important Calc"}'
```

### Export Data as CSV
```bash
curl http://localhost:3000/api/export/csv > calculations.csv
```

### Export Data as JSON
```bash
curl http://localhost:3000/api/export/json > calculations.json
```

## 🎨 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Main CGPA to Percentage calculator |
| `/cgpa-to-percentage` | CGPA to % conversion |
| `/percentage-to-cgpa` | % to CGPA conversion |
| `/sgpa-to-cgpa` | SGPA to CGPA calculator |
| `/grade-calculator` | Grade calculator tool |
| `/dashboard` | Analytics & history dashboard |
| `/about` | About page |
| `/privacy-policy` | Privacy policy |

## 📊 Database Schema

### calculations
```sql
- id (TEXT): Unique identifier
- type (TEXT): Calculation type (cgpa_to_percentage, percentage_to_cgpa, etc.)
- input_value (REAL): Input numerical value
- output_value (REAL): Result numerical value
- university (TEXT): University name (optional)
- created_at (DATETIME): Creation timestamp
- updated_at (DATETIME): Update timestamp
```

### saved_calculations
```sql
- id (TEXT): Unique identifier
- name (TEXT): Custom name for saved calculation
- calculation_id (TEXT): Reference to calculations.id
- created_at (DATETIME): Creation timestamp
```

### analytics
```sql
- id (TEXT): Unique identifier
- calculation_type (TEXT): Type of calculation
- count (INTEGER): Number of times used
- last_used (DATETIME): Last usage timestamp
```

## ⚙️ Configuration

### Environment Variables
```bash
PORT=3000              # Server port (default: 3000)
NODE_ENV=development   # development or production
```

### Security Headers
Configured via Helmet.js in `server.js`:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

## 🚀 Performance

- **Compression**: GZIP for all responses
- **Caching**: Static assets cached for 30 days
- **Database**: Indexed queries for fast record retrieval
- **Response Time**: < 100ms for calculations

## 🔒 Security Features

✅ XSS Protection via CSP
✅ CSRF Prevention
✅ Helmet security headers
✅ Input validation
✅ SQL Injection protection (parameterized queries)
✅ Rate limiting ready (can be added via middleware)

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🛠️ Development

### Adding New Calculation Type

1. Add endpoint in `routes-api.js`:
```javascript
router.post('/calculate/new-type', (req, res) => {
  // Implementation
  const id = saveCalculation('new_type', input, output, university);
  res.json({ id, type: 'new_type', input, output });
});
```

2. Update database schema if needed in `db.js`

3. Add UI component in relevant HTML page

### Running with Auto-Restart
```bash
npm install -g nodemon
nodemon server.js
```

## 🐛 Troubleshooting

### Database Lock Error
```
Error: database is locked
```
**Solution**: Stop other Node processes using the database

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Change port or kill process: `lsof -i :3000`

### Missing Dependencies
```
npm install
npm install --save better-sqlite3
```

## 📈 Future Enhancements

- User authentication & accounts
- Multi-university support
- Mobile app (React Native)
- Batch calculations
- API rate limiting
- Usage notifications
- Discussion forum integration

## 📄 License

MIT License – Free to use and modify

## 👨‍💻 Support

For issues, feature requests, or contributions:
- Create an issue on GitHub
- Email: support@ImgLabindia.com

---

**Made with ❤️ for Indian Students**
