
import React from 'react';
import { PasoNLayout } from './PasoNLayout';
import { STEPS_DATA } from '../constants';

const paso6Data = STEPS_DATA.find(step => step.path === '/paso6');

export const Paso6_CaracterizacionConflicto: React.FC = () => {
  if (!paso6Data) return <div>Error: Paso 6 data no encontrada.</div>;

  return (
    <PasoNLayout
      pasoNumber={6}
      pasoTitle="Paso 6: Caracterización del Conflicto"
      pasoDescription="El propósito de este Paso es profundizar en la comprensión de los conflictos identificados. Entender las dinámicas de dichos conflictos en relación con las amenazas climáticas y no climáticas seleccionadas es fundamental para articular soluciones basadas en la naturaleza que contribuyan a la paz sostenible. Este Paso tiene como objetivo analizar los conflictos que tengan una implicación substancial para la seguridad en el paisaje."
      tools={paso6Data.tools}
      currentPathBase="/paso6"
    />
  );
};