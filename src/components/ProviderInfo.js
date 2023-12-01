import React from "react";
import { auth } from "../firebase";
import { Typography, Avatar, Grid, Button } from "@mui/material";

const ProviderInfo = () => {
  const user = auth.currentUser;

  return (
    <Grid
      container
      alignItems="center"
      //   sx={{ border: 1, borderColor: "grey.300", borderRadius: 2, p: 2 }}
    >
      {/* Avatar and User Info */}
      <Grid item xs>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Avatar
              src={user?.photoURL}
              alt={user?.displayName || "User"}
              sx={{ width: 80, height: 80 }}
            />
          </Grid>

          <Grid item>
            <Typography variant="h5">
              Welcome, {user?.displayName || "User"}
            </Typography>
            <Typography variant="h6">You are now signed in!</Typography>
          </Grid>
        </Grid>
      </Grid>

      {/* Sign-out Button */}
      <Grid item>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => auth.signOut()}
        >
          Sign out
        </Button>
      </Grid>
    </Grid>
  );
};

export default ProviderInfo;
