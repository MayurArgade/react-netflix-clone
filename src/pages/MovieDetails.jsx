import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../utils/tmdb";
import { ArrowUp, ArrowDown, MessageCircle } from "lucide-react";

const colors = ["text-red-400", "text-blue-400", "text-green-400", "text-purple-400", "text-pink-400"];
const badges = ["⭐ OG", "🎉 Top Fan", "🍿 Critic"];

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ratings
  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem(`ratings-${id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [userRating, setUserRating] = useState(null);

  // Comments 
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem(`comments-${id}`);
    if (saved) {
      return JSON.parse(saved).map((c) => ({
        ...c,
        reactions: c.reactions || { fire: 0, lol: 0, sad: 0, like: 0 },
        replies: c.replies || [],
      }));
    }
    return [];
  });

  const [newComment, setNewComment] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await fetchMovieDetails(id);
      setMovie(data);
      setLoading(false);
    }
    load();
  }, [id]);

  // Ratings
  const handleRating = (rating) => {
    const updated = [...ratings, rating];
    setRatings(updated);
    setUserRating(rating);
    localStorage.setItem(`ratings-${id}`, JSON.stringify(updated));
  };

  const avgRating =
    ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : "No ratings yet";

  // Comments func
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomBadge = Math.random() > 0.7 ? badges[Math.floor(Math.random() * badges.length)] : null;

    const updated = [
      ...comments,
      {
        id: Date.now(),
        user: "User" + Math.floor(Math.random() * 1000),
        color: randomColor,
        badge: randomBadge,
        text: newComment,
        date: new Date(),
        spoiler: isSpoiler,
        votes: 0,
        replies: [],
        reactions: { fire: 0, lol: 0, sad: 0, like: 0 },
      },
    ];

    setComments(updated);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updated));
    setNewComment("");
    setIsSpoiler(false);
  };

  //  Voting
  const handleVote = (commentId, type) => {
    const updated = comments.map((c) =>
      c.id === commentId ? { ...c, votes: c.votes + (type === "up" ? 1 : -1) } : c
    );
    setComments(updated);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updated));
  };

  // Reactions
  const handleReaction = (commentId, emoji) => {
    const updated = comments.map((c) =>
      c.id === commentId
        ? { ...c, reactions: { ...c.reactions, [emoji]: (c.reactions?.[emoji] || 0) + 1 } }
        : c
    );
    setComments(updated);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updated));
  };

  // Reply
  const handleReply = (commentId, replyText) => {
    if (!replyText.trim()) return;
    const updated = comments.map((c) =>
      c.id === commentId
        ? {
            ...c,
            replies: [
              ...c.replies,
              { text: replyText, date: new Date(), user: "Guest" + Math.floor(Math.random() * 500) },
            ],
          }
        : c
    );
    setComments(updated);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updated));
  };

  // Sort comments by votes
  const sortedComments = [...comments].sort((a, b) => b.votes - a.votes);

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="p-6 pt-20 bg-[#141414] min-h-screen text-white">
      {/* Movie Info */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-60 rounded"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="mb-4 text-gray-300">{movie.overview}</p>
          <p className="text-gray-400">
            TMDB ⭐ {movie.vote_average} | 📅 {movie.release_date}
          </p>

          {/* Ratings */}
          <div className="mt-4">
            <p className="font-bold">Your Rating:</p>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`text-2xl ${
                    userRating >= star ? "text-yellow-400" : "text-gray-500"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="mt-2">⭐ Average User Rating: {avgRating}</p>
          </div>
        </div>
      </div>

      {/* Community */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">💬 Community Discussion</h2>

        {/*Comment Box */}
        <div className="mb-4">
          <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-3 rounded-xl bg-zinc-900/60 text-white border border-transparent 
          focus:border-red-500/80 focus:ring-2 focus:ring-red-500/40 
          outline-none backdrop-blur-md 
          transition-all duration-300 placeholder-gray-500
          hover:scale-[1.01] hover:border-red-500/50"
          />

        <div className="flex items-center gap-4 mt-2">
          {/* Spoiler Toggle */}
          <div className="flex items-center gap-2">
            <div
              onClick={() => setIsSpoiler(!isSpoiler)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300
                ${isSpoiler ? "bg-red-500/80" : "bg-gray-600/60"} 
              `}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all duration-300
                  ${isSpoiler ? "translate-x-6" : "translate-x-0"}
                `}
              />
            </div>
            <span className="text-sm text-gray-300 select-none">
              {isSpoiler ? "⚠️ Spoiler ON" : "Spoiler"}
            </span>
          </div>

          {/* Post Button */}
          <button
            onClick={handleAddComment}
            className="px-5 py-2 rounded-lg bg-red-600/90 text-white font-medium
                       shadow-md shadow-red-600/40
                       transition-all duration-300 ease-out
                       hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/60
                       active:scale-95"
          >
            Post
          </button>
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        {sortedComments.map((c) => (
          <div
            key={c.id}
            className="bg-zinc-800 p-3 rounded hover:bg-zinc-700 transition flex gap-3"
          >
            {/* Voting */}
            <div className="flex flex-col items-center text-gray-400">
              <button onClick={() => handleVote(c.id, "up")} className="hover:text-green-400">
                <ArrowUp size={20} />
              </button>
              <span className="text-sm font-bold">{c.votes}</span>
              <button onClick={() => handleVote(c.id, "down")} className="hover:text-red-400">
                <ArrowDown size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <p className={`font-bold ${c.color}`}>
                {c.user}{" "}
                {c.badge && <span className="ml-2 text-xs bg-red-600 px-2 py-1 rounded">{c.badge}</span>}
              </p>

              {c.spoiler ? (
                <details>
                  <summary className="cursor-pointer text-red-400">
                    ⚠️ Spoiler (click to reveal)
                  </summary>
                  <p className="mt-1">{c.text}</p>
                </details>
              ) : (
                <p className="mt-1">{c.text}</p>
              )}

              <span className="text-xs text-gray-400 block mt-1">
                {new Date(c.date).toLocaleString()}
              </span>

              {/* Reactions */}
              <div className="flex gap-2 mt-2 text-sm">
                <button onClick={() => handleReaction(c.id, "fire")}>🔥 {c.reactions?.fire || 0}</button>
                <button onClick={() => handleReaction(c.id, "lol")}>😂 {c.reactions?.lol || 0}</button>
                <button onClick={() => handleReaction(c.id, "sad")}>😢 {c.reactions?.sad || 0}</button>
                <button onClick={() => handleReaction(c.id, "like")}>👍 {c.reactions?.like || 0}</button>
              </div>

              {/* Replies */}
              <details className="mt-2">
                <summary className="cursor-pointer flex items-center gap-1 text-sm text-blue-400">
                  <MessageCircle size={14} /> Reply
                </summary>
                <div className="mt-2">
                  <ReplyForm onReply={(txt) => handleReply(c.id, txt)} />
                  {c.replies?.map((r, idx) => (
                    <p key={idx} className="ml-4 text-gray-300 text-sm mt-1">
                      <span className="font-semibold text-blue-400">{r.user}: </span>
                      {r.text}
                    </p>
                  ))}
                </div>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}

// Reply 
function ReplyForm({ onReply }) {
  const [reply, setReply] = useState("");
  return (
    <div className="flex gap-2 mt-2">
      <input
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="💭 Write a reply..."
        className="flex-1 p-2 rounded-lg bg-zinc-900/60 text-white text-sm 
                  border border-transparent 
                  focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/40 
                  outline-none backdrop-blur-md 
                  transition-all duration-300 placeholder-gray-400
                  hover:scale-[1.01]"
      />
      <button
        onClick={() => {
          onReply(reply);
          setReply("");
        }}
        className="px-2 py-1 bg-red-600 rounded text-sm hover:bg-red-700"
      >
        Send
      </button>
    </div>
  );
}

export default MovieDetails;
