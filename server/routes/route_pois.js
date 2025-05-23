const express = require('express');
const router = express.Router();
const pool = require('../db/config.js');

// Register routes dynamically
const categories = [
  'food', 'hotels', 'crafts', 'culture', 'healthcare', 'hiking',
  'services', 'shopping', 'sports', 'tourism', 'transportation', 'administration'
];

// Create a route for each category
categories.forEach(category => {
  router.get(`/${category}`, async (req, res) => { //'/food', '/hotels', etc.
    try {
      await getGeoJSON(req, res, category);
    } 
    catch (err) {
      console.error(`Error handling route /${category}:`, err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Helper function to handle DB queries for different fclass values
async function getGeoJSON(req, res, category) {
  try {
    const result = await pool.query(
        `SELECT id, fclass, name, ST_AsGeoJSON(geom)::json AS geometry
        FROM pois
        WHERE fclass = $1 AND geom IS NOT NULL`, [category]
    );

    // Check if the result is empty
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    // Map the result to GeoJSON format
    const features = result.rows.map(row => ({
      type: 'Feature',
      geometry: row.geometry,
      properties: {
        id: row.id,
        name: row.name,
        fclass: row.fclass
      }
    }));

    // Create the GeoJSON FeatureCollection
    const geojson = {
      type: 'FeatureCollection',
      features
    };

    // Send the GeoJSON response
    res.json(geojson);
    
  } 
  catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

module.exports = router;
