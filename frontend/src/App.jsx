import React, { useState, useEffect } from 'react';
import LockScreen from './components/LockScreen';
import ChatInterface from './components/ChatInterface';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch User State after unlock
  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/v1/user/me');
      const userData = await res.json();
      setUser(userData);
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  if (!isAuthenticated) {
    return <LockScreen onUnlock={() => setIsAuthenticated(true)} />;
  }

  if (loading) {
    return <div className="flex h-screen w-screen bg-black text-zinc-500 items-center justify-center">Authenticating Secure Session...</div>;
  }

  return <ChatInterface user={user} onUserUpdate={handleUserUpdate} />;
}

export default App;
