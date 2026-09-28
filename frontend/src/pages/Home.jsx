import React from 'react';
import { Link } from 'react-router';
import EventList from '../components/EventList';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Mission-First Hero Section */}
      <section className="bg-forest text-paper py-16 sm:py-24 px-4 sm:px-6 border-b border-sand">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="font-serif italic text-sand-light text-base sm:text-lg">
            Dedicated to community empowerment, direct relief, and education.
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-paper leading-tight">
            Restoring dignity, one community at a time.
          </h1>
          <p className="text-sm sm:text-base text-sand-light max-w-2xl mx-auto leading-relaxed">
            The HopeHarbor Initiative is a grassroots collective bridging the gap between committed volunteers, generous benefactors, and underserved families across rural and urban districts.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-mustard text-forest-dark font-medium text-sm hover:bg-mustard-hover transition-colors tracking-wide"
            >
              Support the Mission
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 border border-sand text-paper font-medium text-sm hover:bg-forest-dark transition-colors"
            >
              Volunteer With Us
            </Link>
          </div>
        </div>
      </section>

      {/* Core Mission & Narrative */}
      <section className="max-w-5xl mx-auto py-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif text-forest mb-4 leading-snug">
              Every initiative begins with an open ear and a collective effort.
            </h2>
            <div className="space-y-4 text-sm text-charcoal leading-relaxed">
              <p>
                Founded as a student-led community project, our mission is grounded in absolute transparency. We manage volunteers, coordinate direct relief distributions, and keep an open ledger of all received donations.
              </p>
              <p>
                Whether it is organizing medical health camps, distributing school supplies to first-generation learners, or responding to localized climate emergencies, our volunteers are on the ground ensuring that every rupee creates tangible change.
              </p>
            </div>
          </div>

          <div className="bg-sand-light border border-sand p-6 sm:p-8 space-y-4">
            <h3 className="font-serif text-lg text-forest">Our Operational Pillars</h3>
            <div className="border-t border-sand pt-3 space-y-3 text-xs sm:text-sm text-charcoal">
              <div>
                <strong className="block text-forest">Grassroots Volunteer Mobilization</strong>
                <span className="text-charcoal-muted">Skill-matched volunteers placed in community education and health clinics.</span>
              </div>
              <div className="border-t border-sand/60 pt-2">
                <strong className="block text-forest">Direct Benefactor Accountability</strong>
                <span className="text-charcoal-muted">Real-time ledger tracking every rupee contributed by individuals and corporate allies.</span>
              </div>
              <div className="border-t border-sand/60 pt-2">
                <strong className="block text-forest">Community-Centered Events</strong>
                <span className="text-charcoal-muted">Locally coordinated food distribution drives, workshops, and awareness sessions.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ongoing Community Events (Public Preview) */}
      <section className="border-t border-sand bg-sand-light/50 py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif text-forest">Upcoming Field Work & Events</h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
                Open events where volunteers and organizers meet on the ground.
              </p>
            </div>
            <Link
              to="/login"
              className="text-xs font-medium text-forest hover:text-mustard underline decoration-sand"
            >
              Sign in to volunteer or donate
            </Link>
          </div>

          <EventList isPublicPreview={true} />
        </div>
      </section>

      {/* Donate / Join Call to Action */}
      <section className="border-t border-sand py-16 px-4 sm:px-6 text-center bg-paper">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif text-forest">
            Ready to stand with your community?
          </h2>
          <p className="text-sm text-charcoal-muted">
            Whether you want to contribute funds or pledge your time as a field volunteer, your participation makes a lasting difference.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              to="/register"
              className="px-5 py-2.5 bg-forest text-paper text-sm font-medium hover:bg-forest-dark transition-colors"
            >
              Register an Account
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 border border-sand text-charcoal text-sm hover:bg-sand-light transition-colors"
            >
              Access Member Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sand bg-forest text-sand-light py-8 px-4 sm:px-6 text-xs text-center">
        <p className="font-serif text-paper text-sm mb-1">HopeHarbor Initiative &bull; Non-Governmental Organization</p>
        <p className="opacity-80">Built with Node.js, Express, MongoDB & React for College DBMS Project</p>
      </footer>
    </div>
  );
};

export default Home;
