import { useContext, useState } from "react";
import { WatchLaterContext } from "../context/WatchLaterContext";
import genreMap from "../utils/genreMap";
import MovieCard from "../component/MovieCard";
import toast from "react-hot-toast";
import { FolderPlus } from "lucide-react";

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
    if (sortBy === "release") return new Date(b.release_date) - new Date(a.release_date);
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
   toast.success(
  <span className="flex items-center gap-2">
    <FolderPlus className="w-5 h-5 text-yellow-400" />
    <span className="font-medium">Folder created!</span>
  </span>
);
  
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
  
  <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800/60 
                  flex items-center px-10 py-4 mb-8">
    <h1 className="flex items-center text-3xl md:text-4xl font-bold">
      <img
        src="tv-monitor.png"
        alt="TV Icon"
        className="w-8 h-8 md:w-9 md:h-9 mr-3 filter invert brightness-200"
      />
      My Watchlist
    </h1>
  </div>

  
<div className="sticky top-[64px] z-40 bg-black/70 backdrop-blur-sm px-10 py-3 border-b border-zinc-800/50">
  <div className="flex flex-wrap items-center gap-4">
    <select
      className="p-2 rounded-lg bg-zinc-900/80 text-sm border border-transparent 
                 focus:border-red-500/70 focus:ring-2 focus:ring-red-500/40 
                 outline-none transition-all duration-300"
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
    >
      <option value="recent">Recently Added</option>
      <option value="rating">Highest Rated</option>
      <option value="release">Release Date</option>
    </select>

    <div className="flex gap-2">
      <input
        type="text"
        placeholder="New Folder"
        value={newFolder}
        onChange={(e) => setNewFolder(e.target.value)}
        className="p-2 rounded-lg bg-zinc-900/80 text-sm 
                   border border-transparent 
                   focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/40 
                   outline-none transition-all duration-300 placeholder-gray-400"
      />
      <button
        onClick={addFolder}
        className="px-4 py-2 rounded-lg bg-red-600/90 text-white font-medium
                   shadow-md shadow-red-600/40
                   transition-all duration-300 ease-out
                   hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/60
                   active:scale-95"
      >
        Create
      </button>
    </div>
  </div>
</div>

{Object.entries(grouped).map(([genre, movies]) => (
  <div key={genre} className="mb-12 px-10">   
    <h2 className="text-xl font-semibold mb-3">{genre}</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
      {movies.map((movie) => (
        <div key={movie.id} className="relative group">
          <MovieCard movie={movie} />

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-end 
                                opacity-0 group-hover:opacity-100 transition-all duration-300 p-2">
                  <select
                    className="w-full text-xs p-2 rounded bg-zinc-900/80 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                               transition-all duration-300 mb-2"
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
                    className="w-full text-xs p-2 rounded bg-zinc-900/80
                               focus:outline-none focus:ring-2 focus:ring-purple-500/50
                               transition-all duration-300 placeholder-gray-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

{/* Folder Sections */}
{Object.entries(folders).map(([folderName, movies]) => (
  <div key={folderName} className="mb-12 px-10">   
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

