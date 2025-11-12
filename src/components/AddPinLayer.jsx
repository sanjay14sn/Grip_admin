// export default AddPinLayer;
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import pinApiProvider from "../apiProvider/pinApi";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import { IMAGE_BASE_URL } from "../network/apiClient";

const AddPinLayer = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState({});
  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (isEditMode) {
      fetchUserData();
    }
  }, [id]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await pinApiProvider.getPinById(id);
      console.log(response, "response-getPinById");

      if (response && response.status) {
        const pin = response.response.data;

        setFormData({
          name: pin.name || "",
          image: pin.image || null,
        });

        // ✅ Show existing image preview
        if (pin.image?.docPath && pin.image?.docName) {
          setImagePreviewUrl(
            `${IMAGE_BASE_URL}/${pin.image.docPath}/${pin.image.docName}`
          );
        }
      }
    } catch (error) {
      console.error("Error fetching pin:", error);
      toast.error("Failed to fetch pin details");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Validate PIN input (only digits, max 4 characters)
    if (id === "pin" && !/^\d{0,4}$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called", formData, "isEditMode:", isEditMode);

    const errors = {};

    // ✅ Validate Name
    if (!formData.name?.trim()) {
      errors.name = "Please enter a name";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      errors.name = "Name should contain only alphabets";
    }

    // If errors exist, show inline error and stop
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    setError({});
    setLoading(true);

    // ✅ Prepare data
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);

    if (selectedFile) {
      formDataToSend.append("image", selectedFile); // adjust field name to match backend
    }

    try {
      let response;

      if (isEditMode) {
        // ✅ Update existing pin
        response = await pinApiProvider.updatePin(id, formDataToSend);
      } else {
        // ✅ Create new pin
        response = await pinApiProvider.addPin(formDataToSend);
      }

      if (response && response.status) {
        Swal.fire({
          title: "Success!",
          text: `Pin ${isEditMode ? "updated" : "created"} successfully.`,
          icon: "success",
          customClass: {
            popup: "small-swal-popup",
            title: "small-swal-title",
            htmlContainer: "small-swal-text",
          },
          width: "400px",
        }).then(() => {
          navigate("/pin-list"); // ✅ redirect to your pin list page
        });
      } else {
        console.log(response);
        toast.error(response?.response?.message || "Failed to save pin");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          `An error occurred while ${
            isEditMode ? "updating" : "creating"
          } the pin.`
      );
    } finally {
      setLoading(false);
    }
  };
  console.log(formData, "formData");
  console.log("imagePreviewUrl", imagePreviewUrl);

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-body p-24">
        <div className="row justify-content-center">
          <div className="col-xxl-6 col-xl-8 col-lg-10">
            <div className="card border">
              <div className="card-body">
                <h6 className="text-md text-primary-light mb-16">Pin Image</h6>
                <div className="mb-24 mt-16">
                  <div className="avatar-upload">
                    <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                      <input
                        type="file"
                        id="imageUpload"
                        accept=".png, .jpg, .jpeg"
                        hidden
                        onChange={handleImageChange}
                        disabled={loading}
                      />
                      <label
                        htmlFor="imageUpload"
                        className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                      >
                        <Icon
                          icon="solar:camera-outline"
                          className="icon"
                        ></Icon>
                      </label>
                    </div>
                    <div className="avatar-preview square-preview">
                      <div
                        id="imagePreview"
                        style={{
                          width: "150px", // adjust as needed
                          height: "150px", // same value = square
                          borderRadius: "8px", // small corner rounding
                          overflow: "hidden",
                          backgroundImage: imagePreviewUrl
                            ? `url(${imagePreviewUrl})`
                            : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          border: "2px solid #ddd",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-20">
                    <label
                      htmlFor="name"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Name <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    {error && error.name ? (
                      <span className="text-danger">{error.name}</span>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <button
                      type="button"
                      className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                      onClick={() => navigate("/pin-list")}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary grip text-md px-56 py-12 radius-8"
                      disabled={loading}
                    >
                      {loading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : isEditMode ? (
                        "Update Pin"
                      ) : (
                        "Add Pin"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddPinLayer;
