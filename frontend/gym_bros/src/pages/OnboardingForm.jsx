import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const OnboardingForm = () => {

  const { setUser } = useContext(AuthContext);

  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      console.log("✅ File selected:", file.name);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Validation
    if (!nickname || !age || !height || !weight) {
      alert("❌ Please fill all fields");
      return;
    }

    if (!profilePic) {
      alert("❌ Please select a profile picture");
      return;
    }

    try {

      setLoading(true);

      console.log("🔵 Submitting onboarding form...");
      console.log("   Nickname:", nickname);
      console.log("   Age:", age);
      console.log("   Height:", height);
      console.log("   Weight:", weight);
      console.log("   File:", profilePic.name);

      const formData = new FormData();

      formData.append("nickname", nickname);
      formData.append("age", age);
      formData.append("height", height);
      formData.append("weight", weight);
      formData.append("profilePic", profilePic);

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/profile/complete"`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log("✅ SERVER RESPONSE:", res.data);

      setUser(res.data.user);

      alert("✅ Profile completed successfully!");

      // Reset form
      setNickname("");
      setAge("");
      setHeight("");
      setWeight("");
      setProfilePic(null);
      setPreviewUrl(null);

    } catch (err) {

      console.error("❌ Error:", err);

      if (err.response?.data?.message) {
        alert(`❌ Error: ${err.response.data.message}`);
      } else {
        alert("❌ Upload failed. Please try again.");
      }

    } finally {
      setLoading(false);
    }

  };

  return (

    <div style={styles.container}>

      <div style={styles.formWrapper}>

        <h2 style={styles.title}>Complete Your Profile</h2>

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* PROFILE PICTURE PREVIEW */}
          {previewUrl && (
            <div style={styles.previewContainer}>
              <img src={previewUrl} alt="preview" style={styles.previewImage} />
              <p style={styles.previewText}>✅ Image selected</p>
            </div>
          )}

          {/* PROFILE PICTURE UPLOAD */}
          <div style={styles.fileInputWrapper}>
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.hiddenInput}
            />
            <label htmlFor="profilePic" style={styles.fileLabel}>
              {previewUrl ? "📸 Change Photo" : "📸 Select Profile Photo"}
            </label>
          </div>

          {/* NICKNAME INPUT */}
          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={styles.input}
            disabled={loading}
          />

          {/* AGE INPUT */}
          <input
            type="number"
            placeholder="Age"
            min="13"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={styles.input}
            disabled={loading}
          />

          {/* HEIGHT INPUT */}
          <input
            type="number"
            placeholder="Height (cm)"
            min="100"
            max="250"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            style={styles.input}
            disabled={loading}
          />

          {/* WEIGHT INPUT */}
          <input
            type="number"
            placeholder="Weight (kg)"
            min="20"
            max="300"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={styles.input}
            disabled={loading}
          />

          {/* SUBMIT BUTTON */}
          <button 
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? "⏳ Uploading..." : "✅ Complete Profile"}
          </button>

        </form>

      </div>

    </div>

  );

};

export default OnboardingForm;


const styles = {

  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px"
  },

  formWrapper: {
    width: "100%",
    maxWidth: "400px",
    background: "white",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)"
  },

  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "30px",
    fontSize: "24px",
    fontWeight: "600"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  previewContainer: {
    textAlign: "center",
    marginBottom: "10px"
  },

  previewImage: {
    width: "150px",
    height: "150px",
    borderRadius: "12px",
    objectFit: "cover",
    border: "3px solid #667eea"
  },

  previewText: {
    marginTop: "10px",
    color: "#666",
    fontSize: "12px"
  },

  fileInputWrapper: {
    display: "flex",
    justifyContent: "center"
  },

  hiddenInput: {
    display: "none"
  },

  fileLabel: {
    padding: "12px 24px",
    background: "#667eea",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease",
    ":hover": {
      background: "#764ba2"
    }
  },

  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.3s ease"
  },

  button: {
    padding: "14px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "10px"
  }

};