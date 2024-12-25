import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Grid,
  Avatar,
  TextField,
  Box,
  Button,
  Card,
  Icon,
  Rating,
  Typography,
  Alert,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Testimonial() {
  const [image, setImage] = useState({ url: "", public_id: "" });
  const [testimonials, setTestimonials] = useState([]);

  // Validation Schema
  const validationSchema = Yup.object({
    clientImage: Yup.string().required("Client Image is required"),
    name: Yup.string().required("Client Name is required"),
    description: Yup.string().required("Description is required"),
  });

  // Upload Image
  const handleFileChange = async (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await axios.post(
          "https://jewellery01-back.onrender.com/api/upload-image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setImage({
          url: response.data.url,
          public_id: response.data.public_id,
        });
        setFieldValue("clientImage", response.data.url);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get("https://jewellery01-back.onrender.com/api/review");
      setTestimonials(response.data.reviews);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch testimonials");
    }
  };

  // Delete Testimonial
  const handleDeleteTestimonial = async (id) => {
    try {
      const response = await axios.delete(`https://jewellery01-back.onrender.com/api/review/${id}`);
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
          {/* Form Section */}
          <Grid item xs={12} md={4}>
            <Formik
              initialValues={{
                clientImage: "",
                name: "",
                description: "",
                rating: 0,
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const response = await axios.post(
                    "https://jewellery01-back.onrender.com/api/review",
                    values
                  );
                  toast.success(response.data.message);
                  resetForm();
                  setImage({ url: "", public_id: "" });
                  fetchTestimonials();
                } catch (error) {
                  toast.error(error.response?.data?.message || "Failed to add review");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                <Form>
                  <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      id="file-input"
                      style={{ display: "none" }}
                    />
                    <Avatar
                      alt="Client Image"
                      src={image.url}
                      onClick={() => document.getElementById("file-input").click()}
                      sx={{ cursor: "pointer", width: 96, height: 96 }}
                    />
                    {errors.clientImage && touched.clientImage && (
                      <MDTypography color="error" variant="caption">
                        {errors.clientImage}
                      </MDTypography>
                    )}
                    <Field
                      name="name"
                      as={TextField}
                      fullWidth
                      label="Client Name"
                      placeholder="Enter client name"
                      variant="filled"
                      error={touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                    <Field
                      name="description"
                      as={TextField}
                      fullWidth
                      placeholder="Enter your review"
                      label="Review"
                      variant="filled"
                      multiline
                      rows={4}
                      error={touched.description && !!errors.description}
                      helperText={touched.description && errors.description}
                    />
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                      <MDTypography variant="body2">Rating</MDTypography>
                      <Rating
                        name="rating"
                        value={values.rating}
                        onChange={(event, newValue) => setFieldValue("rating", newValue)}
                      />
                    </Box>
                    <MDButton
                      type="submit"
                      variant="contained"
                      color="info"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Cretae"}
                    </MDButton>
                  </Box>
                </Form>
              )}
            </Formik>
          </Grid>

          {/* Testimonial List Section */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {testimonials.length > 0 ? (
                testimonials.map((testimonial) => (
                  <Grid item xs={12} sm={6} md={6} lg={6} key={testimonial._id}>
                    <Card>
                      <MDBox p={2} display="flex" flexDirection="column" alignItems="center">
                        <Avatar
                          src={testimonial.clientImage}
                          alt={testimonial.name}
                          sx={{ width: 80, height: 80, mb: 2 }}
                        />
                        <MDTypography variant="h6" fontWeight="medium">
                          {testimonial.name}
                        </MDTypography>
                        <MDTypography variant="body2">{testimonial.description}</MDTypography>
                        <Rating value={testimonial.rating} readOnly />
                        <MDButton
                          variant="text"
                          color="error"
                          onClick={() => handleDeleteTestimonial(testimonial._id)}
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
                  No testimonials available.
                </Alert>
              )}
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Testimonial;
