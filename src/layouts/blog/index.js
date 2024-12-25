import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { ToastContainer } from "react-toastify";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function CreateProduct() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://jewellery01-back.onrender.com/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    setImages([...images, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const uploadImages = async () => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });
    try {
      const response = await axios.post(
        "https://jewellery01-back.onrender.com/api/upload-multiple",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.images;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Failed to upload images");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const uploadedImageUrls = await uploadImages();
      const payload = {
        name,
        number,
        description,
        gender,
        category,
        price,
        images: uploadedImageUrls,
      };
      const response = await axios.post(
        "https://jewellery01-back.onrender.com/api/products",
        payload
      );
      if (response.data.success) {
        alert("Product created successfully!");
        setName("");
        setNumber("");
        setDescription("");
        setGender("");
        setCategory("");
        setPrice("");
        setImages([]);
        setImagePreviews([]);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer />
      <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 2 }}>
        <MDTypography variant="h6" gutterBottom>
          Create Product
        </MDTypography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                  sx={{
                    p: 1.4,
                  }}
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No categories available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                  border: "1px dashed rgb(146, 141, 141)",
                  borderRadius: 5,
                  p: 2,
                  textAlign: "center",
                  transition: "background-color 0.3s",
                }}
              >
                <MDTypography sx={{ fontSize: "14px" }}>
                  Drag and drop images here or click below to upload.
                </MDTypography>
                <Box>
                  <label htmlFor="image-upload">
                    <img
                      src="https://i.postimg.cc/tTpgcShp/undraw-upload-cucu.png"
                      alt="upload"
                      width="100"
                      height="100"
                      style={{
                        borderRadius: "20px",
                        marginTop: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </label>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImageChange}
                  />
                </Box>
              </Box>
              {imagePreviews.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: 2 }}>
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`preview-${index}`}
                      width={`80px`}
                      height={`80px`}
                      style={{ margin: "0 10px 10px 0" }}
                    />
                  ))}
                </Box>
              )}
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                py: 2,
              }}
            >
              <MDButton variant="contained" color="info" type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Create "}
              </MDButton>
            </Box>
          </Grid>
        </form>
      </Box>
    </DashboardLayout>
  );
}

export default CreateProduct;
