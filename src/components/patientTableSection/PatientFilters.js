import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const PatientFilters = ({ search, setSearch, filter, setFilter }) => {
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 2 }}
    >
      {/* Search by name */}
      <Grid item>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
      </Grid>

      {/* Filter by status */}
      <Grid item>
        <FormControl variant="outlined" sx={{ minWidth: 160 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Status Filter"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Inquiry">Inquiry</MenuItem>
            <MenuItem value="Onboarding">Onboarding</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Churned">Churned</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default PatientFilters;
