import { useEffect, useState } from "react";
import { getTVShowVideos, getTVShowDetails } from "../services/api";

function TVShowDetail({ tvId, onClose }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      const details = await getTVShowDetails(tvId);
      setGenres(details.genres || []);
      const videos = await getTVShowVideos(tvId);
      const trailer = videos.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      setTrailerKey(trailer ? trailer.key : null);
      setLoading(false);
    }
    fetchDetails();
  }, [tvId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="trailer-modal">
      <div>
        <strong>Genres: </strong>
        {genres.length > 0 ? (
          <div style={{ display: "inline-block", position: "relative" }}>
            <button
              onClick={() => setShowDropdown((v) => !v)}
              style={{
                padding: "0.5em 1em",
                borderRadius: "5px",
                border: "1px solid #ccc",
                background: "#f0f0f0",
                cursor: "pointer",
              }}
            >
              Select Genre
            </button>
            {showDropdown && (
              <ul
                style={{
                  position: "absolute",
                  left: 0,
                  top: "2em",
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  listStyle: "none",
                  margin: 0,
                  padding: "0.5em",
                  zIndex: 10,
                }}
              >
                {genres.map((g) => (
                  <li key={g.id} style={{ padding: "0.25em 0" }}>
                    {g.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          "No genres found."
        )}
      </div>
      {trailerKey ? (
        <iframe
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${trailerKey}`}
          title="TV Show Trailer"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ) : (
        <div>No trailer found.</div>
      )}
      <button onClick={onClose}>Close Trailer</button>
    </div>
  );
}

export default TVShowDetail;
