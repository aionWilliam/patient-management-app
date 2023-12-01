import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { getAuth } from "firebase/auth";
import { Typography } from "@mui/material";
import PatientFilters from "./PatientFilters";
import PatientTable from "./PatientTable";
import PatientModal from "../PatientModal/PatientModal";

const PatientTableSection = () => {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const resetPatient = () => {
    setSelectedPatient(null);
  };

  const filterPatients = (patients, search, filter) => {
    return patients
      .filter((patient) => {
        const fullName =
          `${patient.firstName} ${patient.lastName}`.toLowerCase();
        return search === "" || fullName.includes(search.toLowerCase());
      })
      .filter((patient) => filter === "" || patient.status === filter);
  };

  const filteredPatients = filterPatients(patients, search, filter);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const providerId = currentUser ? currentUser.uid : null;
    setLoading(true);

    if (providerId) {
      const q = query(
        collection(firestore, "patient"),
        where("providerId", "==", providerId),
        orderBy("status", "asc")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const patientsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPatients(patientsArray);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <>
      {loading ? (
        "loading patients data ..."
      ) : (
        <>
          <Typography sx={{ mb: 2 }}>Patients</Typography>
          <PatientFilters
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
          />
          <PatientTable
            patients={filteredPatients}
            selectPatient={selectPatient}
          />

          <PatientModal
            patient={selectedPatient}
            handleClose={resetPatient}
          ></PatientModal>
        </>
      )}
    </>
  );
};

export default PatientTableSection;
