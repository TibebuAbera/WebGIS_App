const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const poiRoutes = require('./routes/geo.routes');
app.use('/api/poi', poiRoutes); //Any request to a URL that starts with '/api/poi' should be handled by the poiRoutes module.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
