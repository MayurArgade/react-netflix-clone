import { useEffect, useState } from "react";
import { fetchMovieVideos } from "../utils/tmdb";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function HeroBanner({ movie }) {
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    async function loadTrailer() {
      const key = await fetchMovieVideos(movie.id);
      setTrailerKey(key);
    }

    if (movie?.id) loadTrailer();
  }, [movie?.id]);

  if (!movie) return null;

  return (
    <motion.div
      className="relative h-[95vh] text-white flex items-end p-12 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* Trailer background */}
      {trailerKey ? (
<motion.div
  className="absolute top-0 left-0 w-full h-full overflow-hidden hero-banner"
  initial={{ opacity: 0, scale: 1.05 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1.5, ease: "easeOut" }}
>
  <div className="relative w-full h-full">
    <iframe
      className="absolute top-0 left-0 w-[177.77vh] h-full md:w-full md:h-full"
      src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&controls=0&playlist=${trailerKey}`}
      title="Movie Trailer"
      allow="autoplay; encrypted-media"
      allowFullScreen
      frameBorder="0"
    />
  </div>
</motion.div>


      ) : (
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 backdrop-blur-[.5px] z-10 pointer-events-none" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <h1 className="text-5xl sm:text-6xl font-bold mb-4">{movie.title}</h1>
        <p className="mb-6 text-lg line-clamp-3">{movie.overview?.slice(0, 150)}...</p>
        <div className="flex gap-4">
        <button className="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-100 transition duration-300">
        ▶ Play
      </button>
      <button className="px-6 py-2 bg-white/20 text-white font-semibold border border-white/30 rounded hover:bg-white/30 transition duration-300">
        + My List
      </button>

        </div>
      </motion.div>
    </motion.div>
  );
}

export default HeroBanner;
