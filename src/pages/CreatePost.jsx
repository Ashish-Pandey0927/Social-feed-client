import React, { useState } from "react";
import axios from "axios"; // or "../api/axiosInstance"
import { useNavigate } from "react-router-dom";
import "./CreatePost.css"; // Ensure the CSS file exists and is correctly linked

export default function CreatePost() {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setStep(2);
    }
  };

  const handleCaptionChange = (e) => setContent(e.target.value);
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ Correct Template String
        },
      });

      alert("Post created successfully!");
      // Reset state after success
      setStep(1);
      setImage(null);
      setImagePreview(null);
      setContent("");
      navigate("/");
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="createpost-fullscreen-wrapper">
      <div className="bg-gradient-animation"></div>
      <div className="createpost-container">
        {/* Left Section: Image */}
        <div className="createpost-image-preview">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" />
          ) : (
            <label htmlFor="imageUpload" className="upload-placeholder">
              Click or drag image here
              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                onChange={handleImageChange}
                hidden
              />
            </label>
          )}
        </div>

        {/* Right Section: Form */}
        <div className="createpost-form-side">
          {step === 1 && (
            <>
              <h2 className="createpost-title">Upload Photo</h2>
              <button
                className="createpost-button"
                onClick={() =>
                  document.getElementById("imageUpload").click()
                }
              >
                Choose Image
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="createpost-title">Add a Caption</h2>
              <textarea
                className="createpost-textarea"
                placeholder="Write a caption..."
                value={content}
                onChange={handleCaptionChange}
              />
              <div className="button-group">
                <button className="createpost-button" onClick={prevStep}>
                  Back
                </button>
                <button
                  className="createpost-button"
                  onClick={() => setStep(3)}
                  disabled={content.trim() === ""}
                  style={{ opacity: content.trim() === "" ? 0.5 : 1 }}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="createpost-title">Confirm Your Post</h2>
              <p className="caption-preview">{content}</p>
              <div className="button-group">
                <button className="createpost-button" onClick={prevStep}>
                  Back
                </button>
                <button
                  className="createpost-button"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Sharing..." : "Share"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
