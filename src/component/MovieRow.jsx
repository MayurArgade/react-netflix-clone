import { useRef } from "react";
import MovieCard from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

function MovieRow({ title, movies }) {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="relative mb-8">
      <h2 className="text-xl font-bold mb-3 px-2">{title}</h2>

      {/* LEFT Gradient + Arrow */}
      <div
        onClick={() => scroll("left")}
        className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center
                   bg-gradient-to-r from-black/80 to-transparent z-10
                   opacity-0 hover:opacity-100 transition cursor-pointer"
      >
        <ChevronLeft size={40} className="text-white" />
      </div>

      {/* Movies Row */}
      <div
        ref={rowRef}
        className="flex overflow-x-scroll overflow-y-visible space-x-4 scrollbar-hide scroll-smooth relative"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-52 relative">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* RIGHT Gradient + Arrow */}
      <div
        onClick={() => scroll("right")}
        className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center
                   bg-gradient-to-l from-black/80 to-transparent z-10
                   opacity-0 hover:opacity-100 transition cursor-pointer"
      >
        <ChevronRight size={40} className="text-white" />
      </div>
    </div>
  );
}

export default MovieRow;
