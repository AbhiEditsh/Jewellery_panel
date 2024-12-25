import { useState, useEffect } from "react";
import axios from "axios";
import MDTypography from "components/MDTypography";

export default function Data() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("https://jewellery01-back.onrender.com/api/inquiries/");
        console.log(response);
        setCandidates(response?.data);
        console.log("resume", response.data?.data); // Logging the fetched data
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchCandidates();
  }, []);

  return {
    columns: [
      { Header: "Name", accessor: "name", width: "30%", align: "left" },
      { Header: "Email", accessor: "email", align: "left" },
      { Header: "Message", accessor: "message", align: "center" },
    ],

    rows: candidates?.map((candidate) => ({
      name: (
        <MDTypography variant="button" fontWeight="medium">
          {candidate?.name}
        </MDTypography>
      ),
      email: (
        <MDTypography component="a" variant="button" color="text" fontWeight="medium">
          {candidate.email}
        </MDTypography>
      ),
      message: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {candidate.message}
        </MDTypography>
      ),
    })),
  };
}
