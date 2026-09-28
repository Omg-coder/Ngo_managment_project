import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DonationForm from '../components/DonationForm';
import VolunteerList from '../components/VolunteerList';
import DonorList from '../components/DonorList';
import EventList from '../components/EventList';
import DonationList from '../components/DonationList';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('donate');
  const [refreshLedger, setRefreshLedger] = useState(0);

  const handleDonationRecorded = () => {
    setRefreshLedger((prev) => prev + 1);
  };

  const tabs = [
    { id: 'donate', label: 'Make a Contribution' },
    { id: 'volunteers', label: 'Volunteers Directory' },
    { id: 'donors', label: 'Benefactors & Donors' },
    { id: 'events', label: 'Community Events' },
    { id: 'donations', label: 'Donation Ledger' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-sand-light border border-sand p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-mustard block mb-1">
            Member Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-forest">
            Welcome back, {user?.name || 'Valued Member'}
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Logged in as <strong className="text-charcoal">{user?.email}</strong> &bull; Access Level: <span className="uppercase text-forest font-semibold">{user?.role}</span>
          </p>
        </div>

        {user?.role === 'admin' && (
          <a
            href="/admin"
            className="px-4 py-2 bg-forest text-paper text-xs font-medium hover:bg-forest-dark transition-colors"
          >
            Switch to Admin Panel
          </a>
        )}
      </div>

      {/* Tab Navigation */}
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

      {/* Tab Content Panels */}
      <div className="bg-paper">
        {activeTab === 'donate' && (
          <div className="space-y-8">
            <DonationForm onDonationAdded={handleDonationRecorded} />
            <div className="pt-6 border-t border-sand">
              <h3 className="font-serif text-lg text-forest mb-4">Recent Recorded Contributions</h3>
              <DonationList isAdmin={false} refreshTrigger={refreshLedger} />
            </div>
          </div>
        )}

        {activeTab === 'volunteers' && (
          <VolunteerList isAdmin={false} />
        )}

        {activeTab === 'donors' && (
          <DonorList isAdmin={false} />
        )}

        {activeTab === 'events' && (
          <EventList isAdmin={false} />
        )}

        {activeTab === 'donations' && (
          <DonationList isAdmin={false} refreshTrigger={refreshLedger} />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
