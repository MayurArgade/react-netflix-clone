const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchPopularMovies(pages = 3) {
  let allResults = [];

  for (let i = 1; i <= pages; i++) {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${i}`);
    const data = await res.json();
    allResults = allResults.concat(data.results);
  }

  return allResults;
}
export async function fetchMovieVideos(id) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
  );
  const data = await res.json();

  const trailer = data.results.find(
    (vid) =>
      vid.site === "YouTube" &&
      (vid.type === "Trailer" || vid.type === "Teaser") &&
      vid.official === true
  );

  return trailer ? trailer.key : null;
}

// ✅ Fetch single movie details by ID
export async function fetchMovieDetails(id) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
  );
  return res.json();
}

// 🔍 Search movies by query
export async function searchMovies(query) {
  if (!query) return [];
  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US`
    );
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Error searching movies:", err);
    return [];
  }
}
