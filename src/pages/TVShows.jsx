import { useEffect, useState } from "react";
import { getPopularTVShows, searchTVShows } from "../services/api";
import MovieCard from "../components/MovieCard"; // Reuse MovieCard for TV shows

function TVShows() {
  const [shows, setShows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPopularTVShows()
      .then(setShows)
      .catch(() => setError("Failed to load TV shows"))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (searchQuery.trim()) {
        const results = await searchTVShows(searchQuery);
        setShows(results);
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
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="movies-grid">
          {shows.map((show) => (
            <div key={show.id}>
              <MovieCard movie={show} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TVShows;
