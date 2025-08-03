import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

import Home from "./component/Home";
import Splash from "./component/Splash";
import WatchLaterPage from "./pages/WatchLaterPage";
import { WatchLaterProvider } from "./context/WatchLaterContext";
import MovieDetails from "./pages/MovieDetails";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

function AnimatedRoutes({ profile, mood }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Home profile={profile} mood={mood} />
            </motion.div>
          }
        />
        <Route
          path="/watch-later"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <WatchLaterPage />
            </motion.div>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <MovieDetails />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [profile, setProfile] = useState(null);
  const [mood, setMood] = useState(null);

  // Sign out 
  const handleSignOut = () => {
    setProfile(null);
    setMood(null);
  };

  return (
    <WatchLaterProvider>
      <Router>
        {profile ? (
          <>
            <Navbar onMoodChange={setMood} onSignOut={handleSignOut} />
            <AnimatedRoutes profile={profile} mood={mood} />
            <Footer />
          </>
        ) : (
          <Splash onSelectProfile={setProfile} />
        )}
      </Router>
    </WatchLaterProvider>
  );
}

export default App;
