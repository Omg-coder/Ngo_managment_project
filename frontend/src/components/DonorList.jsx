import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api/api';

const DonorList = ({ isAdmin = false }) => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('individual');

  const fetchDonors = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/donors');
      if (res.ok) {
        const data = await res.json();
        setDonors(data);
      } else {
        const errData = await res.json();
        setError(errData.message || 'Failed to load donors.');
      }
    } catch (err) {
      setError(err.message || 'Error fetching donors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setType('individual');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (donor) => {
    setEditingId(donor._id);
    setName(donor.name);
    setEmail(donor.email);
    setPhone(donor.phone);
    setType(donor.type || 'individual');
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, email, phone, type };

    try {
      let res;
      if (editingId) {
        res = await apiFetch(`/api/donors/${editingId}`, {
          method: 'PUT',
          body: payload
        });
      } else {
        res = await apiFetch('/api/donors', {
          method: 'POST',
          body: payload
        });
      }

      if (res.ok) {
        resetForm();
        fetchDonors();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to save donor.');
      }
    } catch (err) {
      alert(err.message || 'Error saving donor.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this donor record?')) return;
    try {
      const res = await apiFetch(`/api/donors/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchDonors();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to delete donor.');
      }
    } catch (err) {
      alert(err.message || 'Error deleting donor.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sand">
        <div>
          <h3 className="text-xl font-serif text-forest">Registered Benefactors & Donors</h3>
          <p className="text-xs text-charcoal-muted mt-0.5">Individual contributors and corporate sustainability partners.</p>
        </div>
        {isAdmin && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-forest text-paper text-xs font-medium hover:bg-forest-dark transition-colors"
          >
            Add Donor
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs">
          {error}
        </div>
      )}

      {/* Admin Add / Edit Form */}
      {isAdmin && showForm && (
        <form onSubmit={handleFormSubmit} className="bg-sand-light border border-sand p-5 space-y-4">
          <h4 className="font-serif text-forest text-base">
            {editingId ? 'Edit Donor Details' : 'Register New Donor'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1">Donor Name / Org</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-paper border border-sand px-3 py-1.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-paper border border-sand px-3 py-1.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-paper border border-sand px-3 py-1.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1">Donor Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-paper border border-sand px-3 py-1.5 text-sm"
              >
                <option value="individual">Individual</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-forest text-paper text-xs font-medium hover:bg-forest-dark"
            >
              {editingId ? 'Update Donor' : 'Save Donor'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-sand text-charcoal text-xs hover:bg-paper"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Donors Table */}
      {loading ? (
        <p className="text-sm text-charcoal-muted py-4">Loading donors...</p>
      ) : donors.length === 0 ? (
        <p className="text-sm text-charcoal-muted py-4">No donors recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-sand text-sm">
            <thead>
              <tr className="bg-sand-light border-b border-sand text-charcoal font-serif text-xs">
                <th className="p-3 border-r border-sand">Donor Name</th>
                <th className="p-3 border-r border-sand">Type</th>
                <th className="p-3 border-r border-sand">Contact</th>
                <th className="p-3 border-r border-sand">System ID (Ref)</th>
                {isAdmin && <th className="p-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {donors.map((donor) => (
                <tr key={donor._id} className="border-b border-sand hover:bg-sand-light/40">
                  <td className="p-3 border-r border-sand font-medium text-forest">{donor.name}</td>
                  <td className="p-3 border-r border-sand text-xs capitalize">
                    <span className={`px-2 py-0.5 border text-[11px] ${
                      donor.type === 'corporate' 
                        ? 'border-mustard bg-sand-light text-forest' 
                        : 'border-sand bg-paper text-charcoal'
                    }`}>
                      {donor.type}
                    </span>
                  </td>
                  <td className="p-3 border-r border-sand text-xs">
                    <div>{donor.email}</div>
                    <div className="text-charcoal-muted">{donor.phone}</div>
                  </td>
                  <td className="p-3 border-r border-sand text-xs font-mono text-charcoal-muted">
                    {donor._id}
                  </td>
                  {isAdmin && (
                    <td className="p-3 text-xs whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(donor)}
                        className="text-forest hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(donor._id)}
                        className="text-red-700 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DonorList;
