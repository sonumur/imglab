# 🔌 ImgLab API Documentation

Complete REST API reference for ImgLab Tools backend services.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently no authentication required. Add in production via JWT or API keys.

---

## 📋 Calculation Endpoints

### Convert CGPA to Percentage
```http
POST /api/calculate/cgpa-to-percentage
Content-Type: application/json

{
  "cgpa": 7.5,
  "university": "VTU"
}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "cgpa_to_percentage",
  "input": 7.5,
  "output": 71.25,
  "university": "VTU",
  "formula": "Percentage = CGPA × 9.5"
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Invalid CGPA value (0-10)"
}
```

---

### Convert Percentage to CGPA
```http
POST /api/calculate/percentage-to-cgpa
Content-Type: application/json

{
  "percentage": 71.25,
  "university": "VTU"
}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "type": "percentage_to_cgpa",
  "input": 71.25,
  "output": 7.5,
  "university": "VTU",
  "formula": "CGPA = Percentage ÷ 9.5"
}
```

---

### Calculate CGPA from SGPAs
```http
POST /api/calculate/sgpa-to-cgpa
Content-Type: application/json

{
  "sgpas": [8.5, 7.2, 8.9, 7.8]
}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "type": "sgpa_to_cgpa",
  "semesters": 4,
  "sgpas": [8.5, 7.2, 8.9, 7.8],
  "cgpa": 8.1,
  "average": 8.1
}
```

---

## 📚 History Endpoints

### Get Recent Calculations
```http
GET /api/history?limit=10
```

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 10, max: 100)

**Response (200 OK):**
```json
{
  "count": 10,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "cgpa_to_percentage",
      "input_value": 7.5,
      "output_value": 71.25,
      "university": "VTU",
      "created_at": "2024-06-06T10:30:00Z",
      "updated_at": "2024-06-06T10:30:00Z"
    }
  ]
}
```

---

### Get Specific Calculation
```http
GET /api/history/:id
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "cgpa_to_percentage",
  "input_value": 7.5,
  "output_value": 71.25,
  "university": "VTU",
  "created_at": "2024-06-06T10:30:00Z"
}
```

**Error (404 Not Found):**
```json
{
  "error": "Calculation not found"
}
```

---

## ⭐ Saved Calculations Endpoints

### Save a Calculation
```http
POST /api/save
Content-Type: application/json

{
  "calculation_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "My Important Calculation"
}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440003",
  "message": "Saved successfully"
}
```

---

### Get All Saved Calculations
```http
GET /api/saved
```

**Response (200 OK):**
```json
{
  "count": 2,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "My Important Calculation",
      "calculation_id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "cgpa_to_percentage",
      "input_value": 7.5,
      "output_value": 71.25,
      "created_at": "2024-06-06T10:30:00Z"
    }
  ]
}
```

---

### Delete Saved Calculation
```http
DELETE /api/saved/:id
```

**Response (200 OK):**
```json
{
  "message": "Deleted successfully"
}
```

**Error (404 Not Found):**
```json
{
  "error": "Saved calculation not found"
}
```

---

## 📊 Analytics Endpoints

### Get Usage Analytics
```http
GET /api/analytics
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "calculation_type": "cgpa_to_percentage",
      "count": 45,
      "last_used": "2024-06-06T14:22:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "calculation_type": "percentage_to_cgpa",
      "count": 23,
      "last_used": "2024-06-06T13:15:00Z"
    }
  ]
}
```

---

## 📥 Export Endpoints

### Export as CSV
```http
GET /api/export/csv
```

**Response (200 OK):**
Returns a CSV file download with columns:
- ID
- Type
- Input
- Output
- University
- Created At

**Example:**
```
ID,Type,Input,Output,University,Created At
550e8400-e29b-41d4-a716-446655440000,"cgpa_to_percentage",7.5,71.25,"VTU","2024-06-06T10:30:00Z"
```

---

### Export as JSON
```http
GET /api/export/json
```

**Response (200 OK):**
Returns a JSON file download with calculation history.

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "cgpa_to_percentage",
      "input_value": 7.5,
      "output_value": 71.25,
      "university": "VTU",
      "created_at": "2024-06-06T10:30:00Z"
    }
  ],
  "exportedAt": "2024-06-06T15:45:00Z"
}
```

---

## 🧹 Maintenance Endpoints

### Clean Old Calculations
```http
DELETE /api/cleanup?days=30
```

**Query Parameters:**
- `days` (optional): Age threshold in days (default: 30)

**Response (200 OK):**
```json
{
  "message": "Deleted 5 old calculations"
}
```

*Note: Only removes calculations not marked as saved.*

---

## 🔄 Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK – Request successful |
| 400 | Bad Request – Invalid input |
| 404 | Not Found – Resource doesn't exist |
| 500 | Server Error – Internal error |

---

## 📝 Error Handling

All errors return JSON format:
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## 🔗 Integration Examples

### JavaScript/Fetch
```javascript
// Convert CGPA to Percentage
fetch('/api/calculate/cgpa-to-percentage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cgpa: 7.5, university: 'VTU' })
})
.then(r => r.json())
.then(data => console.log(data));
```

### Python/Requests
```python
import requests

response = requests.post(
  'http://localhost:3000/api/calculate/cgpa-to-percentage',
  json={'cgpa': 7.5, 'university': 'VTU'}
)
print(response.json())
```

### cURL
```bash
curl -X POST http://localhost:3000/api/calculate/cgpa-to-percentage \
  -H "Content-Type: application/json" \
  -d '{"cgpa": 7.5, "university": "VTU"}'
```

---

## 🚀 Rate Limiting (Future)

Currently no rate limiting. Recommended configuration:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per user (after auth)

---

## 📞 Support & Issues

For API issues or improvements, please report on the project's issue tracker.

**Version:** 1.0.0  
**Last Updated:** June 6, 2024
