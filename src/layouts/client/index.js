import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Alert, Box } from "@mui/material";

function Clients() {
  const [category, setCategory] = useState([]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Category Name is required"),
  });

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get("https://jewellery01-back.onrender.com/api/categories");
      setCategory(response.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch testimonials");
    }
  };

  const handleDeleteTestimonial = async (id) => {
    try {
      const response = await axios.delete(
        `https://jewellery01-back.onrender.com/api/categories/${id}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchTestimonials();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete testimonial");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Formik
              initialValues={{ name: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const response = await axios.post(
                    "https://jewellery01-back.onrender.com/api/categories",
                    values
                  );
                  toast.success(response.data.message);
                  resetForm();
                  navigate("/client");
                } catch (error) {
                  console.error("Error submitting form data:", error);
                  toast.error(error.response.data.message || "Failed to submit form");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting, setFieldValue }) => (
                <Form>
                  <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                    <Field
                      name="name"
                      as={TextField}
                      label="Category"
                      size="small"
                      variant="filled"
                      error={touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                    <MDButton type="submit" ariant="text" color="info" disabled={isSubmitting}>
                      Submit
                    </MDButton>
                  </Box>
                </Form>
              )}
            </Formik>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {category.length > 0 ? (
                category.map((client) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={client._id}>
                    <Card>
                      <MDBox
                        p={2}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        textAlign="center"
                      >
                        <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                          {client.name}
                        </MDTypography>
                        <MDButton
                          variant="text"
                          color="error"
                          onClick={() => handleDeleteTestimonial(client._id)}
                          startIcon={<Icon>delete</Icon>}
                          sx={{ mt: 2 }}
                        >
                          Delete
                        </MDButton>
                      </MDBox>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Alert severity="error" fullwidth>
                  No Clients available.
                </Alert>
              )}
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Clients;
