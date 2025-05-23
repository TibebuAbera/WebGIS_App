const express = require('express');
const router = express.Router();
//import DB connection
const pool = require('../db/config.js'); 

//returns all point features of fclass 'food' as a GeoJSON FeatureCollection
//---------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        fclass,
        name,
        ST_AsGeoJSON(geom)::json AS geometry
      FROM pois
      WHERE fclass = 'food'
      AND geom IS NOT NULL
    `);

    const features = result.rows.map(row => ({
      type: "Feature",
      geometry: row.geometry,
      properties: {
        id: row.id,
        fclass: row.fclass,
        name: row.name
      }
    }));

    const geojson = {
      type: "FeatureCollection",
      features: features
    };

    res.json(geojson);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching POI data" });
  }
});

module.exports = router;