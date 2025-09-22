
import React from 'react';
import { Link } from 'react-router-dom';
import { STEPS_DATA } from '../constants';

export const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-[#001F89] mb-4">
          Manual Interactivo de Facilitación SES
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Bienvenido a la aplicación interactiva para el Manual de Facilitación de Talleres Participativos para el Análisis de Fragilidad de los Sistemas Socio Ecológicos (SES).
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-2xl border border-[#EBF5FF]">
        <p className="text-gray-700 mb-6 leading-relaxed">
          Este manual ha sido preparado por CATIE en el marco de la Alianza UE-PNUMA sobre Cambio Climático, Medio Ambiente y Seguridad. Su objetivo es capacitar a facilitadores/as en la metodología para el análisis de vulnerabilidad y fragilidad de los sistemas socio ecológicos (SES) presentes en los paisajes priorizados por el Proyecto PARES.
        </p>
        <p className="text-gray-700 mb-8 leading-relaxed">
          Utilice la navegación lateral para explorar los diferentes pasos y herramientas metodológicas diseñadas para aprender la metodología y facilitar la planificación y ejecución de los talleres. Cada sección le guiará a través de los procesos necesarios para organizar, recopilar y analizar datos e información de manera participativa.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS_DATA.map((step) => (
            <Link 
              key={step.path}
              to={step.path} 
              className="block p-6 bg-gradient-to-br from-[#001F89] to-[#009EE2] hover:from-[#001A74] hover:to-[#008ACE] text-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              {step.icon && <step.icon className="h-10 w-10 mb-3 opacity-80" />}
              <h3 className="text-xl font-semibold mb-2">{step.name.split(':')[0]}</h3>
              <p className="text-sm opacity-90">{step.name.split(':')[1]?.trim()}</p>
            </Link>
          ))}
        </div>
         <div className="mt-10 text-center">
            <p className="text-sm text-gray-500">
                Basado en "MANUAL DE FACILITACIÓN TALLERES PARTICIPATIVOS PARA EL ANÁLISIS DE FRAGILIDAD DE LOS SISTEMAS SOCIO ECOLÓGICOS (SES)" y "Uniendo saberes, fortaleciendo territorios".
            </p>
        </div>
      </div>
    </div>
  );
};