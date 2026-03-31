import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaDumbbell,
  FaCrown,
  FaInfoCircle,
  FaHeadset,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Exercises", path: "/exercises", icon: <FaDumbbell /> },
    { name: "Subscription", path: "/subscription", icon: <FaCrown /> },
    { name: "About", path: "/about", icon: <FaInfoCircle /> },
    { name: "Support", path: "/support", icon: <FaHeadset /> }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      style={styles.nav}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: "easeOut"
      }}
    >
      <div style={styles.container}>

        {/* LOGO */}
        <div style={styles.logo} onClick={() => navigate("/")}>
          <h2 style={{ color: "white", fontWeight: "800" }}>GYM BROS</h2>
        </div>

        {/* MENU */}
        <div style={styles.menu} className="desktop-menu">
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(item.path)}
              style={
                isActive(item.path)
                  ? { ...styles.link, ...styles.active }
                  : styles.link
              }
            >
              {item.icon}
              {item.name}
            </motion.button>
          ))}
        </div>

        {/* RIGHT */}
        <div style={styles.right} className="right-section">
          {!user ? (
            <>
              <button style={styles.loginBtn} onClick={() => navigate("/login")}>
                Login
              </button>

              <button style={styles.ctaBtn} onClick={() => navigate("/login")}>
                Start
              </button>
            </>
          ) : (
            <div style={styles.profileWrapper} ref={dropdownRef}>

              <motion.div
                style={styles.profile}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpenDropdown(!openDropdown)}
              >

                <div style={styles.avatar}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span style={styles.username}>
                  {user?.nickname || user?.name}
                </span>
              </motion.div>

              <AnimatePresence>
                {openDropdown && (
                  <motion.div
                    style={styles.dropdown}
                    
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    
                    transition={{
                      duration: 0.25,
                      ease: "easeOut"
                    }}
                  >
                    {["Dashboard", "Profile", "Settings"].map((item, i) => (
                      <motion.button
                        key={item}
                        style={styles.dropdownItem}
                        onClick={() => navigate(`/${item.toLowerCase()}`)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ x: 5 }}
                      >
                        {item}
                      </motion.button>
                    ))}

                    <div style={styles.divider}></div>

                    <motion.button
                      style={{ ...styles.dropdownItem, color: "#ff6b6b" }}
                      onClick={onLogout}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ x: 5 }}
                    >
                      <FaSignOutAlt /> Logout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          style={styles.mobileBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              style={styles.mobileLink}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </div>
      )}

      {/* MOBILE FIX */}
      <style>{`
        @media (max-width: 768px){
          .desktop-menu{ display:none !important; }
          .right-section{ display:none !important; }

          button[style*="mobileBtn"]{
            display:block !important;
          }

          img{
            height:50px !important;
          }

          nav{
            height:60px !important;
            top:10px !important;
          }
        }
      `}</style>
    </motion.nav>
  );
};

const styles = {
  nav: {
    position: "fixed",
    top: 20,
    left: 0,
    right: 0,
    margin: "0 auto",
    width: "90%",
    maxWidth: "1200px",
    height: "70px",
    zIndex: 1000,
    background: "rgba(12,12,15,0.6)",
    backdropFilter: "blur(15px)",
    borderRadius: "50px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 0 40px rgba(124,124,255,0.25)"
  },

  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    padding: "0 25px"
  },

  logoImg: {
    height: "90px"
  },

  menu: {
    display: "flex",
    gap: "20px"
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "transparent",
    border: "none",
    color: "#ccc",
    cursor: "pointer"
  },

  active: {
    color: "white"
  },

  right: {
    display: "flex",
    gap: "10px"
  },

  loginBtn: {
    background: "transparent",
    border: "none",
    color: "#ccc"
  },

  ctaBtn: {
    background: "#7c7cff",
    border: "none",
    color: "white",
    padding: "8px 18px",
    borderRadius: "20px"
  },

  profileWrapper: {
    position: "relative"
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer"
  },

  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#7c7cff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white"
  },

  username: {
    color: "white"
  },

  /* 🔥 FIXED DROPDOWN */
  dropdown: {
    position: "absolute",
    top: "55px",
    right: 0,
    width: "180px",
    background: "rgba(20,20,30,0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "15px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 0 25px rgba(124,124,255,0.3)",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    zIndex: 2000
  },

  dropdownItem: {
    padding: "10px",
    background: "transparent",
    border: "none",
    color: "#ddd",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "10px"
  },

  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.1)"
  },

  mobileBtn: {
    display: "none",
    color: "white",
    fontSize: "22px",
    background: "none",
    border: "none"
  },

  mobileMenu: {
    marginTop: "10px",
    background: "rgba(12,12,15,0.9)",
    borderRadius: "20px",
    padding: "15px"
  },

  mobileLink: {
    display: "block",
    padding: "10px",
    color: "white",
    background: "none",
    border: "none",
    textAlign: "left"
  }
};

export default Navbar;