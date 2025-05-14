/* 

API endpoints like /api/geojson

*/

const express = require('express');
const router = express.Router();
const pool = require('../db/config.js'); //import DB connection

// Example: Get all POIs as GeoJSON
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT jsonb_build_object(
	  'type', 'FeatureCollection',
	  'features', jsonb_agg(
		jsonb_build_object(
		  'type', 'Feature',
		  'geometry', ST_AsGeoJSON(geom)::jsonb,
		  'properties', to_jsonb(t) - 'geom'
		)
	  )
	) AS geojson
	FROM bat_webgis.poi_stuttgart_1 t;
    `);
    res.json(result.rows);
  } 
  catch (err) {
    console.error(err.message);
    res.status(500).send("Error retrieving POIs");
  }
});

module.exports = router;
