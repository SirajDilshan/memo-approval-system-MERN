import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText } from "@mui/material";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roles = [
    "CAA_Department",
    "Head_Department",
    "AR_Faculty",
    "CAA_Faculty",
    "Dean_Faculty",
    "AR_Campus",
    "Rector",
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log("Registration successful:", res.data);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Create a New Account
        </h2>
        {error && (
          <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Password (min 6 characters)"
              type="password"
              variant="outlined"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              inputProps={{ minLength: 6 }}
            />
          </div>
          <div>
            <FormControl fullWidth>
              <InputLabel>Select Role</InputLabel>
              <Select
                label="Select Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <MenuItem value="" disabled>
                  Select Role
                </MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.replace(/_/g, " ")}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select a role for the user</FormHelperText>
            </FormControl>
          </div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="success"
            disabled={loading}
            sx={{
              padding: "10px",
              marginTop: "16px",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-green-600 hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
