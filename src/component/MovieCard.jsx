import { Link, useNavigate } from "react-router-dom";
import { useWatchLater } from "../context/WatchLaterContext";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { fetchMovieVideos } from "../utils/tmdb";

// eslint-disable-next-line no-unused-vars
function MovieCard({ movie, isWatchLaterPage = false }) {
  const { watchLater, addToWatchLater, removeFromWatchLater } = useWatchLater();
  const isSaved = watchLater.some((m) => m.id === movie.id);
  const [hovered, setHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (hovered && !trailerKey) {
      fetchMovieVideos(movie.id).then((key) => setTrailerKey(key));
    }
  }, [hovered, movie.id, trailerKey]);

  const handleClick = () => {
    if (isSaved) {
      removeFromWatchLater(movie.id);
      toast("❌ Removed from Watch Later");
    } else {
      addToWatchLater(movie);
      toast("✅ Added to Watch Later");
    }
  };

const goToCommunity = () => {
  navigate(`/movie/${movie.id}`); 
};


  return (
    <div
      className="relative group w-40 mr-4 sm:w-48 md:w-50 transition-transform duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(!hovered)}
    >
      
      {!hovered && (
        <Link to={`/movie/${movie.id}`}>
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={movie.title}
            className="rounded-md"
          />
          <p className="mt-2 text-sm font-semibold text-center">
            {movie.title || movie.name}
          </p>
        </Link>
      )}

      
{/* Hover Preview */}
{hovered && (
  <div className="hover-overlay absolute z-20 w-[300px] h-[340px] bg-zinc-900 text-white rounded-md p-3 shadow-lg scale-110 transition-all duration-300">
    {trailerKey ? (
      <iframe
        className="w-full h-40 rounded"
        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title={`${movie.title} trailer`}
      />
    ) : (
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
        alt={movie.title}
        className="w-full h-40 object-cover rounded"
      />
    )}

    <h2 className="mt-2 text-md font-bold">{movie.title}</h2>
    <p className="text-xs text-gray-300 mb-2">
      {movie.overview?.slice(0, 80)}...
    </p>

    {/* 🎬 Action buttons */}
    <div className="flex flex-wrap gap-2 mt-2">
      <button className="px-3 py-1 text-sm bg-white text-black font-bold rounded hover:bg-gray-200">
        ▶ Play
      </button>

      <button
        onClick={handleClick}
        className={`px-3 py-1 text-sm rounded font-bold transition ${
          isSaved ? "bg-green-500 text-white" : "bg-white text-black"
        }`}
      >
        {isSaved ? "✔ Saved" : "+ My List"}
      </button>

      {/* Community Button */}
      <button
        onClick={goToCommunity}
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        💬 View Community
      </button>
    </div>
  </div>
)}

    </div>
  );
}

export default MovieCard;
