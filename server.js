const { app, server } = require('./src/app');

const PORT = process.env.PORT || 3000;  // fallback port if PORT env is missing

server.listen(PORT, (err) => {
  if (err) {
    console.error("❌ Error running api-gateway service:", err);
  } else {
    console.log(`🚀 api gateway is running on PORT: ${PORT}`);
  }
});
