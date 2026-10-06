import React from 'react';

const TicketCard = ({ title, department, status }) => {
  // Determine badge colors based on status
  let badgeClasses = 'bg-gray-700 text-gray-300'; // fallback
  
  if (status === 'Pending') {
    badgeClasses = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  } else if (status === 'Completed') {
    badgeClasses = 'bg-green-500/20 text-green-400 border-green-500/30';
  } else if (status === 'Urgent') {
    badgeClasses = 'bg-red-500/20 text-red-400 border-red-500/30';
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:bg-gray-750 transition-colors shadow-sm hover:shadow-md flex flex-col justify-between group cursor-pointer h-full">
      <div>
        <div className="flex justify-between items-start mb-3 gap-3">
          <h3 className="text-lg font-semibold text-white leading-tight group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${badgeClasses} whitespace-nowrap`}>
            {status}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-400 bg-gray-900 px-3 py-1 rounded-md">
          {department}
        </span>
        <button className="text-sm font-medium text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
          View details →
        </button>
      </div>
    </div>
  );
};

export default TicketCard;
