import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api/api';

const VolunteerList = ({ isAdmin = false }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state for creating / editing
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');

  const fetchVolunteers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/volunteers');
      if (res.ok) {
        const data = await res.json();
        setVolunteers(data);
      } else {
        const errData = await res.json();
        setError(errData.message || 'Failed to load volunteers.');
      }
    } catch (err) {
      setError(err.message || 'Error fetching volunteers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSkills('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (vol) => {
    setEditingId(vol._id);
    setName(vol.name);
    setEmail(vol.email);
    setPhone(vol.phone);
    setSkills(Array.isArray(vol.skills) ? vol.skills.join(', ') : vol.skills || '');
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      name,
      email,
      phone,
      skills: skillsArray
    };

    try {
      let res;
      if (editingId) {
        // PUT update
        res = await apiFetch(`/api/volunteers/${editingId}`, {
          method: 'PUT',
          body: payload
        });
      } else {
        // POST create
        res = await apiFetch('/api/volunteers', {
          method: 'POST',
          body: payload
        });
      }

      if (res.ok) {
        resetForm();
        fetchVolunteers();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to save volunteer.');
      }
    } catch (err) {
      alert(err.message || 'Error saving volunteer.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this volunteer?')) return;
    try {
      const res = await apiFetch(`/api/volunteers/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchVolunteers();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to delete volunteer.');
      }
    } catch (err) {
      alert(err.message || 'Error deleting volunteer.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sand">
        <div>
          <h3 className="text-xl font-serif text-forest">Registered Volunteers</h3>
          <p className="text-xs text-charcoal-muted mt-0.5">Individuals supporting field operations and logistics.</p>
        </div>
        {isAdmin && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-forest text-paper text-xs font-medium hover:bg-forest-dark transition-colors"
          >
            Add Volunteer
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
            {editingId ? 'Edit Volunteer' : 'Register New Volunteer'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1">Full Name</label>
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
              <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1">Skills (comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Teaching, First Aid, Logistics"
                className="w-full bg-paper border border-sand px-3 py-1.5 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-forest text-paper text-xs font-medium hover:bg-forest-dark"
            >
              {editingId ? 'Update Volunteer' : 'Save Volunteer'}
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

      {/* Volunteers Table / List */}
      {loading ? (
        <p className="text-sm text-charcoal-muted py-4">Loading volunteers...</p>
      ) : volunteers.length === 0 ? (
        <p className="text-sm text-charcoal-muted py-4">No volunteers registered yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-sand text-sm">
            <thead>
              <tr className="bg-sand-light border-b border-sand text-charcoal font-serif text-xs">
                <th className="p-3 border-r border-sand">Name</th>
                <th className="p-3 border-r border-sand">Contact</th>
                <th className="p-3 border-r border-sand">Skills</th>
                <th className="p-3 border-r border-sand">Joined Date</th>
                {isAdmin && <th className="p-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {volunteers.map((vol) => (
                <tr key={vol._id} className="border-b border-sand hover:bg-sand-light/40">
                  <td className="p-3 border-r border-sand font-medium text-forest">{vol.name}</td>
                  <td className="p-3 border-r border-sand text-xs">
                    <div>{vol.email}</div>
                    <div className="text-charcoal-muted">{vol.phone}</div>
                  </td>
                  <td className="p-3 border-r border-sand text-xs">
                    {Array.isArray(vol.skills) && vol.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {vol.skills.map((skill, idx) => (
                          <span key={idx} className="bg-sand-light border border-sand px-1.5 py-0.5 text-[11px]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-charcoal-muted">None specified</span>
                    )}
                  </td>
                  <td className="p-3 border-r border-sand text-xs text-charcoal-muted">
                    {vol.joinedDate ? new Date(vol.joinedDate).toLocaleDateString() : 'N/A'}
                  </td>
                  {isAdmin && (
                    <td className="p-3 text-xs whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(vol)}
                        className="text-forest hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vol._id)}
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

export default VolunteerList;
