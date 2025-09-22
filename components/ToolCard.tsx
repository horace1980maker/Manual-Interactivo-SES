
import React from 'react';

interface ToolCardProps {
  title: string;
  description?: string;
  objetivo?: string;
  children: React.ReactNode;
  className?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({ title, description, objetivo, children, className }) => {
  return (
    <div className={`bg-white shadow-xl rounded-lg p-6 mb-8 border border-[#EBF5FF] ${className}`}>
      <h2 className="text-2xl font-bold text-[#001F89] mb-3 border-b-2 border-[#009EE2] pb-2">{title}</h2>
      {description && <p className="text-gray-600 mb-2 text-sm italic">{description}</p>}
      {objetivo && (
        <div className="mb-4 p-3 bg-[#EBF5FF] border border-[#009EE2]/30 rounded-md">
          <h3 className="font-semibold text-[#001F89]">Objetivo:</h3>
          <p className="text-gray-700 text-sm">{objetivo}</p>
        </div>
      )}
      <div className="mt-4 space-y-4">
        {children}
      </div>
    </div>
  );
};