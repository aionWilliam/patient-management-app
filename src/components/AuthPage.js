import React, { useEffect } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../firebase";
import { auth } from "../firebase";

import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import { Typography, Container } from "@mui/material";

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

const AuthPage = ({ setIsSignedIn, isSignedIn }) => {
  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver();
  }, [setIsSignedIn]);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      {!isSignedIn ? (
        <>
          <Typography variant="h5" gutterBottom>
            Please Sign In
          </Typography>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </>
      ) : (
        <p>Welcome {auth.currentUser.displayName}! You are now signed-in!</p>
      )}
    </Container>
  );
};

export default AuthPage;
