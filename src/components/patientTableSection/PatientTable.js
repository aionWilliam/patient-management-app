import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const formatDate = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  return date.toISOString().split("T")[0];
};

const PatientTable = ({ patients, selectPatient }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date of Birth</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
              <TableCell>
                {patient.dateOfBirth ? formatDate(patient.dateOfBirth) : ""}
              </TableCell>
              <TableCell>{patient.address}</TableCell>
              <TableCell>{patient.status}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => selectPatient(patient)}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientTable;
