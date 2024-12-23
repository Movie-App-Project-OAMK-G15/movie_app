import pool from "../helpers/db.js";

// Fetch all reviews for a movie
const getReviewsByMovieId = async (movieId) => {
  const result = await pool.query('SELECT review_id AS id, user_email, review_content, rating, created_at FROM review WHERE movie_id = $1 ORDER BY created_at DESC', [movieId]);
  return result.rows;
};

// Add a new review
const addReview = async (userEmail, reviewContent, movieId, rating) => {
  const result = await pool.query(
    `INSERT INTO review (user_email, review_content, movie_id, rating, created_at) VALUES ($1, $2, $3, $4,  NOW()) 
    RETURNING review_id AS id, user_email, review_content, movie_id, rating, created_at`,
    [userEmail, reviewContent, movieId, rating]
  );
  return result.rows[0];
};

// Delete a review by ID
const deleteReview = async (reviewId, userEmail) => {
  // Ensure only the review's owner can delete the review
  const result = await pool.query(
    'DELETE FROM review WHERE review_id = $1 AND user_email = $2 RETURNING *',
    [reviewId, userEmail]
  );
  return result.rows[0];
};

// Fetch a review by ID and user email
const getReviewByIdAndUserEmail = async (reviewId, userEmail) => {
  const result = await pool.query(
    'SELECT * FROM review WHERE review_id = $1 AND user_email = $2',
    [reviewId, userEmail]
  );
  return result.rows[0];
};

// Update a review by ID
const updateReview = async (reviewId, reviewContent, rating) => {
 // try {
  const result = await pool.query(
    'UPDATE review SET review_content = $1, rating = $2, created_at = NOW() WHERE review_id = $3 RETURNING review_id AS id, user_email, review_content, movie_id, rating, created_at',
    [reviewContent, rating, reviewId]
  );
  return result.rows[0]; // Return the updated review
};

//gets all reviews
const getAllReviews = async () => {
    return pool.query('select * from review;');
 };

 //gets all reviews based on provied user's email
 const getReviewsByUserEmail = async (userEmail) => {
  const result = await pool.query(
    'SELECT * FROM review WHERE user_email = $1 ORDER BY created_at DESC',
    [userEmail]
  );
  return result.rows; // Return all reviews for the user
};

export { getReviewsByMovieId, getAllReviews, addReview, deleteReview, getReviewByIdAndUserEmail, updateReview, getReviewsByUserEmail };
