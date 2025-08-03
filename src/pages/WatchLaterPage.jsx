import { useContext, useState } from "react";
import { WatchLaterContext } from "../context/WatchLaterContext";
import genreMap from "../utils/genreMap";
import MovieCard from "../component/MovieCard";
import toast from "react-hot-toast";

function WatchLaterPage() {
  const { watchLater, updateTags } = useContext(WatchLaterContext);
  const [sortBy, setSortBy] = useState("recent");
  const [folders, setFolders] = useState({});
  const [newFolder, setNewFolder] = useState("");

  if (watchLater.length === 0) {
    return <p className="text-white p-6 mt-20 text-center">No movies added yet.</p>;
  }

  // Sorting logic
  const sortedMovies = [...watchLater].sort((a, b) => {
    if (sortBy === "rating") return b.vote_average - a.vote_average;
    if (sortBy === "release")
      return new Date(b.release_date) - new Date(a.release_date);
    if (sortBy === "recent") return (b.addedAt || 0) - (a.addedAt || 0);
    return 0;
  });

  // Group movies by genre
  const grouped = sortedMovies.reduce((acc, movie) => {
    const genreName = genreMap[movie.genre_ids?.[0]] || "Other";
    if (!acc[genreName]) acc[genreName] = [];
    acc[genreName].push(movie);
    return acc;
  }, {});

  // Add new folder
  const addFolder = () => {
    if (!newFolder.trim()) return;
    if (folders[newFolder]) {
      toast.error("Folder already exists!");
      return;
    }
    setFolders({ ...folders, [newFolder]: [] });
    setNewFolder("");
    toast.success("📁 Folder created!");
  };

  //  Assign movie to folder
  const addToFolder = (folderName, movie) => {
    setFolders((prev) => ({
      ...prev,
      [folderName]: [...(prev[folderName] || []), movie],
    }));
    toast.success(`✅ Added to "${folderName}"`);
  };

  return (
    <div className="px-10 py-20 bg-black min-h-screen text-white">
     <h1 className="flex items-center text-4xl font-bold mb-6">
  <img
    src="tv-monitor.png"
    alt="TV Icon"
    className="w-9 h-9 mr-3 filter invert brightness-200"
  />
  My Watchlist
</h1>


      {/* Sort dropdown */}
      <div className="flex items-center gap-4 mb-8">
        <select
          className="p-2 bg-zinc-900 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recent">Recently Added</option>
          <option value="rating">Highest Rated</option>
          <option value="release">Release Date</option>
        </select>

        {/* Folder input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New Folder"
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
            className="p-2 bg-zinc-900 rounded text-sm"
          />
          <button
            onClick={addFolder}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded"
          >
            Create
          </button>
        </div>
      </div>

      {/* Grouped by Genre */}
      {Object.entries(grouped).map(([genre, movies]) => (
        <div key={genre} className="mb-12">
          <h2 className="text-xl font-semibold mb-3">{genre}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {movies.map((movie) => (
              <div key={movie.id} className="relative group">
                <MovieCard movie={movie} />

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition p-2">
                  <select
                    className="w-full text-xs p-1 rounded bg-zinc-800 mb-1"
                    onChange={(e) => addToFolder(e.target.value, movie)}
                  >
                    <option value="">Add to Folder</option>
                    {Object.keys(folders).map((folder) => (
                      <option key={folder} value={folder}>
                        {folder}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Tags..."
                    defaultValue={movie.tags?.join(", ")}
                    onBlur={(e) => {
                      const tags = e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter((t) => t);
                      updateTags(movie.id, tags);
                      toast.success("✅ Tags updated!");
                    }}
                    className="w-full text-xs p-1 rounded bg-zinc-800"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Folder Sections */}
      {Object.entries(folders).map(([folderName, movies]) => (
        <div key={folderName} className="mb-12">
          <h2 className="text-xl font-semibold mb-3">📂 {folderName}</h2>
          {movies.length === 0 ? (
            <p className="text-sm text-zinc-400">No movies yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default WatchLaterPage;
