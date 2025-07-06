import MovieCard from "../components/MovieCard";
import MovieDetail from "../components/MovieDetail";
import { useState, useEffect } from "react";
import {
  searchMovies,
  getPopularMovies,
  getGenres,
  getMoviesByGenre,
} from "../services/api";
import "../css/Home.css";
import { useLocation } from "react-router-dom";

function Home() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
      } catch (err) {
        console.log(err);
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };

    loadPopularMovies();
  }, []);

  useEffect(() => {
    // Reset search state here
    setSearchQuery("");
    setMovies([]);
  }, [location.pathname]); // Reset when path changes

  useEffect(() => {
    // When navigating to "/", reset search and load popular movies
    if (location.pathname === "/") {
      setSearchQuery("");
      setError(null);
      setSelectedMovieId(null);
      setLoading(true);
      getPopularMovies()
        .then((popularMovies) => setMovies(popularMovies))
        .catch(() => setError("Failed to load movies..."))
        .finally(() => setLoading(false));
    }
  }, [location.pathname]);

  useEffect(() => {
    // Fetch genres on mount
    getGenres()
      .then(setGenres)
      .catch(() => setGenres([]));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);
    try {
      const searchResults = await searchMovies(searchQuery);
      setMovies(searchResults);
      setError(null);
      setSelectedGenre(""); // Clear genre filter when searching
    } catch (err) {
      console.log(err);
      setError("Failed to search movies...");
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId) => {
    setSelectedMovieId(movieId);
  };

  const handleGenreChange = async (e) => {
    const genreId = e.target.value;
    setSelectedGenre(genreId);
    setSearchQuery(""); // Clear search query if searching by genre
    setLoading(true);
    setError(null);
    try {
      if (genreId) {
        const moviesByGenre = await getMoviesByGenre(genreId);
        setMovies(moviesByGenre);
      } else {
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
      }
    } catch {
      setError("Failed to load movies...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button" disabled={loading}>
          Search
        </button>
      </form>

      <div style={{ margin: "1em 0" }}>
        <label>
          Filter by Genre:{" "}
          <select value={selectedGenre} onChange={handleGenreChange}>
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie.id)}
              style={{ cursor: "pointer" }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}

      {selectedMovieId && (
        <div className="trailer-modal">
          <MovieDetail movieId={selectedMovieId} />
          <button onClick={() => setSelectedMovieId(null)}>
            Close Trailer
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
