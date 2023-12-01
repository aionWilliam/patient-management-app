import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getFunctions, httpsCallable } from "firebase/functions";

const AddPatientForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const onSubmit = async (data) => {
    setLoading(true);
    setAlert({ type: "", message: "" });

    const functions = getFunctions();
    const addPatient = httpsCallable(functions, "addPatient");

    try {
      await addPatient(data);
      setAlert({ type: "success", message: "Patient added successfully" });
      reset();
    } catch (error) {
      setAlert({ type: "error", message: "Failed to add patient" });
      console.error("Failed to create patient: ", error);
    } finally {
      setLoading(false);
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
    }
  };

  return (
    <>
      {" "}
      <Typography sx={{ mb: 2 }}>Add Patient</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="First Name"
          margin="normal"
          fullWidth
          {...register("firstName", { required: "First name is required" })}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />
        <TextField
          label="Last Name"
          margin="normal"
          fullWidth
          {...register("lastName", { required: "Last name is required" })}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />
        <TextField
          label="Address"
          margin="normal"
          fullWidth
          {...register("address")}
        />
        <TextField
          label="Date of Birth"
          margin="normal"
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true }}
          {...register("dateOfBirth", {
            required: "Date of birth is required",
          })}
          error={!!errors.dateOfBirth}
          helperText={errors.dateOfBirth?.message}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            {...register("status", { required: "Status is required" })}
            error={!!errors.status}
            defaultValue={"Inquiry"}
          >
            <MenuItem value="Inquiry">Inquiry</MenuItem>
            <MenuItem value="Onboarding">Onboarding</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Churned">Churned</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {loading ? (
            <CircularProgress color="info" size={24} />
          ) : (
            "Add Patient"
          )}
        </Button>
      </form>
      {alert.message && (
        <Alert severity={alert.type} style={{ marginTop: "20px" }}>
          {alert.message}
        </Alert>
      )}
    </>
  );
};

export default AddPatientForm;
