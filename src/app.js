const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { initSocket } = require('./socket');

dotenv.config();

const app = express();
const server = http.createServer(app);
initSocket(server);

// Middleware
app.use(morgan("dev"));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());

// ✅ CORS config for production
const corsOptions = {
  origin: "https://app.golabing.ai", // updated
  credentials: true,
  methods: "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization"
};
app.use(cors(corsOptions));

// ✅ Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'src/public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Serve static files
app.use('/uploads', express.static(uploadsDir));

// ✅ Health check endpoint (for ECS, ALB, uptime monitoring, etc.)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Route mounting
app.use('/api/v1/user_ms', require('./routes/user'));
app.use('/api/v1/lab_ms', require('./routes/lab'));
app.use('/api/v1/aws_ms', require('./routes/aws_service'));
app.use('/api/v1/organization_ms', require('./routes/organizations'));
app.use('/api/v1/workspace_ms', require('./routes/workspaces'));
app.use('/api/v1/cloud_slice_ms', require('./routes/cloudSliceService'));
app.use('/api/v1/vmcluster_ms', require('./routes/vmClusterService'));

module.exports = { app, server };
