/**
 * ImgLab Tools – Express Server
 * Serves all static pages with proper SEO-friendly clean URLs,
 * security headers, gzip compression, and long-lived cache for assets.
 */

const express    = require('express');
const compression = require('compression');
const helmet     = require('helmet');
const bodyParser = require('body-parser');
const path       = require('path');
const fs         = require('fs');
const apiRoutes  = require('./routes-api');

const app  = express();
const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');

// ── SECURITY HEADERS ──────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'", "https://pagead2.googlesyndication.com",
                    "https://adservice.google.com", "https://www.googletagmanager.com",
                    "https://www.google-analytics.com"],
      styleSrc:    ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:     ["'self'", "https://fonts.gstatic.com"],
      imgSrc:      ["'self'", "data:", "https:"],
      frameSrc:    ["https://googleads.g.doubleclick.net", "https://tpc.googlesyndication.com"],
      connectSrc:  ["'self'", "https://www.google-analytics.com"],
    },
  },
  crossOriginEmbedderPolicy: false,  // needed for AdSense iframes
}));

// ── COMPRESSION ───────────────────────────────────────────────────────────────
app.use(compression());

// ── BODY PARSER (for JSON API requests) ────────────────────────────────────────
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ── API ROUTES (before static files) ───────────────────────────────────────────
app.use('/api', apiRoutes);

// ── STATIC FILES (long-lived cache for versioned assets) ──────────────────────
app.use('/css', express.static(path.join(PUBLIC, 'css'), { maxAge: '30d' }));
app.use('/js',  express.static(path.join(PUBLIC, 'js'),  { maxAge: '30d' }));
app.use('/images', express.static(path.join(PUBLIC, 'images'), { maxAge: '90d' }));

// ── ROOT STATIC (robots.txt, ads.txt, sitemap.xml, favicon) ──────────────────
app.use(express.static(PUBLIC, { maxAge: '1d' }));

// ── CLEAN URL ROUTES ──────────────────────────────────────────────────────────
const routes = {
  '/':                          'index.html',
  '/cgpa-to-percentage':        'cgpa-to-percentage-calculator.html',
  '/percentage-to-cgpa':        'percentage-to-cgpa/index.html',
  '/sgpa-to-cgpa':              'sgpa-to-cgpa/index.html',
  '/grade-calculator':          'grade-calculator/index.html',
  '/cgpa-percentage-table':     'cgpa-percentage-table/index.html',
  '/dashboard':                 'dashboard.html',
  '/about':                     'about/index.html',
  '/contact':                   'contact/index.html',
  '/privacy-policy':            'privacy-policy/index.html',
  '/disclaimer':                'disclaimer/index.html',
  '/blog':                      'blog/index.html',
  '/blog/cgpa-to-percentage-formula-explained': 'blog/cgpa-to-percentage-formula-explained/index.html',
  '/blog/how-to-improve-cgpa':  'blog/how-to-improve-cgpa/index.html',
  '/blog/difference-between-sgpa-and-cgpa': 'blog/difference-between-sgpa-and-cgpa/index.html',
};

Object.entries(routes).forEach(([route, file]) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(PUBLIC, file));
  });
});

// ── 404 HANDLER ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC, '404.html'), (err) => {
    if (err) res.status(404).send('<h1>404 – Page Not Found</h1><p><a href="/">Go Home</a></p>');
  });
});

// ── ERROR LOGGING ─────────────────────────────────────────────────────────────
process.on('uncaughtException', (err) => {
  console.error('\n💥 UNCAUGHT EXCEPTION!');
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('\n💥 UNHANDLED REJECTION!');
  console.error(err);
});

// ── START ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ ImgLab Tools running → http://localhost:${PORT}\n`);
  console.log('  Routes:');
  Object.keys(routes).forEach(r => console.log('   ', r));
  console.log('');
});
