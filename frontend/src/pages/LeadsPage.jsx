
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../authContext";

const LeadsPage = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    source: "",
    score_gt: "",
    is_qualified: "",
  });

  const fetchLeads = async () => {
    try {
      let query = `?page=${page}&limit=${limit}`;
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query += `&${key}=${value}`;
      });
      const res = await api.get(`/leads${query}`);
      setLeads(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      if (err.response?.status === 401) logout();
      console.error("Error fetching leads", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, filters]);


  const handleAddLead = () => navigate("/leads/create");


  const handleEditLead = (id) => navigate(`/leads/edit/${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="form-wrapper">
      <h2 className="text-center mb-3">Leads</h2>

      {}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={handleAddLead}>
          + Add Lead
        </button>
      </div>

      {}
      <div className="mb-3 d-flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Status"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="form-control"
        />
        <input
          type="text"
          placeholder="Source"
          value={filters.source}
          onChange={(e) => setFilters({ ...filters, source: e.target.value })}
          className="form-control"
        />
        <input
          type="number"
          placeholder="Score >"
          value={filters.score_gt}
          onChange={(e) => setFilters({ ...filters, score_gt: e.target.value })}
          className="form-control"
        />
        <select
          value={filters.is_qualified}
          onChange={(e) => setFilters({ ...filters, is_qualified: e.target.value })}
          className="form-select"
        >
          <option value="">Qualified?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      {}
      <div className="table-responsive">
        <table className="table table-striped table-bordered text-center">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>City</th>
              <th>Status</th>
              <th>Score</th>
              <th>Qualified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="9">No leads found</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id}>
                  <td>{lead.first_name + " " + lead.last_name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.company}</td>
                  <td>{lead.city}</td>
                  <td>{lead.status}</td>
                  <td>{lead.score}</td>
                  <td>{lead.is_qualified ? "Yes" : "No"}</td>
                  <td>
                    <button className="table-action-btn edit" onClick={() => handleEditLead(lead._id)}>
                      Edit
                    </button>
                    <button className="table-action-btn delete" onClick={() => handleDelete(lead._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button className="btn btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button className="btn btn-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default LeadsPage;
