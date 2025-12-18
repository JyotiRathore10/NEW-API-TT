const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const HRMSRotes = require('./routes/HRMSRotes');

const app = express();
const port = process.env.PORT || 5000;

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://timesheetapi-exfxf7bnb7bja5g7.centralindia-01.azurewebsites.net',
    'http://127.0.0.1:3000',
    'https://localhost:3000',
    'https://127.0.0.1:3000',
    // ✅ YOUR PRODUCTION DOMAINS
    'https://babralatstapi.intmavens.com',
    'http://babralatstapi.intmavens.com',
    'https://timesheetapi-exfxf7bnb7bja5g7.centralindia-01.azurewebsites.net',
    
    // ✅ MOBILE APP ORIGINS (Capacitor/Ionic)
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'https://localhost',
    'file://',
    'ionic://localhost:3000',
    'capacitor://localhost:3000',
    'http://ionic.localhost',
    'https://ionic.localhost',
    'capacitor://ionic.localhost',
    'https://127.0.0.1',
    'http://127.0.0.1',
    'https://10.0.2.2',
    'http://10.0.2.2',
    'https://localhost:8100',
    'http://localhost:8100',
    
    // ✅ Wildcard for subdomains
    /^https:\/\/.*\.intmavens\.com$/,
    /^https:\/\/.*\.azurewebsites\.net$/,
    /^capacitor:\/\/.*$/,
    /^ionic:\/\/.*$/
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept',
    'X-Goog-Api-Key',
    'User-Agent',
    'Cache-Control',
    'Pragma',
    'Origin',
    'Referer'
  ]
};

// Apply CORS middleware
app.use(cors(corsOptions));

// ✅ Handle preflight requests explicitly
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  console.log('🚀 Preflight OPTIONS request from:', origin);
  
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-Goog-Api-Key, User-Agent');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  res.status(200).end();
});

// ✅ REPLACE YOUR SECURITY HEADERS WITH THIS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // ✅ List of allowed origins
  const allowedOrigins = [
    'https://babralatstapi.intmavens.com',
    'http://babralatstapi.intmavens.com',
    'https://timesheetapi-exfxf7bnb7bja5g7.centralindia-01.azurewebsites.net',
    'https://timesheetapi-exfxf7bnb7bja5g7.centralindia-01.azurewebsites.net',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:8100',
    'https://localhost:8100',
    'capacitor://localhost',
    'ionic://localhost',
    'file://'
  ];
  
  // ✅ Check if origin is allowed
  const isAllowed = allowedOrigins.includes(origin) ||
    (origin && origin.match(/^https:\/\/.*\.intmavens\.com$/)) ||
    (origin && origin.match(/^https:\/\/.*\.azurewebsites\.net$/)) ||
    (origin && origin.match(/^capacitor:\/\/.*$/)) ||
    (origin && origin.match(/^ionic:\/\/.*$/)) ||
    !origin;
  
  // ✅ Set CORS headers explicitly
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-Goog-Api-Key, User-Agent, Cache-Control, Pragma');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
  
  // ✅ Security headers
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // ✅ Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    console.log('🎯 Handling OPTIONS preflight request from:', origin);
    return res.status(200).end();
  }
  
  console.log(`${req.method} ${req.path} - Origin: ${origin} - Allowed: ${isAllowed}`);
  next();
});

// Middleware to parse JSON bodies
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Add request logging middleware
app.use((req, res, next) => {
  console.log(`\n🌐 ${req.method} ${req.originalUrl}`);
  console.log('Origin:', req.headers.origin);
  next();
});

// API Routes
app.use('/auth', authRoutes);
app.use('/api', HRMSRotes);



// Serve static files from React app build (for production)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../build/index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.originalUrl 
    });
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 AstroGuru Backend Server running on http://localhost:${port}`);
    console.log(`📡 CORS enabled for multiple origins`);
    console.log(`🔒 Security headers configured`);
    console.log(`✅ Production domains: https://babralatstapi.intmavens.com`);
    
});

module.exports = app;
