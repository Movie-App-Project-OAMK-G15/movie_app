import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUser } from "../context/useUser";
const backendLink = import.meta.env.VITE_API_URL
const tmdbKey = import.meta.env.VITE_TMDB_API_KEY

const FavMovies = () => {
  //get user from UserContext
  const { userId } = useParams();
  const { user } = useUser();
  //store favorite movies
  const [movies, setMovies] = useState([]);
  //retrieve user ID from user context

  useEffect(() => {
    fetchMovesById()
  }, []); 

  async function fetchMovesById(){
    try {
      const result = await axios.get(backendLink + `/user/favorites/${userId}`)
      const userFavMovies = result.data

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${tmdbKey}`
        }
      };
      const movieDetailsRequests = userFavMovies.map(item =>
        axios.get(`https://api.themoviedb.org/3/movie/${item.movie_id}`, options));
  
      //wait for all requests to complete
      const movieDetailsResponses = await Promise.all(movieDetailsRequests);
      //extract data from responses
      setMovies(movieDetailsResponses)
    } catch (error) {
      alert(error)
    }
  }

  return (
    <div>
      <Navbar/>
      <div className="container my-4 text-white">
        <h2 className="mb-4">My Favorite Movies</h2>
        <div className="row">
          {movies.map((movie, index) => (
            <div key={index} className="col-md-3 mb-4">
              <div className="card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.data.poster_path}`} // Movie poster image
                  className="card-img-top"
                  alt={movie.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{movie.data.title}</h5>
                  <p className="card-text">Rating: {movie.data.vote_average}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavMovies;