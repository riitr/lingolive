import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { useEffect, useState } from 'react';
import { Navigate, redirect, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './pages/Footer';
import Header from './pages/Header';
import Home from './pages/Home';

import firebaseApp from "../firebaseConfig";
import Account from './pages/Account';
import Conversations from './pages/Conversations';
import Login from "./pages/Login";

const auth = getAuth(firebaseApp);

const App: React.FC = () => {
  
  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        redirect("/");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    redirect("/login");
  };

  
  return (
    <Router>
      <div className="min-h-screen bg-[#fafafa] text-gray-900">
        {/* Navigation */}
        <Header user={user} />

        <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/conversations" element={user ? <Conversations /> : <Navigate to="/login" replace />} />
          <Route path="/account" element={user ? <Account user={user} onLogout={handleLogout}/> : <Navigate to="/login" replace />} />
          <Route path="/" element={user ? <Home  /> : <Navigate to="/login" replace />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;