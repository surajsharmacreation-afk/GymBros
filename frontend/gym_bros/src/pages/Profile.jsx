import React, {
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback
} from "react";

import Navbar from "../components/Navbar";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import {
  FaUser,
  FaRulerVertical,
  FaWeight
} from "react-icons/fa";

import { getColor } from "colorthief";

const Profile = () => {

  const { user, setUser } = useContext(AuthContext);

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    nickname: user?.nickname || "",
    age: user?.age || "",
    height: user?.height || "",
    weight: user?.weight || ""
  });

  const [profilePic, setProfilePic] = useState(null);

  const [bgGradient, setBgGradient] = useState(
    "radial-gradient(circle at center,#020617,#020617)"
  );

  const cardRef = useRef(null);

  /* =========================
     IMAGE URL GENERATOR
  ========================= */

  const getImageUrl = useCallback(() => {

    if (profilePic) {
      return URL.createObjectURL(profilePic);
    }

    if (user?.profilePic) {

      const cleanPath = user.profilePic.startsWith("/")
        ? user.profilePic.slice(1)
        : user.profilePic;

      return `${process.env.REACT_APP_API_URL}/${cleanPath}`;
    }

    return "/default-profile.png";

  }, [user?.profilePic, profilePic]);

  const imageUrl = getImageUrl();
  /* =========================
     COLOR EXTRACTION
  ========================= */

  const extractColor = useCallback((imgUrl) => {

    const img = new Image();

    img.crossOrigin = "Anonymous";

    img.src = imgUrl;

    img.onload = () => {

      try {

        const [r, g, b] = getColor(img);

        const gradient = `
          radial-gradient(circle at 50% 30%,
          rgba(${r},${g},${b},0.45),
          #020617 70%)
        `;

        setBgGradient(gradient);

      } catch (err) {

        console.log("Color extraction failed:", err);

      }

    };

  }, []);


  /* =========================
     AUTO BACKGROUND UPDATE
  ========================= */

  useEffect(() => {

    const imgUrl = getImageUrl();

    if (imgUrl && !imgUrl.includes("default-profile")) {
      extractColor(imgUrl);
    }

  }, [getImageUrl, extractColor]);


  /* =========================
     CARD TILT EFFECT
  ========================= */

  const handleMove = (e) => {

    const rect = cardRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = -(y - rect.height / 2) / 30;
    const rotateY = (x - rect.width / 2) / 30;

    cardRef.current.style.transform =
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  };

  const reset = () => {

    cardRef.current.style.transform =
      "rotateX(0deg) rotateY(0deg)";

  };


  /* =========================
     INPUT CHANGE
  ========================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  /* =========================
     SAVE PROFILE
  ========================= */

  const handleSave = async () => {

    try {

      const data = new FormData();

      data.append("nickname", formData.nickname);
      data.append("age", formData.age);
      data.append("height", formData.height);
      data.append("weight", formData.weight);

      if (profilePic) {
        data.append("profilePic", profilePic);
      }

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/users`,
        data,
        { withCredentials: true }
      );

      setUser(res.data.user);

      setProfilePic(null);

      setEditMode(false);

      alert("Profile updated ✅");

    } catch (err) {

      console.log(err);

      alert("Update failed ❌");

    }

  };


  /* =========================
     UI
  ========================= */

  return (

    <>
      <Navbar
        user={user}
        onLogout={() => {

          axios.post(
            `${process.env.REACT_APP_API_URL}/auth/logout`,
            {},
            { withCredentials: true }
          );

          setUser(null);

          window.location.href = "/login";

        }}
      />

      <div
        style={{
          ...styles.wrapper,
          backgroundImage: `url(${imageUrl})`
        }}
      >

        <div style={styles.blurLayer}></div>

        <div
          ref={cardRef}
          style={styles.card}
          onMouseMove={handleMove}
          onMouseLeave={reset}
        >

          <label
            style={{
              cursor: editMode
                ? "pointer"
                : "default"
            }}
          >

            <img
              src={imageUrl}
              alt="profile"
              style={styles.image}
            />

            {editMode && (

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {

                  if (e.target.files[0]) {
                    setProfilePic(e.target.files[0]);
                  }

                }}
              />

            )}

          </label>


          {editMode ? (

            <input
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              style={styles.input}
            />

          ) : (

            <h2 style={styles.name}>
              {user?.nickname || user?.name}
            </h2>

          )}


          <p style={styles.desc}>
            Fitness Member focused on discipline & usability.
          </p>


          <div style={styles.stats}>

            <div style={styles.statItem}>
              <FaUser size={16} />
              {editMode
                ? (
                  <input
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    style={styles.statInput}
                  />
                )
                : (
                  <span>{user?.age || "N/A"}</span>
                )}
            </div>


            <div style={styles.statItem}>
              <FaRulerVertical size={16} />
              {editMode
                ? (
                  <input
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleChange}
                    style={styles.statInput}
                  />
                )
                : (
                  <span>{user?.height || "N/A"}</span>
                )}
            </div>


            <div style={styles.statItem}>
              <FaWeight size={16} />
              {editMode
                ? (
                  <input
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleChange}
                    style={styles.statInput}
                  />
                )
                : (
                  <span>{user?.weight || "N/A"}</span>
                )}
            </div>

          </div>


          <button
            style={styles.button}
            onClick={
              editMode
                ? handleSave
                : () => setEditMode(true)
            }
          >
            {editMode
              ? "Save Profile ✓"
              : "Edit Profile +"}
          </button>

        </div>

      </div>

    </>
  );

};

export default Profile;


/* =========================
   STYLES
========================= */

const styles = {

  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",

    filter: "blur(0px)",
    position: "relative"
  },

  blurLayer: {
    position: "absolute",
    inset: 0,
    backdropFilter: "blur(40px)",
    background:
      "linear-gradient(to bottom, rgba(2,6,23,0.7), rgba(2,6,23,0.9))",
    zIndex: 0
  },

  card: {
    width: "320px",
    borderRadius: "32px",
    padding: "20px",
    backdropFilter: "blur(22px)",
    border: "1px solid rgba(255,255,255,0.08)",
    textAlign: "center",
    transition: "transform 0.15s ease-out",
    boxShadow:
      "0 25px 60px rgba(0,0,0,0.6)",
    position: "relative",
    zIndex: 2,

  },

  image: {
    width: "100%",
    height: "280px",
    borderRadius: "26px",
    objectFit: "cover"
  },

  name: {
    color: "white",
    marginTop: "18px",
    fontWeight: "600"
  },

  input: {
    marginTop: "18px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    outline: "none",
    backgroundColor:
      "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "14px"
  },

  desc: {
    fontSize: "14px",
    opacity: 0.9,
    color: "white",
    marginBottom: "18px"
  },

  stats: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "18px",
    color: "white"
  },

  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px"
  },

  statInput: {
    width: "50px",
    border:
      "1px solid rgba(255,255,255,0.2)",
    outline: "none",
    borderRadius: "6px",
    padding: "4px 6px",
    backgroundColor:
      "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "12px"
  },

  button: {
    padding: "10px 28px",
    borderRadius: "22px",
    border: "none",
    background:
      "rgba(255,255,255,0.15)",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease"
  }

};