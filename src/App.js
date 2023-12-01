import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import AuthPage from "./components/AuthPage";
import MainPage from "./components/MainPage";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });

    return () => unregisterAuthObserver();
  }, []);

  return (
    <div className="App">
      {isSignedIn ? (
        <MainPage setIsSignedIn={setIsSignedIn} />
      ) : (
        <AuthPage
          setIsSignedIn={setIsSignedIn}
          isSignedIn={isSignedIn}
        ></AuthPage>
      )}
    </div>
  );
}

export default App;
