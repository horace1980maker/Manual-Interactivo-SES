
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ToolDefinition } from '../types';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

interface PasoNLayoutProps {
  pasoNumber: number;
  pasoTitle: string;
  pasoDescription: string;
  tools: ToolDefinition[];
  currentPathBase: string;
}

export const PasoNLayout: React.FC<PasoNLayoutProps> = ({ pasoNumber, pasoTitle, pasoDescription, tools, currentPathBase }) => {
  const location = useLocation();

  // Find the current tool to display its full title
  const currentToolPath = location.pathname.split('/').pop();
  const currentTool = tools.find(tool => tool.path === currentToolPath);
  const pageDisplayTitle = currentTool ? `${pasoTitle}: ${currentTool.name}` : pasoTitle;


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#001F89] mb-2">{pageDisplayTitle}</h1>
        <p className="text-gray-600 mb-6">{pasoDescription}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-[#EBF5FF] p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-[#001F89] mb-3">Herramientas del Paso {pasoNumber}</h3>
          <ul className="space-y-2">
            {tools.map(tool => (
              <li key={tool.id}>
                <Link
                  to={`${currentPathBase}/${tool.path}`}
                  className={`flex items-center justify-between p-2 rounded-md text-sm transition-colors duration-150
                    ${location.pathname === `${currentPathBase}/${tool.path}`
                      ? 'bg-[#009EE2] text-white font-medium shadow'
                      : 'text-[#001F89] hover:bg-[#001F89]/20'
                    }`}
                >
                  {tool.name}
                  {location.pathname === `${currentPathBase}/${tool.path}` && <ChevronRightIcon className="h-4 w-4" />}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <Outlet /> {/* This is where the specific Herramienta component will render */}
        </div>
      </div>
    </div>
  );
};
