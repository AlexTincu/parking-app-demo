const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  if (process.env.ENV === 'development') {
    console.log(`Server running on http://localhost:${PORT}`);
  } else {
    console.log(`Server running on port ${PORT}`);
  }  
});
