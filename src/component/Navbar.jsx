import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { searchMovies } from "../utils/tmdb";   

const profiles = [
  { name: "Mayur", color: "#e50914" },
  { name: "Guest", color: "#0071eb" },
];

function Navbar({ onMoodChange, onSignOut }) {
  const [openMood, setOpenMood] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProfile, setActiveProfile] = useState(profiles[0]);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const moodRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
      if (moodRef.current && !moodRef.current.contains(e.target)) {
        setOpenMood(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Profile switch
  const handleProfileSelect = (profile) => {
    setActiveProfile(profile);
    setOpenProfile(false);
    navigate("/");
  };

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      if (!searchQuery.trim()) return;

      const results = await searchMovies(searchQuery);
      if (results.length > 0) {
        navigate(`/movie/${results[0].id}`);
      } else {
        alert("No results found 😢");
      }
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  return (
    <motion.nav
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{
        backgroundColor: scrolled ? "rgba(0,0,0,1)" : "rgba(0,0,0,0)",
        boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.7)" : "none",
      }}
      transition={{ duration: 0.4 }}
      className="fixed w-full z-50 flex items-center justify-between px-6 md:px-12 py-3"
    >
      {/* Left Section */}
      <div className="flex items-center gap-8">
        <Link to="/">
          <span className="text-red-600 font-extrabold text-3xl tracking-tight">
            NETFLIX
          </span>
        </Link>
        <div className="hidden md:flex gap-6 text-sm font-medium text-white">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/watch-later" className="hover:text-gray-300">
            Watch Later
          </Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 relative text-white">
        {/* Search */}
        <div className="relative flex items-center" ref={searchRef}>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="hover:text-gray-300"
          >
            <Search size={20} />
          </button>
          <AnimatePresence>
            {showSearch && (
              <motion.input
                key="search-input"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "15rem" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Titles, people, genres"
                className="ml-2 px-3 py-1 bg-black border border-gray-600 rounded text-sm focus:outline-none"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative flex items-center" ref={notifRef}>
          <button
            onClick={() => setOpenNotif(!openNotif)}
            className="hover:text-gray-300"
          >
            <Bell size={20} />
          </button>
          <AnimatePresence>
            {openNotif && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-64 bg-gray-900 rounded shadow-lg text-sm overflow-hidden"
              >
                <div className="px-4 py-4 pt-5 border-b border-gray-700">New</div>
                <div className="px-4 py-2 pt-5 hover:bg-gray-700">
                  No new notifications
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mood Dropdown */}
        <div className="relative" ref={moodRef}>
          <button
            onClick={() => setOpenMood(!openMood)}
            className="flex items-center gap-1 hover:text-gray-300"
          >
            Mood <ChevronDown size={16} />
          </button>
          <AnimatePresence>
            {openMood && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-40 bg-gray-900 rounded shadow-lg text-sm overflow-hidden"
              >
                {["Happy", "Sad", "Excited", "Chill"].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => {
                      onMoodChange(mood);
                      setOpenMood(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    {mood}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div
            className="w-8 h-8 rounded cursor-pointer flex items-center justify-center"
            style={{ backgroundColor: activeProfile.color }}
            onClick={() => setOpenProfile(!openProfile)}
          >
            <span className="text-xs font-bold">{activeProfile.name[0]}</span>
          </div>
          <AnimatePresence>
            {openProfile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-gray-900 rounded shadow-lg text-sm overflow-hidden"
              >
                <div className="border-b border-gray-700">
                  {profiles.map((profile, index) => (
                    <button
                      key={index}
                      onClick={() => handleProfileSelect(profile)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 w-full"
                    >
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: profile.color }}
                      ></div>
                      <span>{profile.name}</span>
                    </button>
                  ))}
                </div>
                <Link to="/manage-profiles" className="block px-4 py-2 hover:bg-gray-700">
                  Manage Profiles
                </Link>
                <Link to="/account" className="block px-4 py-2 hover:bg-gray-700">
                  Account
                </Link>
                <Link to="/help" className="block px-4 py-2 hover:bg-gray-700">
                  Help Center
                </Link>
                {/* Sign Out */}
                <button
                  onClick={onSignOut}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
