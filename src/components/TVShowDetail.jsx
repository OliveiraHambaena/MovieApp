import { useEffect, useState } from "react";
import { getTVShowVideos, getTVShowDetails } from "../services/api";

function TVShowDetail({ tvId, onClose }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <select>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
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
