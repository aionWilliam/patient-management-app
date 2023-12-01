import React from "react";
import { Container, Grid, Divider, Box } from "@mui/material";
import ProviderInfo from "./ProviderInfo";
import PatientTableSection from "./patientTableSection/PatientTableSection";
import AddPatientForm from "./AddPatientForm";

const MainPage = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* User Info Section */}
        <Grid item xs={12} sx={{ m: 3 }}>
          <ProviderInfo />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Patient Table */}
        <Grid item xs={8}>
          <Box sx={{ mr: 4 }}>
            <PatientTableSection />
          </Box>
        </Grid>

        {/* Add Patient Form */}
        <Grid item xs={4}>
          <Box sx={{ ml: 4 }}>
            <AddPatientForm />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainPage;
