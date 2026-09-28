import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api/api';

const DonationList = ({ isAdmin = false, refreshTrigger = 0 }) => {
  const [donations, setDonations] = useState([]);
  const [donorsMap, setDonorsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Admin edit state
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editMode, setEditMode] = useState('online');

  const fetchDonations = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch both donations and donors to map names cleanly
      const [resDonations, resDonors] = await Promise.all([
        apiFetch('/api/donations'),
        apiFetch('/api/donors')
      ]);

      if (resDonations.ok) {
        const dataDonations = await resDonations.json();
        setDonations(dataDonations);
      } else {
        const errData = await resDonations.json();
        setError(errData.message || 'Failed to load donations.');
      }

      if (resDonors.ok) {
        const dataDonors = await resDonors.json();
        const map = {};
        dataDonors.forEach((d) => {
          map[d._id] = d.name;
        });
        setDonorsMap(map);
      }
    } catch (err) {
      setError(err.message || 'Error fetching donations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [refreshTrigger]);

  const handleEditClick = (donation) => {
    setEditingId(donation._id);
    setEditAmount(donation.amount);
    setEditMode(donation.mode || 'online');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editAmount || Number(editAmount) < 1) {
      alert('Amount must be at least ₹1.');
      return;
    }
    try {
      const res = await apiFetch(`/api/donations/${editingId}`, {
        method: 'PUT',
        body: {
          amount: Number(editAmount),
          mode: editMode
        }
      });
      if (res.ok) {
        setEditingId(null);
        fetchDonations();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to update donation.');
      }
    } catch (err) {
      alert(err.message || 'Error updating donation.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this donation record?')) return;
    try {
      const res = await apiFetch(`/api/donations/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchDonations();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to delete donation.');
      }
    } catch (err) {
      alert(err.message || 'Error deleting donation.');
    }
  };

  // Calculate total amount for simple summary
  const totalAmount = donations.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sand">
        <div>
          <h3 className="text-xl font-serif text-forest">Donations & Contribution Ledger</h3>
          <p className="text-xs text-charcoal-muted mt-0.5">Transparent record of funds contributed to NGO programs.</p>
        </div>
        <div className="bg-sand-light border border-sand px-3 py-1.5 text-xs text-forest">
          Total Recorded: <strong className="font-serif text-base text-forest">₹{totalAmount.toLocaleString()}</strong>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs">
          {error}
        </div>
      )}

      {/* Admin Inline Edit Form */}
      {isAdmin && editingId && (
        <form onSubmit={handleUpdate} className="bg-sand-light border border-sand p-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1">Edit Amount (₹)</label>
            <input
              type="number"
              min="1"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              required
              className="bg-paper border border-sand px-3 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1">Edit Mode</label>
            <select
              value={editMode}
              onChange={(e) => setEditMode(e.target.value)}
              className="bg-paper border border-sand px-3 py-1 text-sm"
            >
              <option value="online">Online</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-3 py-1.5 bg-forest text-paper text-xs font-medium hover:bg-forest-dark"
            >
              Save Change
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="px-3 py-1.5 border border-sand text-charcoal text-xs hover:bg-paper"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Donations Table */}
      {loading ? (
        <p className="text-sm text-charcoal-muted py-4">Loading donations ledger...</p>
      ) : donations.length === 0 ? (
        <p className="text-sm text-charcoal-muted py-4">No donation records found yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-sand text-sm">
            <thead>
              <tr className="bg-sand-light border-b border-sand text-charcoal font-serif text-xs">
                <th className="p-3 border-r border-sand">Date</th>
                <th className="p-3 border-r border-sand">Contributor / Donor</th>
                <th className="p-3 border-r border-sand">Amount</th>
                <th className="p-3 border-r border-sand">Payment Mode</th>
                {isAdmin && <th className="p-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d._id} className="border-b border-sand hover:bg-sand-light/40">
                  <td className="p-3 border-r border-sand text-xs text-charcoal-muted whitespace-nowrap">
                    {d.date ? new Date(d.date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-3 border-r border-sand text-xs">
                    <div className="font-medium text-forest">
                      {donorsMap[d.donorId] || 'Community Contributor'}
                    </div>
                    {d.donorId && (
                      <div className="font-mono text-[10px] text-charcoal-muted">
                        Ref: {d.donorId}
                      </div>
                    )}
                  </td>
                  <td className="p-3 border-r border-sand font-serif font-medium text-forest">
                    ₹{Number(d.amount).toLocaleString()}
                  </td>
                  <td className="p-3 border-r border-sand text-xs capitalize">
                    <span className="bg-paper border border-sand px-2 py-0.5 text-[11px]">
                      {d.mode}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="p-3 text-xs whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(d)}
                        className="text-forest hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(d._id)}
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

export default DonationList;
