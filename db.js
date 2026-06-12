/**
 * Database Module – Load or create SQLite database for CGPA calculations
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data', 'imglab.db');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// ── INITIALIZE SCHEMA ─────────────────────────────────────────────────────────
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS calculations (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      input_value REAL NOT NULL,
      output_value REAL NOT NULL,
      university TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS saved_calculations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      calculation_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (calculation_id) REFERENCES calculations(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS analytics (
      id TEXT PRIMARY KEY,
      calculation_type TEXT UNIQUE NOT NULL,
      count INTEGER DEFAULT 1,
      last_used DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run('CREATE INDEX IF NOT EXISTS idx_calculations_type ON calculations(type)');
  db.run('CREATE INDEX IF NOT EXISTS idx_calculations_created ON calculations(created_at)');
  db.run('CREATE INDEX IF NOT EXISTS idx_saved_name ON saved_calculations(name)');
});

// ── UTILITY FUNCTIONS ─────────────────────────────────────────────────────────

const saveCalculation = (type, inputValue, outputValue, university = null) => {
  return new Promise((resolve, reject) => {
    const { v4: uuid } = require('uuid');
    const id = uuid();
    
    db.run(
      'INSERT INTO calculations (id, type, input_value, output_value, university) VALUES (?, ?, ?, ?, ?)',
      [id, type, inputValue, outputValue, university],
      function(err) {
        if (err) return reject(err);
        
        // Update analytics
        const analyticsId = uuid();
        db.run(
          `INSERT INTO analytics (id, calculation_type, count, last_used) 
           VALUES (?, ?, 1, CURRENT_TIMESTAMP)
           ON CONFLICT(calculation_type) DO UPDATE SET count = count + 1, last_used = CURRENT_TIMESTAMP`,
          [analyticsId, type],
          (err) => {
            if (err) console.warn('Analytics update warning:', err);
            resolve(id);
          }
        );
      }
    );
  });
};

const getRecentCalculations = (limit = 10) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM calculations ORDER BY created_at DESC LIMIT ?',
      [limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
};

const getCalculationById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM calculations WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const saveCalculationWithName = (calculationId, name) => {
  return new Promise((resolve, reject) => {
    const { v4: uuid } = require('uuid');
    const id = uuid();
    
    db.run(
      'INSERT INTO saved_calculations (id, name, calculation_id) VALUES (?, ?, ?)',
      [id, name, calculationId],
      (err) => {
        if (err) reject(err);
        else resolve(id);
      }
    );
  });
};

const getSavedCalculations = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT sc.*, c.* FROM saved_calculations sc
       JOIN calculations c ON sc.calculation_id = c.id
       ORDER BY sc.created_at DESC`,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
};

const deleteSavedCalculation = (savedId) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM saved_calculations WHERE id = ?', [savedId], function(err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
};

const getAnalytics = () => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM analytics ORDER BY count DESC',
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
};

const clearOldCalculations = (days = 30) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM calculations 
       WHERE datetime(created_at) < datetime('now', '-' || ? || ' days')
       AND id NOT IN (SELECT calculation_id FROM saved_calculations)`,
      [days],
      function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};

module.exports = {
  db,
  saveCalculation,
  getRecentCalculations,
  getCalculationById,
  saveCalculationWithName,
  getSavedCalculations,
  deleteSavedCalculation,
  getAnalytics,
  clearOldCalculations,
};
