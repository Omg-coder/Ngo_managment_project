import React, { useState } from 'react';
import { apiFetch } from '../api/api';
import { useAuth } from '../context/AuthContext';

const DonationForm = ({ onDonationAdded, isAdmin = false }) => {
  const { user } = useAuth();
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('online');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!amount || Number(amount) < 1) {
      setErrorMessage('Please enter a valid amount (at least ₹1).');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        amount: Number(amount),
        mode
      };

      // Admin can specify any custom contributor/donor name
      if (isAdmin && donorName.trim()) {
        payload.donorName = donorName.trim();
      }

      const res = await apiFetch('/api/donations', {
        method: 'POST',
        body: payload
      });

      const data = await res.json();

      if (res.ok) {
        const contributorDisplay = (isAdmin && donorName.trim()) ? donorName.trim() : (user?.name || 'You');
        setSuccessMessage(`Success! A contribution of ₹${Number(amount).toLocaleString()} from "${contributorDisplay}" via ${mode} has been recorded.`);
        setAmount('');
        if (isAdmin) setDonorName('');
        if (onDonationAdded) {
          onDonationAdded(data.donation);
        }
      } else {
        setErrorMessage(data.message || 'Failed to submit donation.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-paper border border-sand p-6 sm:p-8 max-w-xl">
      <h3 className="text-xl font-serif text-forest mb-2">
        {isAdmin ? 'Record External or Offline Donation' : 'Contribute to the Cause'}
      </h3>
      <p className="text-charcoal-muted text-sm mb-4">
        {isAdmin
          ? 'As an administrator, you can record donations collected in person, via bank transfer, or from any individual or corporate sponsor.'
          : 'Every rupee goes directly towards local relief efforts, student education, and healthcare kits.'}
      </p>

      {/* For regular users: Show their profile. For Admin: Provide an editable name field */}
      {!isAdmin && (
        <div className="mb-6 p-3 bg-sand-light border border-sand text-xs text-charcoal">
          Contributing as: <strong className="text-forest">{user?.name || 'Valued Supporter'}</strong> 
          <span className="text-charcoal-muted"> ({user?.email || 'Logged in user'})</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-sand-light border border-mustard text-forest text-sm font-medium">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Admin only: Any donor / contributor name */}
        {isAdmin && (
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1.5 font-medium">
              Contributor / Donor Name
            </label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="e.g. Ramesh Gupta, Tata Trusts, Walk-in Donor..."
              className="w-full bg-paper border border-sand px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-forest"
            />
            <p className="text-[11px] text-charcoal-muted mt-1">
              Leave blank to record under your admin account, or type any person/company name.
            </p>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1.5 font-medium">
            Donation Amount (INR ₹)
          </label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 500"
            required
            className="w-full bg-paper border border-sand px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-forest"
          />
        </div>

        {/* Mode */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-charcoal-muted mb-1.5 font-medium">
            Payment Mode
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full bg-paper border border-sand px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-forest"
          >
            <option value="online">Online Transfer / UPI</option>
            <option value="cash">Cash In-Hand</option>
            <option value="cheque">Demand Draft / Cheque</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-forest text-paper font-medium text-sm hover:bg-forest-dark transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : (isAdmin ? 'Record Donation Entry' : 'Submit Donation')}
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
