import React, { useState } from "react";
import "./Support.css";
import { motion } from "framer-motion";
import axios from "axios";

const Support = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        `${process.env.REACT_APP_API_URL}/support"`,
        formData,
        {
          withCredentials: true
        }
      );

      alert("Message sent successfully ✅");

      setFormData({
        name: "",
        email: "",
        message: ""
      });

    } catch (err) {

      console.log(err);

      alert("Failed to send message ❌");

    }

  };

  return (

    <div className="support-page">

      <motion.h1
        className="support-title"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Need Help?
      </motion.h1>

      <p className="support-sub">
        We're here to help you anytime 💪
      </p>


      <motion.form
        className="support-form"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
      >

        <h2>Send us a message</h2>

        <input
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <motion.button

          whileHover={{
            scale: 1.08,
            boxShadow: "0px 0px 18px #7c7cff"
          }}

          whileTap={{ scale: 0.95 }}

          type="submit"
        >
          Send Message
        </motion.button>

      </motion.form>

    </div>

  );

};

export default Support;