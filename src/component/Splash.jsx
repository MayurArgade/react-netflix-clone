function Splash({ onSelectProfile }) {
  const profiles = [
    { name: "You", avatar: "https://i.pravatar.cc/150?img=3" },
    { name: "Friend", avatar: "https://i.pravatar.cc/150?img=5" },
    { name: "Sibling", avatar: "https://i.pravatar.cc/150?img=7" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {/* Title */}
      <h1 className="text-5xl font-bold mb-12">Who&apos;s Watching?</h1>

      {/* Profile Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
        {profiles.map((p, i) => (
          <div
            key={i}
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => onSelectProfile(p)}
          >
            <img
              src={p.avatar}
              alt={p.name}
              className="w-28 h-28 rounded-md object-cover group-hover:ring-4 group-hover:ring-white group-hover:scale-105 transition-all"
            />
            <p className="mt-3 text-gray-400 group-hover:text-white text-lg">
              {p.name}
            </p>
          </div>
        ))}
      </div>

      {/* Manage Profiles */}
      <button className="mt-12 px-6 py-2 border border-gray-400 text-gray-400 text-sm uppercase tracking-widest hover:text-white hover:border-white transition">
        Manage Profiles
      </button>
    </div>
  );
}

export default Splash;
