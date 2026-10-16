import axios from "axios";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
const API_URL = "https://api.themoviedb.org/3";

const client = axios.create({
  baseURL: API_URL,
  params: {
    api_key: TMDB_KEY,
    language: "en-US",
  },
});

export async function getPopularMovies(page = 1) {
  const response = await client.get("/movie/popular", {
    params: { page },
  });
  return response.data;
}

export async function searchMovies(query, page = 1) {
  const response = await client.get("/search/movie", {
    params: {
      query,
      page,
      include_adult: false,
    },
  });
  return response.data;
}

export function getImageUrl(path, size = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}