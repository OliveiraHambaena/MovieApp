const API_KEY = "4373e6fe68a1c3efa51b940c67c1e1b2";
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const searchMovies = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  );
  const data = await response.json();
  return data.results;
};

export async function getGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  const data = await res.json();
  return data.genres;
}

export async function getMoviesByGenre(genreId) {
  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
  );
  const data = await res.json();
  return data.results;
}

export const getPopularTVShows = async () => {
  const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const searchTVShows = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results;
};

export async function getTVShowVideos(tvId) {
  const res = await fetch(
    `${BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}`
  );
  const data = await res.json();
  return data.results;
}
