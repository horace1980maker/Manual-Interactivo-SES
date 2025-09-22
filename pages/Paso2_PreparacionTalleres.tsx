
import React from 'react';
import { PasoNLayout } from './PasoNLayout';
import { STEPS_DATA } from '../constants';

const paso2Data = STEPS_DATA.find(step => step.path === '/paso2');

export const Paso2_PreparacionTalleres: React.FC = () => {
  if (!paso2Data) return <div>Error: Paso 2 data no encontrada.</div>;

  return (
    <PasoNLayout
      pasoNumber={2}
      pasoTitle="Paso 2: Preparación de los Talleres"
      pasoDescription="El propósito de este Paso es garantizar la planificación de los talleres participativos, asegurando que los aspectos logísticos, metodológicos y de inclusión sean considerados de manera integral. A través de este proceso, se busca optimizar la participación de actores clave, definir estrategias de facilitación y establecer una estructura clara para el desarrollo de los talleres."
      tools={paso2Data.tools}
      currentPathBase="/paso2"
    />
  );
};