
import React, { useEffect, useState } from "react";
import api from "../api/api";
import CreateLeadEditPage from "../pages/CreateLeadEditPage";

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    score_gt: "",
    qualified: "",
  });

  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);


  const fetchLeads = async () => {
    try {
      const params = { page, limit, ...filters };
      const res = await api.get("/leads", { params });
      setLeads(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, filters]);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1); 
  };

  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setPage((p) => Math.min(p + 1, totalPages));


  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };


  const handleModalClose = () => {
    setSelectedLead(null);
    setShowModal(false);
    fetchLeads();
  };

  return (
    <div className="form-wrapper" style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h2 className="text-center">Leads</h2>

      {}
      <button className="btn mb-3" onClick={() => setShowModal(true)}>
        + Add Lead
      </button>

      {}
      <div className="mb-3 d-flex flex-wrap gap-2">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
          <option value="won">Won</option>
        </select>

        <input
          type="number"
          name="score_gt"
          placeholder="Min Score"
          value={filters.score_gt}
          onChange={handleFilterChange}
        />

        <select
          name="qualified"
          value={filters.qualified}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="true">Qualified</option>
          <option value="false">Not Qualified</option>
        </select>
      </div>

      {}
      <table>
        <thead>
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
              <td colSpan="9" className="text-center">
                No leads found
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.first_name} {lead.last_name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
                <td>{lead.company}</td>
                <td>{lead.city}</td>
                <td>{lead.status}</td>
                <td>{lead.score}</td>
                <td>{lead.is_qualified ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="table-action-btn edit"
                    onClick={() => handleEdit(lead)}
                  >
                    Edit
                  </button>
                  <button
                    className="table-action-btn delete"
                    onClick={() => handleDelete(lead._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {}
      <div className="d-flex justify-content-between align-items-center">
        <button className="btn" onClick={handlePrevPage} disabled={page === 1}>
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button className="btn" onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>

      {}
      {showModal && (
        <CreateLeadEditPage lead={selectedLead} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default LeadsTable;
