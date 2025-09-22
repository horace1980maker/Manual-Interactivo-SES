
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { STEPS_DATA } from '../constants';
import { 
  ChevronDownIcon, 
  ChevronRightIcon, 
  HomeIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  AcademicCapIcon // Placeholder for app icon when collapsed
} from '@heroicons/react/24/solid';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// Helper function to extract the base step path from a full pathname
function getStepPathFromLocation(pathname: string): string | null {
  const step = STEPS_DATA.find(s => pathname.startsWith(s.path));
  return step ? step.path : null;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const [openStep, setOpenStep] = useState<string | null>(() => {
    return getStepPathFromLocation(location.pathname);
  });

  const prevLocationPathnameRef = useRef<string>(location.pathname);

  useEffect(() => {
    const prevStepPath = getStepPathFromLocation(prevLocationPathnameRef.current);
    const currentStepPath = getStepPathFromLocation(location.pathname);

    if (currentStepPath !== prevStepPath) {
      setOpenStep(currentStepPath);
    }
    prevLocationPathnameRef.current = location.pathname;
  }, [location.pathname]);

  const toggleAccordionStep = (stepPath: string) => {
    setOpenStep(prevOpenStep => (prevOpenStep === stepPath ? null : stepPath));
  };

  return (
    <div 
      className={`bg-[#001F89] text-white p-4 space-y-4 overflow-y-auto transition-all duration-300 ease-in-out shadow-lg
                  ${isSidebarOpen ? 'w-80' : 'w-20'}`}
    >
      <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} mb-4`}>
        {isSidebarOpen ? (
          <h1 className="text-3xl font-bold text-white">Manual SES</h1>
        ) : (
          <AcademicCapIcon className="h-8 w-8 text-white" /> // App icon when collapsed
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-[#001A74] focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={isSidebarOpen ? "Colapsar menú lateral" : "Expandir menú lateral"}
        >
          {isSidebarOpen ? (
            <ChevronDoubleLeftIcon className="h-6 w-6" />
          ) : (
            <ChevronDoubleRightIcon className="h-6 w-6" />
          )}
        </button>
      </div>
      
      <nav>
        <ul>
          <li>
            <Link
              to="/"
              className={`flex items-center p-3 rounded-lg hover:bg-[#001A74] transition-colors duration-200 group
                          ${isSidebarOpen ? 'space-x-3' : 'justify-center'}
                          ${location.pathname === '/' ? 'bg-[#009EE2] font-semibold' : ''}`}
              title="Inicio"
            >
              <HomeIcon className="h-6 w-6 flex-shrink-0" />
              {isSidebarOpen && <span className="whitespace-normal">Inicio</span>}
            </Link>
          </li>
          {STEPS_DATA.map((step) => (
            <li key={step.path} className="mt-1">
              <div className={`flex items-center rounded-lg hover:bg-[#001A74] transition-colors duration-200 group
                              ${(location.pathname.startsWith(step.path) && isSidebarOpen && openStep === step.path) ? 'bg-[#001A74]' : ''}
                              ${(!isSidebarOpen && location.pathname.startsWith(step.path)) ? 'bg-[#008ACE]' : ''}
                            `}>
                <Link
                  to={step.path}
                  className={`flex items-center flex-grow p-3 
                              ${isSidebarOpen ? 'space-x-3' : 'justify-center'}`}
                  title={step.name}
                  onClick={() => { if (!isSidebarOpen) setOpenStep(null); }} // Collapse accordion if sidebar is closed and navigating
                >
                  {step.icon && <step.icon className="h-6 w-6 flex-shrink-0" />}
                  {isSidebarOpen && <span className="text-left flex-1 whitespace-normal">{step.name}</span>}
                </Link>
                {isSidebarOpen && step.tools && step.tools.length > 0 && (
                  <button
                    onClick={() => toggleAccordionStep(step.path)}
                    className="p-2 mr-1 rounded-md hover:bg-[#00105C]"
                    aria-expanded={openStep === step.path}
                    aria-label={`Expandir ${step.name}`}
                  >
                    {openStep === step.path ? (
                      <ChevronDownIcon className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5 flex-shrink-0" />
                    )}
                  </button>
                )}
              </div>
              {isSidebarOpen && openStep === step.path && step.tools && (
                <ul className="pl-5 mt-1 space-y-0.5 border-l-2 border-[#001A74] ml-3">
                  {step.tools.map((tool) => (
                    <li key={tool.id}>
                      <Link
                        to={`${step.path}/${tool.path}`}
                        className={`block p-2 rounded-md hover:bg-[#001A74] hover:text-white transition-colors duration-200 text-sm whitespace-normal leading-snug
                                    ${location.pathname === `${step.path}/${tool.path}` ? 'bg-[#008ACE] text-white font-medium shadow-sm' : 'text-slate-200 hover:text-white'}`}
                        title={tool.name}
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};