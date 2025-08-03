import { useEffect, useState } from "react";
import { fetchPopularMovies } from "../utils/tmdb";
import genreMap from "../utils/genreMap";
import MovieRow from "./MovieRow";
import Navbar from "./Navbar";
import HeroBanner from "./HeroBanner";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    async function loadMovies() {
      try {
        const results = await fetchPopularMovies(5);
        setMovies(results);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, []);

  const moodGenres = {
    Happy: ["Comedy", "Family", "Animation", "Music"],
    Dark: ["Horror", "Thriller", "Mystery", "Crime"],
    Sad: ["Drama", "Romance", "War"],
    Action: ["Action", "Adventure", "Science Fiction"],
    Chill: ["Documentary", "TV Movie", "Fantasy"],
    Classic: ["History", "Drama", "Western"],
    Suspense: ["Mystery", "Thriller", "Crime"],
    Romantic: ["Romance", "Drama"],
    Funny: ["Comedy"],
  };

  const getFilteredMovies = (genres) => {
    const base = movies;
    if (selectedMood) {
      const moodGenresList = moodGenres[selectedMood] || [];
      return base.filter((movie) =>
        movie.genre_ids?.some((id) => moodGenresList.includes(genreMap[id]))
      );
    }
    return base.filter((movie) =>
      movie.genre_ids?.some((id) => genres.includes(genreMap[id]))
    );
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="bg-zinc-900 min-h-screen text-white">
      {/* Navbar */}
      <Navbar onMoodChange={setSelectedMood} />

      {/* Hero Section */}
      <HeroBanner movie={movies[0]} />

      {/* Rows */}
      <div className="p-6 space-y-12">
        <MovieRow title="Popular Now 🔥" movies={getFilteredMovies(["Action", "Drama", "Comedy"])} />
        <MovieRow title="Romantic 💕" movies={getFilteredMovies(["Romance", "Drama"])} />
        <MovieRow title="Action & Adventure ⚔️" movies={getFilteredMovies(["Action", "Adventure", "Science Fiction"])} />
        <MovieRow title="Dark & Thrilling 🕶️" movies={getFilteredMovies(["Horror", "Thriller", "Mystery", "Crime"])} />
        <MovieRow title="Family & Fun 👨‍👩‍👧" movies={getFilteredMovies(["Comedy", "Family", "Animation"])} />
      </div>
    </div>
  );
}

export default Home;
