import { getImageUrl } from "../services/tmdb";

function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const posterUrl = getImageUrl(movie.poster_path);

  return (
    <article className="movie-card">
      <div className="poster-wrap">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            loading="lazy"
          />
        ) : (
          <div className="poster-placeholder">No Poster</div>
        )}

        <button
          className={`heart-button ${isFavorite ? "saved" : ""}`}
          onClick={() => onToggleFavorite(movie)}
          aria-label={isFavorite ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        <div className="rating">
          ★ {Number(movie.vote_average || 0).toFixed(1)}
        </div>
      </div>

      <div className="movie-info">
        <h3 title={movie.title}>{movie.title}</h3>
        <p>{year}</p>
      </div>
    </article>
  );
}

export default MovieCard;