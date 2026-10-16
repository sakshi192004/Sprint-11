import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { searchMovies, getPopularMovies, getImageUrl } from "./services/tmdb";
import MovieCard from "./components/MovieCard";
import Posts from "./components/Posts";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function Home({ favorites, toggleFavorite }) {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 500);
  const sentinelRef = useRef(null);

  const loadMovies = async (requestedPage, searchTerm = "") => {
    setLoading(true);
    setError("");

    try {
      const data = searchTerm
        ? await searchMovies(searchTerm, requestedPage)
        : await getPopularMovies(requestedPage);

      const results = data.results || [];

      setMovies((previous) =>
        requestedPage === 1 ? results : [...previous, ...results]
      );
      setPage(requestedPage);
      setHasMore(requestedPage < (data.total_pages || 1));
    } catch (requestError) {
      setError(requestError.message || "Unable to load movies.");
      if (requestedPage === 1) setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies(1, debouncedQuery);
  }, [debouncedQuery]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          hasMore &&
          movies.length > 0
        ) {
          loadMovies(page + 1, debouncedQuery);
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [page, loading, hasMore, debouncedQuery, movies.length]);

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">CINE-STREAM</p>
          <h1>Find your next<br /><span>great movie.</span></h1>
          <p className="hero-copy">
            Discover popular movies, search the TMDB catalog, and save your
            favorites for later.
          </p>

          <div className="search-box">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies..."
              aria-label="Search movies"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                ×
              </button>
            )}
          </div>

          {query && (
            <p className="search-status">
              Searching after 500ms pause{loading ? "..." : ""}
            </p>
          )}
        </div>
      </section>

      <section className="movie-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{query ? "SEARCH RESULTS" : "TRENDING NOW"}</p>
            <h2>{query ? `Results for "${query}"` : "Popular Movies"}</h2>
          </div>
          <span className="movie-count">{movies.length} loaded</span>
        </div>

        {error && <div className="error-box">{error}</div>}

        {!error && movies.length === 0 && !loading && (
          <div className="empty-state">No movies found. Try another search.</div>
        )}

        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favorites.some((item) => item.id === movie.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {loading && <div className="loader">Loading movies...</div>}
        <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />

        {!hasMore && movies.length > 0 && (
          <p className="end-message">You reached the end of the available results.</p>
        )}
      </section>
    </main>
  );
}

function Favorites({ favorites, toggleFavorite }) {
  return (
    <main className="favorites-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR COLLECTION</p>
          <h2>My Favorites</h2>
        </div>
        <span className="movie-count">{favorites.length} saved</span>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <h3>No favorites yet</h3>
          <p>Click the heart on a movie card to save it here.</p>
          <Link className="primary-button" to="/">Explore Movies</Link>
        </div>
      ) : (
        <div className="movie-grid">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cine-stream-favorites")) || [];
    } catch {
      return [];
    }
  });
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("cine-stream-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movie) => {
    setFavorites((previous) => {
      const exists = previous.some((item) => item.id === movie.id);
      return exists
        ? previous.filter((item) => item.id !== movie.id)
        : [...previous, movie];
    });
  };

  return (
    <>
      <header className="navbar">
        <Link className="brand" to="/">
          <span className="brand-mark">C</span>
          Cine<span>Stream</span>
        </Link>

        <nav>
          <Link className={location.pathname === "/" ? "active" : ""} to="/">
            Discover
          </Link>
          <Link
            className={location.pathname === "/favorites" ? "active" : ""}
            to="/favorites"
          >
            Favorites <span className="nav-badge">{favorites.length}</span>
          </Link>
          <Link className={location.pathname === "/posts" ? "active" : ""} to="/posts">
            Posts
          </Link>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <Home favorites={favorites} toggleFavorite={toggleFavorite} />
          }
        />
        <Route path="/posts" element={<Posts />} />
        <Route
          path="/favorites"
          element={
            <Favorites
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          }
        />
      </Routes>

      <footer>
        <p>© 2026 Cine-Stream</p>
        <p>Powered by TMDB</p>
      </footer>
    </>
  );
}

export default App;