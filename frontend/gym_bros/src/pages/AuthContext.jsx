import React, {
  createContext,
  useState,
  useEffect
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext =
  createContext();

export const AuthProvider = ({
  children
}) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const navigate =
    useNavigate();

  axios.defaults.withCredentials =
    true;


  const fetchUser =
    async () => {

      try {

        const res =
          await axios.get(
            `${process.env.REACT_APP_API_URL}/auth/me"`,
            { withCredentials: true }
          );

        setUser(res.data);

      } catch {

        setUser(null);

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    fetchUser();

  }, []);


  const login =
    async () => {

      await fetchUser();

    };


  const logout =
    async () => {

      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/logout"`,
        {},
        { withCredentials: true }
      );

      setUser(null);

      navigate("/login");

    };


  return (

    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>

  );

};