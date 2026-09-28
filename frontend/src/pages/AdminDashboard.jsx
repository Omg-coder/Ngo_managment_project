import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import VolunteerList from '../components/VolunteerList';
import DonorList from '../components/DonorList';
import EventList from '../components/EventList';
import DonationList from '../components/DonationList';
import DonationForm from '../components/DonationForm';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('volunteers');
  const [refreshLedger, setRefreshLedger] = useState(0);

  const tabs = [
    { id: 'volunteers', label: 'Manage Volunteers' },
    { id: 'donors', label: 'Manage Donors' },
    { id: 'events', label: 'Manage Events' },
    { id: 'donations', label: 'Donation Audit Ledger' },
    { id: 'record-donation', label: 'Record New Donation' },
  ];

  const handleDonationRecorded = () => {
    setRefreshLedger((prev) => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Admin Header Banner */}
      <div className="bg-sand-light border border-sand p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-mustard block mb-1">
            Administrative Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-forest">
            NGO Administration Console
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Logged in as <strong className="text-charcoal">{user?.name}</strong> ({user?.email}) &bull; Role: <span className="uppercase text-forest font-semibold">Administrator</span>
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href="/dashboard"
            className="px-4 py-2 border border-sand text-charcoal text-xs font-medium hover:bg-paper transition-colors"
          >
            View Member Dashboard
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-sand flex flex-wrap gap-2 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 font-medium transition-colors border-b-2 -mb-px text-xs sm:text-sm ${
              activeTab === tab.id
                ? 'border-forest text-forest bg-paper'
                : 'border-transparent text-charcoal-muted hover:text-forest hover:border-sand'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-paper">
        {activeTab === 'volunteers' && (
          <VolunteerList isAdmin={true} />
        )}

        {activeTab === 'donors' && (
          <DonorList isAdmin={true} />
        )}

        {activeTab === 'events' && (
          <EventList isAdmin={true} />
        )}

        {activeTab === 'donations' && (
          <DonationList isAdmin={true} refreshTrigger={refreshLedger} />
        )}

        {activeTab === 'record-donation' && (
          <div className="space-y-8">
            <DonationForm onDonationAdded={handleDonationRecorded} isAdmin={true} />
            <div className="pt-6 border-t border-sand">
              <h3 className="font-serif text-lg text-forest mb-4">Complete Donations Ledger</h3>
              <DonationList isAdmin={true} refreshTrigger={refreshLedger} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
