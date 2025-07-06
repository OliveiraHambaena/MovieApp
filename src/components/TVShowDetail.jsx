import { useEffect, useState } from "react";
import { getTVShowVideos } from "../services/api";

function TVShowDetail({ tvId, onClose }) {
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    getTVShowVideos(tvId).then((videos) => {
      const trailer = videos.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      setTrailerKey(trailer ? trailer.key : null);
    });
  }, [tvId]);

  return (
    <div className="trailer-modal">
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
