import React from 'react';
import { useNavigate } from 'react-router-dom';

const profiles = [
  { name: "Mayur", color: "#e50914" },
  { name: "Guest", color: "#0071eb" },
];

const WhoIsWatching = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/home"); // Go to main app
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-semibold mb-12">Who's Watching?</h1>
      <div className="flex gap-10">
        {profiles.map((profile, index) => (
          <div
            key={index}
            className="cursor-pointer flex flex-col items-center"
            onClick={handleProfileClick}
          >
            <div
              className="w-32 h-32 rounded-md"
              style={{ backgroundColor: profile.color }}
            ></div>
            <p className="mt-2">{profile.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhoIsWatching;
