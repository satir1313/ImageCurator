const Pool = require('pg').Pool;
const express = require('express');
const bodyParser = require('body-parser');
const appAPI = express();
const alert = require('alert');
//const connectionString = `postgresql://smvrnygrdfsrdt:37df29b180ddee63f855129c89d1546b3889f8602d2d6aa922482d024d4be0f4@ec2-18-214-238-28.compute-1.amazonaws.com:5432/d9uj7lopimf0ls`;

const connectionString = process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const port = process.env.PORT || process.env.API_PORT;

appAPI.listen(port, () => {
  console.log(`App is running on port ${port}.`);
});



const getData = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM login_user U, image I;');
    const results = { 'results': (result) ? result.rows : null };
    res.status(200).send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

appAPI.get('/apidata', getData);


// return all images in the database
const getImages = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM image ORDER BY image_id ASC');
    const results = { 'results': (result) ? result.rows : null };
    res.status(200).send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

//return image by it's image id
const getImageById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(id);
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM image WHERE image_id = $1', [id]);
    const results = { 'results': (result) ? result.rows : null };
    res.status(200).send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}


// return all curators in the database
const getUsers = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM login_user ORDER BY id ASC');
    const results = { 'results': (result) ? result.rows : null };
    res.status(200).send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

//return curator by it's user id
const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM login_user WHERE id = $1', [id]);
    const results = { 'results': (result) ? result.rows : null };
    res.status(200).send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}


const createUser = (request, response) => {
  const { name, email } = request.body;

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getImages,
  getImageById,
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUserById
}