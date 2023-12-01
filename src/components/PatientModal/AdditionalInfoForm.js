import React, { useState, useReducer, useEffect } from "react";
import {
  TextField,
  Box,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { getFunctions, httpsCallable } from "firebase/functions";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE_FORM":
      return { formData: action.payload };

    case "UPDATE_FIELD":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.field]: action.payload.value,
        },
      };

    case "REMOVE_FIELD":
      const newState = { ...state };
      delete newState.formData[action.payload]; // Remove the field from formData
      return newState;

    default:
      return state;
  }
};

const AdditionalInfoForm = ({ patient }) => {
  const [state, dispatch] = useReducer(formReducer, { formData: {} });
  const [newEntryName, setNewEntryName] = useState("");
  const functions = getFunctions();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchAdditionalInfo = async () => {
      if (patient) {
        try {
          const fetchInfo = httpsCallable(functions, "fetchAdditionalInfo");
          const result = await fetchInfo({ patientId: patient.id });

          dispatch({
            type: "INITIALIZE_FORM",
            payload: result.data.additionalInfo,
          });
        } catch (error) {
          console.error("Error fetching additional info:", error);
        }
      }
    };

    fetchAdditionalInfo();
  }, [patient, functions]);

  const handleFormSave = async () => {
    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      const saveInfo = httpsCallable(functions, "saveAdditionalInfo");

      await saveInfo({
        patientId: patient.id,
        additionalInfo: state.formData,
      });

      setAlert({
        type: "success",
        message: "Additional info saved successfully",
      });
    } catch (error) {
      setAlert({ type: "error", message: "Error saving additional info" });
      console.error("Error saving additional info:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
    }
  };

  const handleAddNewEntry = () => {
    if (newEntryName && !state.formData.hasOwnProperty(newEntryName)) {
      dispatch({
        type: "UPDATE_FIELD",
        payload: { field: newEntryName, value: "" },
      });
      setNewEntryName("");
    }
  };

  const handleRemoveField = (field) => {
    dispatch({ type: "REMOVE_FIELD", payload: field });
  };

  const handleFieldChange = (field, value) => {
    dispatch({ type: "UPDATE_FIELD", payload: { field, value } });
  };

  return (
    <div>
      <Box display="flex" alignItems="center" mb={2} justifyContent="center">
        <TextField
          label="New Entry Name"
          value={newEntryName}
          onChange={(e) => setNewEntryName(e.target.value)}
          margin="normal"
        />
        <Button
          onClick={handleAddNewEntry}
          variant="contained"
          disabled={
            !newEntryName || state.formData.hasOwnProperty(newEntryName)
          }
          sx={{ m: 2 }}
        >
          Add
        </Button>
      </Box>

      <Divider sx={{ my: 2, pb: 2 }}></Divider>

      {Object.entries(state.formData).map(([key, value]) => (
        <Box key={key} display="flex" alignItems="center" mb={2}>
          <TextField
            label={key}
            value={value}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            margin="normal"
            fullWidth
          />
          <HighlightOffIcon
            onClick={() => handleRemoveField(key)}
            style={{ cursor: "pointer", marginLeft: 10, color: "lightcoral" }}
            fontSize="large"
          />
        </Box>
      ))}

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button onClick={handleFormSave} variant="contained" color="primary">
          {loading ? <CircularProgress color="info" size={24} /> : "Save Info"}
        </Button>
      </Box>

      {alert.message && (
        <Alert severity={alert.type} style={{ marginTop: "20px" }}>
          {alert.message}
        </Alert>
      )}
    </div>
  );
};

export default AdditionalInfoForm;
