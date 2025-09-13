
import React, { useState } from "react";
import api from "../api/api";

const LeadFormModal = ({ lead, onClose }) => {
  const isEdit = !!lead;

  const [form, setForm] = useState({
    first_name: lead?.first_name || "",
    last_name: lead?.last_name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    company: lead?.company || "",
    city: lead?.city || "",
    state: lead?.state || "",
    source: lead?.source || "website",
    status: lead?.status || "new",
    score: lead?.score || 0,
    lead_value: lead?.lead_value || 0,
    is_qualified: lead?.is_qualified || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/leads/${lead._id}`, form);
      } else {
        await api.post("/leads", form);
      }
      onClose(); 
    } catch (err) {
      alert("Failed to save lead");
      console.error("Error saving lead", err);
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
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog" style={{ maxWidth: "600px" }}>
        <div className="modal-content form-wrapper">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {isEdit ? "Edit Lead" : "Add Lead"}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {fields.map((field) => (
                <div className="form-group" key={field.name}>
                  <label>{field.label}</label>
                  <input
                    className="form-control"
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              <div className="form-group">
                <label>Source</label>
                <select
                  className="form-select"
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                >
                  {["website", "facebook_ads", "google_ads", "referral", "events", "other"].map((src) => (
                    <option key={src} value={src}>
                      {src.replace("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
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
                  className="form-check-input"
                  name="is_qualified"
                  checked={form.is_qualified}
                  onChange={handleChange}
                  id="qualifiedCheck"
                />
                <label className="form-check-label" htmlFor="qualifiedCheck">
                  Qualified
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn">
                {isEdit ? "Update" : "Create"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadFormModal;
