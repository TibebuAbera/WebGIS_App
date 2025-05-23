const express = require('express');
const router = express.Router();
const pool = require('../db/config.js'); //import DB connection

router.get('/', async (req, res) => {
  const { table, query } = req.query;
  try {
    const result = await pool.query(
      `SELECT name, ST_Y(geom) AS lat, ST_X(geom) AS lng 
             FROM ${table} 
             WHERE name ILIKE $1 LIMIT 10`,
      [`%${query}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// This route handles the search functionality for POIs
/*router.get('/api/search', async (req, res) => {
  const category = req.query.category;
  const term = req.query.q || '';  // optional partial search text
  if (!category) {
    return res.status(400).json({ error: 'Category parameter is required' });
  }
  try {
    // Query for matching names in the given category (case-insensitive prefix match)
    const result = await pool.query(
      `SELECT id, fclass, name, ST_AsGeoJSON(geom)::json AS geometry
      FROM pois
      WHERE category = $1 AND name ILIKE $2 OR name ILIKE $3
      ORDER BY name
      LIMIT 20`, [category], [term + '%'], [`%${searchTerm}%`]
    );

    //const values = [category, term + '%'];
    //const result = await pool.query(sql, values);
    // Respond with an array of objects: {id, name, fclass}
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//----------------------------------------------------------------
app.get('/api/search', async (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }
// Validate the search term to prevent SQL injection
  const sanitizedSearchTerm = searchTerm.replace(/[^a-zA-Z0-9\s]/g, '');
  if (sanitizedSearchTerm !== searchTerm) {
    return res.status(400).json({ error: 'Invalid search term' });
  }
  // Use parameterized queries to prevent SQL injection
  
  
  try {
    const result = await pool.query(
      `SELECT id, fclass, name, ST_AsGeoJSON(geom)::json AS geometry
       FROM pois
       WHERE name ILIKE $1 AND geom IS NOT NULL`, [`%${searchTerm}%`]
    );

    const features = result.rows.map(row => ({
      type: 'Feature',
      geometry: row.geometry,
      properties: {
        id: row.id,
        name: row.name,
        fclass: row.fclass
      }
    }));

    const geojson = {
      type: 'FeatureCollection',
      features
    };

    res.json(geojson);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});*/

module.exports = router;