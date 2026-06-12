/**
 * API Routes – RESTful endpoints for calculations, history, and data management
 */

const express = require('express');
const {
  saveCalculation,
  getRecentCalculations,
  getCalculationById,
  saveCalculationWithName,
  getSavedCalculations,
  deleteSavedCalculation,
  getAnalytics,
  clearOldCalculations,
} = require('./db');

const router = express.Router();

// ── CALCULATION ENDPOINTS ─────────────────────────────────────────────────────

/**
 * POST /api/calculate/cgpa-to-percentage
 * Convert CGPA to percentage
 */
router.post('/calculate/cgpa-to-percentage', async (req, res) => {
  const { cgpa, university = 'generic' } = req.body;
  
  if (!cgpa || cgpa < 0 || cgpa > 10) {
    return res.status(400).json({ error: 'Invalid CGPA value (0-10)' });
  }
  
  try {
    const percentage = cgpa * 9.5; // Standard Indian formula
    const id = await saveCalculation('cgpa_to_percentage', cgpa, percentage, university);
    
    res.json({
      id,
      type: 'cgpa_to_percentage',
      input: cgpa,
      output: percentage,
      university,
      formula: 'Percentage = CGPA × 9.5',
    });
  } catch (err) {
    res.status(500).json({ error: 'Calculation failed: ' + err.message });
  }
});

/**
 * POST /api/calculate/percentage-to-cgpa
 * Convert percentage to CGPA
 */
router.post('/calculate/percentage-to-cgpa', async (req, res) => {
  const { percentage, university = 'generic' } = req.body;
  
  if (!percentage || percentage < 0 || percentage > 100) {
    return res.status(400).json({ error: 'Invalid percentage value (0-100)' });
  }
  
  try {
    const cgpa = Math.round((percentage / 9.5) * 100) / 100;
    const id = await saveCalculation('percentage_to_cgpa', percentage, cgpa, university);
    
    res.json({
      id,
      type: 'percentage_to_cgpa',
      input: percentage,
      output: cgpa,
      university,
      formula: 'CGPA = Percentage ÷ 9.5',
    });
  } catch (err) {
    res.status(500).json({ error: 'Calculation failed: ' + err.message });
  }
});

/**
 * POST /api/calculate/sgpa-to-cgpa
 * Calculate average CGPA from SGPA values
 */
router.post('/calculate/sgpa-to-cgpa', async (req, res) => {
  const { sgpas = [] } = req.body;
  
  if (!Array.isArray(sgpas) || sgpas.length === 0) {
    return res.status(400).json({ error: 'Provide at least one SGPA value' });
  }
  
  const validSgpas = sgpas.filter(s => s >= 0 && s <= 10);
  if (validSgpas.length === 0) {
    return res.status(400).json({ error: 'No valid SGPA values' });
  }
  
  try {
    const cgpa = Math.round((validSgpas.reduce((a, b) => a + b) / validSgpas.length) * 100) / 100;
    const id = await saveCalculation('sgpa_to_cgpa', sgpas.length, cgpa);
    
    res.json({
      id,
      type: 'sgpa_to_cgpa',
      semesters: sgpas.length,
      sgpas: validSgpas,
      cgpa,
      average: cgpa,
    });
  } catch (err) {
    res.status(500).json({ error: 'Calculation failed: ' + err.message });
  }
});

// ── HISTORY ENDPOINTS ─────────────────────────────────────────────────────────

/**
 * GET /api/history
 * Get recent calculations
 */
router.get('/history', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  try {
    const calculations = await getRecentCalculations(limit);
    res.json({ count: calculations.length, data: calculations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history: ' + err.message });
  }
});

/**
 * GET /api/history/:id
 * Get specific calculation
 */
router.get('/history/:id', async (req, res) => {
  try {
    const calculation = await getCalculationById(req.params.id);
    
    if (!calculation) {
      return res.status(404).json({ error: 'Calculation not found' });
    }
    
    res.json(calculation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch calculation: ' + err.message });
  }
});

/**
 * POST /api/save
 * Save a calculation with a custom name
 */
router.post('/save', async (req, res) => {
  const { calculation_id, name } = req.body;
  
  if (!calculation_id || !name) {
    return res.status(400).json({ error: 'calculation_id and name required' });
  }
  
  try {
    const id = await saveCalculationWithName(calculation_id, name);
    res.json({ id, message: 'Saved successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to save: ' + err.message });
  }
});

/**
 * GET /api/saved
 * Get all saved calculations
 */
router.get('/saved', async (req, res) => {
  try {
    const saved = await getSavedCalculations();
    res.json({ count: saved.length, data: saved });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved calculations: ' + err.message });
  }
});

/**
 * DELETE /api/saved/:id
 * Delete a saved calculation
 */
router.delete('/saved/:id', async (req, res) => {
  try {
    const changed = await deleteSavedCalculation(req.params.id);
    
    if (changed === 0) {
      return res.status(404).json({ error: 'Saved calculation not found' });
    }
    
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete: ' + err.message });
  }
});

// ── ANALYTICS ENDPOINTS ───────────────────────────────────────────────────────

/**
 * GET /api/analytics
 * Get usage analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    const analytics = await getAnalytics();
    res.json({ data: analytics });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics: ' + err.message });
  }
});

/**
 * DELETE /api/cleanup
 * Clear old calculations (admin only in production)
 */
router.delete('/cleanup', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const changed = await clearOldCalculations(days);
    res.json({ message: `Deleted ${changed} old calculations` });
  } catch (err) {
    res.status(500).json({ error: 'Cleanup failed: ' + err.message });
  }
});

// ── EXPORT ENDPOINTS ──────────────────────────────────────────────────────────

/**
 * GET /api/export/csv
 * Export history as CSV
 */
router.get('/export/csv', async (req, res) => {
  try {
    const calculations = await getRecentCalculations(1000);
    
    let csv = 'ID,Type,Input,Output,University,Created At\n';
    calculations.forEach(calc => {
      csv += `${calc.id},"${calc.type}",${calc.input_value},${calc.output_value},"${calc.university || ''}","${calc.created_at}"\n`;
    });
    
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="cgpa-calculations.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Export failed: ' + err.message });
  }
});

/**
 * GET /api/export/json
 * Export history as JSON
 */
router.get('/export/json', async (req, res) => {
  try {
    const calculations = await getRecentCalculations(1000);
    res.header('Content-Type', 'application/json');
    res.header('Content-Disposition', 'attachment; filename="cgpa-calculations.json"');
    res.json({ data: calculations, exportedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Export failed: ' + err.message });
  }
});

module.exports = router;
