const express = require('express')
const app = express()

// get the port from env variable
const PORT = process.env.PORT || 8080

app.use(express.static('dist'))

app.get('/health', (req, res) => {
  const response = 'ok';
  console.log('Response sent:', response); // Log the response sent to the console
  res.send(response);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server started on port ${PORT}`)
})
