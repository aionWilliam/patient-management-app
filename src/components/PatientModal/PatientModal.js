import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import AdditionalInfoForm from "./AdditionalInfoForm";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  maxWidth: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const PatientModal = ({ patient, handleClose }) => {
  return (
    <Modal
      open={!!patient}
      onClose={handleClose}
      aria-labelledby="patient-details-title"
    >
      <Box sx={modalStyle}>
        {patient && (
          <>
            <Typography id="patient-details-title" variant="h6" component="h2">
              Additional Information - {patient.firstName} {patient.lastName}
            </Typography>

            <AdditionalInfoForm patient={patient} />
          </>
        )}
      </Box>
    </Modal>
  );
};

export default PatientModal;
