import app from './app.js';

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Tours Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: http://localhost:${PORT}/api/tours`);
});
