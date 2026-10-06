import React from 'react';
import TicketCard from './TicketCard';

const mockTickets = [
  { id: 1, title: 'Server Rack 4 Power Failure', department: 'IT', status: 'Urgent' },
  { id: 2, title: 'Quarterly Review Scheduling', department: 'HR', status: 'Pending' },
  { id: 3, title: 'HVAC Maintenance in Lobby', department: 'Facilities', status: 'Completed' },
  { id: 4, title: 'Update Onboarding Docs', department: 'HR', status: 'Pending' },
  { id: 5, title: 'Network Switch Upgrade', department: 'IT', status: 'Completed' },
  { id: 6, title: 'Spill in Cafeteria', department: 'Facilities', status: 'Urgent' },
];

const DashboardList = () => {
  return (
    <div className="w-full mx-auto p-6 bg-gray-900 min-h-screen text-white">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Support Dashboard</h1>
        
        <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700 shadow-inner">
          <button className="px-4 py-2 rounded-md bg-gray-700 text-white font-medium shadow-sm transition-all text-sm">
            All
          </button>
          <button className="px-4 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 font-medium transition-all text-sm">
            Pending
          </button>
          <button className="px-4 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 font-medium transition-all text-sm">
            Completed
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            title={ticket.title}
            department={ticket.department}
            status={ticket.status}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardList;
