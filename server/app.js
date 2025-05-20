const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const foodRoute = require('./routes/route_food.js');
app.use('/api/food', foodRoute); //uses route_1.js for food route

const cultureRoute = require('./routes/route_culture.js');
app.use('/api/culture', cultureRoute); 

const shoppingRoute = require('./routes/route_shopping.js');
app.use('/api/shopping', shoppingRoute); 

const tourismRoute = require('./routes/route_tourism.js');
app.use('/api/tourism', tourismRoute);

const hotelsRoute = require('./routes/route_hotels.js');
app.use('/api/hotels', hotelsRoute);

const sportsRoute = require('./routes/route_sports.js');
app.use('/api/sports', sportsRoute);

const servicesRoute = require('./routes/route_services.js');
app.use('/api/services', servicesRoute);

const cratfsRoute = require('./routes/route_crafts.js');
app.use('/api/crafts', cratfsRoute);

const administrationRoute = require('./routes/route_administration.js');
app.use('/api/administration', administrationRoute);

const healthcareRoute = require('./routes/route_healthcare.js');
app.use('/api/healthcare', healthcareRoute);

const transportationRoute = require('./routes/route_transportation.js');
app.use('/api/transportation', transportationRoute);

const hikingRoute = require('./routes/route_hiking.js');
app.use('/api/hiking', hikingRoute);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
