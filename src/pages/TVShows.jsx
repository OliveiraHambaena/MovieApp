import { useEffect, useState } from "react";
import {
  getPopularTVShows,
  searchTVShows,
  getTVGenres,
  getTVShowsByGenre,
} from "../services/api";
import MovieCard from "../components/MovieCard";
import TVShowDetail from "../components/TVShowDetail";

function TVShows() {
  const [shows, setShows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShowId, setSelectedShowId] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    getPopularTVShows()
      .then(setShows)
      .catch(() => setError("Failed to load TV shows"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getTVGenres()
      .then(setGenres)
      .catch(() => setGenres([]));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (searchQuery.trim()) {
        const results = await searchTVShows(searchQuery);
        setShows(results);
        setSelectedGenre("");
      } else {
        const results = await getPopularTVShows();
        setShows(results);
      }
    } catch {
      setError("Failed to search TV shows");
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = async (e) => {
    const genreId = e.target.value;
    setSelectedGenre(genreId);
    setSearchQuery("");
    setLoading(true);
    setError(null);
    try {
      if (genreId) {
        const results = await getTVShowsByGenre(genreId);
        setShows(results);
      } else {
        const results = await getPopularTVShows();
        setShows(results);
      }
    } catch {
      setError("Failed to load TV shows");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tvshows">
      <h2>TV Shows</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for TV shows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
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
          {shows.map((show) => (
            <div
              key={show.id}
              onClick={() => setSelectedShowId(show.id)}
              style={{ cursor: "pointer" }}
            >
              <MovieCard movie={show} />
            </div>
          ))}
        </div>
      )}
      {selectedShowId && (
        <TVShowDetail
          tvId={selectedShowId}
          onClose={() => setSelectedShowId(null)}
        />
      )}
    </div>
  );
}

export default TVShows;
