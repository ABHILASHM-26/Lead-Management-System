
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const CreateLeadEditPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    source: "website",
    status: "new",
    score: 0,
    lead_value: 0,
    is_qualified: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch lead if editing
  useEffect(() => {
    if (isEdit) {
      api.get(`/leads/${id}`)
        .then((res) => setFormData(res.data))
        .catch((err) => setError("Failed to load lead data"));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/leads/${id}`, formData);
        setSuccess("Lead updated successfully!");
      } else {
        await api.post("/leads", formData);
        setSuccess("Lead created successfully!");
      }
      setError("");
      setTimeout(() => navigate("/leads"), 1000); 
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
      setSuccess("");
    }
  };

  const fields = [
    { name: "first_name", label: "First Name", type: "text" },
    { name: "last_name", label: "Last Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone", type: "text" },
    { name: "company", label: "Company", type: "text" },
    { name: "city", label: "City", type: "text" },
    { name: "state", label: "State", type: "text" },
    { name: "score", label: "Score", type: "number" },
    { name: "lead_value", label: "Lead Value", type: "number" },
  ];

  return (
    <div className="form-wrapper" style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2 className="text-center">{isEdit ? "Edit Lead" : "Create Lead"}</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div className="form-group" key={field.name}>
            <label>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.label}
              required
            />
          </div>
        ))}

        <div className="form-group">
          <label>Source</label>
          <select name="source" value={formData.source} onChange={handleChange}>
            {["website", "facebook_ads", "google_ads", "referral", "events", "other"].map(
              (src) => (
                <option key={src} value={src}>
                  {src.replace("_", " ").toUpperCase()}
                </option>
              )
            )}
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            {["new", "contacted", "qualified", "lost", "won"].map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="is_qualified"
            checked={formData.is_qualified}
            onChange={handleChange}
            className="form-check-input"
            id="qualifiedCheck"
          />
          <label className="form-check-label" htmlFor="qualifiedCheck">
            Qualified
          </label>
        </div>

        <button type="submit" className="btn">
          {isEdit ? "Update Lead" : "Create Lead"}
        </button>
      </form>
    </div>
  );
};

export default CreateLeadEditPage;
