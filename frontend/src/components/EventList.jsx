import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api/api';

const EventList = ({ isAdmin = false, isPublicPreview = false }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerRole, setVolunteerRole] = useState('');
  const [assignedList, setAssignedList] = useState([]);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      } else {
        // If unauthenticated on public preview, fallback gracefully
        if (!isPublicPreview) {
          const errData = await res.json();
          setError(errData.message || 'Failed to load events.');
        }
      }
    } catch (err) {
      if (!isPublicPreview) {
        setError(err.message || 'Error fetching events.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDate('');
    setLocation('');
    setVolunteerName('');
    setVolunteerRole('');
    setAssignedList([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddVolunteerToEvent = () => {
    if (!volunteerName || !volunteerRole) {
      alert('Please provide both volunteer name and role.');
      return;
    }
    setAssignedList([...assignedList, { name: volunteerName, role: volunteerRole }]);
    setVolunteerName('');
    setVolunteerRole('');
  };

  const handleRemoveVolunteerFromEvent = (index) => {
    setAssignedList(assignedList.filter((_, idx) => idx !== index));
  };

  const handleEditClick = (event) => {
    setEditingId(event._id);
    setTitle(event.title);
    setDate(event.date ? new Date(event.date).toISOString().split('T')[0] : '');
    setLocation(event.location);
    setAssignedList(event.volunteersAssigned || []);
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      date,
      location,
      volunteersAssigned: assignedList
    };

    try {
      let res;
      if (editingId) {
        res = await apiFetch(`/api/events/${editingId}`, {
          method: 'PUT',
          body: payload
        });
      } else {
        res = await apiFetch('/api/events', {
          method: 'POST',
          body: payload
        });
      }

      if (res.ok) {
        resetForm();
        fetchEvents();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to save event.');
      }
    } catch (err) {
      alert(err.message || 'Error saving event.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await apiFetch(`/api/events/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchEvents();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to delete event.');
      }
    } catch (err) {
      alert(err.message || 'Error deleting event.');
    }
  };

  return (
    <div className="space-y-6">
      {!isPublicPreview && (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sand">
          <div>
            <h3 className="text-xl font-serif text-forest">Community Events & Campaigns</h3>
            <p className="text-xs text-charcoal-muted mt-0.5">Medical camps, distribution drives, and awareness seminars.</p>
          </div>
          {isAdmin && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-forest text-paper text-xs font-medium hover:bg-forest-dark transition-colors"
            >
              Organize Event
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs">
          {error}
        </div>
      )}

      {/* Admin Add / Edit Form */}
      {isAdmin && showForm && (
        <form onSubmit={handleFormSubmit} className="bg-sand-light border border-sand p-5 space-y-4">
          <h4 className="font-serif text-forest text-base">
            {editingId ? 'Edit Event Details' : 'Create New Community Event'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1">Event Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-paper border border-sand px-3 py-1.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-paper border border-sand px-3 py-1.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full bg-paper border border-sand px-3 py-1.5 text-sm"
              />
            </div>
          </div>

          {/* Volunteers Assigned Sub-section */}
          <div className="pt-2 border-t border-sand">
            <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-2 font-medium">
              Assign Volunteers for this Event
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              <input
                type="text"
                placeholder="Volunteer Name"
                value={volunteerName}
                onChange={(e) => setVolunteerName(e.target.value)}
                className="bg-paper border border-sand px-3 py-1 text-xs"
              />
              <input
                type="text"
                placeholder="Assigned Role (e.g. Lead, Logistics)"
                value={volunteerRole}
                onChange={(e) => setVolunteerRole(e.target.value)}
                className="bg-paper border border-sand px-3 py-1 text-xs"
              />
              <button
                type="button"
                onClick={handleAddVolunteerToEvent}
                className="px-3 py-1 bg-mustard text-forest-dark text-xs font-medium hover:bg-mustard-hover"
              >
                Add to Event
              </button>
            </div>

            {assignedList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {assignedList.map((item, idx) => (
                  <span key={idx} className="bg-paper border border-sand px-2 py-1 text-xs flex items-center gap-1.5">
                    <strong>{item.name}</strong> ({item.role})
                    <button
                      type="button"
                      onClick={() => handleRemoveVolunteerFromEvent(idx)}
                      className="text-red-600 hover:text-red-800 text-[10px] font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-forest text-paper text-xs font-medium hover:bg-forest-dark"
            >
              {editingId ? 'Update Event' : 'Save Event'}
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

      {/* Events Table / List */}
      {loading ? (
        <p className="text-sm text-charcoal-muted py-4">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-charcoal-muted py-4">No upcoming events scheduled right now.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-sand text-sm">
            <thead>
              <tr className="bg-sand-light border-b border-sand text-charcoal font-serif text-xs">
                <th className="p-3 border-r border-sand">Event Title</th>
                <th className="p-3 border-r border-sand">Date</th>
                <th className="p-3 border-r border-sand">Location</th>
                <th className="p-3 border-r border-sand">Assigned Volunteers</th>
                {isAdmin && <th className="p-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-b border-sand hover:bg-sand-light/40">
                  <td className="p-3 border-r border-sand font-medium text-forest">{event.title}</td>
                  <td className="p-3 border-r border-sand text-xs text-charcoal-muted whitespace-nowrap">
                    {event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}
                  </td>
                  <td className="p-3 border-r border-sand text-xs">{event.location}</td>
                  <td className="p-3 border-r border-sand text-xs">
                    {Array.isArray(event.volunteersAssigned) && event.volunteersAssigned.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {event.volunteersAssigned.map((vol, idx) => (
                          <span key={idx} className="bg-paper border border-sand px-1.5 py-0.5 text-[11px]">
                            {vol.name} <span className="text-charcoal-muted font-normal">({vol.role})</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-charcoal-muted">Open for assignments</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="p-3 text-xs whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(event)}
                        className="text-forest hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
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

export default EventList;
