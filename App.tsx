
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Paso2_PreparacionTalleres } from './pages/Paso2_PreparacionTalleres';
import { Paso3_IdentificacionMediosVida } from './pages/Paso3_IdentificacionMediosVida';
import { Paso4_IdentificacionAmenazasImpactos } from './pages/Paso4_IdentificacionAmenazasImpactos';
import { Paso5_CaracterizacionGobernanza } from './pages/Paso5_CaracterizacionGobernanza';
import { Paso6_CaracterizacionConflicto } from './pages/Paso6_CaracterizacionConflicto';
import { Paso7_CaracterizacionCapacidadAdaptativa } from './pages/Paso7_CaracterizacionCapacidadAdaptativa';

// Import Herramienta components from their new individual files
import { Herramienta2_0_CartaInvitacion } from './components/paso2/Herramienta2_0_CartaInvitacion';
import { Herramienta2_1_IdentificacionActores } from './components/paso2/Herramienta2_1_IdentificacionActores';
import { Herramienta2_2_EstrategiaParticipacion } from './components/paso2/Herramienta2_2_EstrategiaParticipacion';
import { Herramienta2_3_DisenoFlujoTaller } from './components/paso2/Herramienta2_3_DisenoFlujoTaller';

import { Herramienta3_1_LluviaMediosVida } from './components/paso3/Herramienta3_1_LluviaMediosVida';
import { Herramienta3_1_DetalleSeleccion } from './components/paso3/Herramienta3_1_DetalleSeleccion';
import { Herramienta3_2_PriorizacionMediosVida } from './components/paso3/Herramienta3_2_PriorizacionMediosVida';
import { Herramienta3_2_ResumenPriorizacion } from './components/paso3/Herramienta3_2_ResumenPriorizacion';
import { Herramienta3_3_CaracterizacionMediosVida } from './components/paso3/Herramienta3_3_CaracterizacionMediosVida';
import { Herramienta3_3_DetalleSistemaProductivo } from './components/paso3/Herramienta3_3_DetalleSistemaProductivo';
import { Herramienta3_4_CaracterizacionEcosistemas } from './components/paso3/Herramienta3_4_CaracterizacionEcosistemas';
import { Herramienta3_4_DetalleEcosistema } from './components/paso3/Herramienta3_4_DetalleEcosistema'; // Added import
import { Herramienta3_5_CaracterizacionServiciosEcosistemicos } from './components/paso3/Herramienta3_5_CaracterizacionServiciosEcosistemicos';
import { Herramienta3_6_MapeoEcosistemasMediosVida } from './components/paso3/Herramienta3_6_MapeoEcosistemasMediosVida';

import { Herramienta4_1_MatricesAmenazas } from './components/paso4/Herramienta4_1_MatricesAmenazas';
import { Herramienta4_2_1_AmenazasMediosVidaConflictos } from './components/paso4/Herramienta4_2_1_AmenazasMediosVidaConflictos';
import { Herramienta4_2_2_AmenazasServiciosEcosistemicosConflictos } from './components/paso4/Herramienta4_2_2_AmenazasServiciosEcosistemicosConflictos';

import { Herramienta5_1_RelacionActoresPaisaje } from './components/paso5/Herramienta5_1_RelacionActoresPaisaje';
import { Herramienta5_2_EspaciosDialogoCoordinacion } from './components/paso5/Herramienta5_2_EspaciosDialogoCoordinacion';

import { Herramienta6_1_EvolucionConflictos } from './components/paso6/Herramienta6_1_EvolucionConflictos';
import { Herramienta6_2_ActoresInvolucradosConflictos } from './components/paso6/Herramienta6_2_ActoresInvolucradosConflictos';

import { Herramienta7_1_CuestionarioCapacidadAdaptativa } from './components/paso7/Herramienta7_1_CuestionarioCapacidadAdaptativa';


export const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#001F89] to-[#009EE2] text-white">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-1 p-6 overflow-auto bg-white text-gray-800 shadow-lg rounded-l-xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/paso2" element={<Paso2_PreparacionTalleres />}>
            <Route path="herramienta2_0" element={<Herramienta2_0_CartaInvitacion />} />
            <Route path="herramienta2_1" element={<Herramienta2_1_IdentificacionActores />} />
            <Route path="herramienta2_2" element={<Herramienta2_2_EstrategiaParticipacion />} />
            <Route path="herramienta2_3" element={<Herramienta2_3_DisenoFlujoTaller />} />
            <Route index element={<Navigate to="herramienta2_0" />} />
          </Route>
          <Route path="/paso3" element={<Paso3_IdentificacionMediosVida />}>
            <Route path="herramienta3_1" element={<Herramienta3_1_LluviaMediosVida />} />
            <Route path="herramienta3_1/detalle" element={<Herramienta3_1_DetalleSeleccion />} />
            <Route path="herramienta3_2" element={<Herramienta3_2_PriorizacionMediosVida />} />
            <Route path="herramienta3_2/resumen" element={<Herramienta3_2_ResumenPriorizacion />} />
            <Route path="herramienta3_3" element={<Herramienta3_3_CaracterizacionMediosVida />} />
            <Route path="herramienta3_3/caracterizar" element={<Herramienta3_3_DetalleSistemaProductivo />} />
            <Route path="herramienta3_4" element={<Herramienta3_4_CaracterizacionEcosistemas />} />
            <Route path="herramienta3_4/caracterizar" element={<Herramienta3_4_DetalleEcosistema />} /> {/* Added route */}
            <Route path="herramienta3_5" element={<Herramienta3_5_CaracterizacionServiciosEcosistemicos />} />
            <Route path="herramienta3_6" element={<Herramienta3_6_MapeoEcosistemasMediosVida />} />
            <Route index element={<Navigate to="herramienta3_1" />} />
          </Route>
          <Route path="/paso4" element={<Paso4_IdentificacionAmenazasImpactos />}>
            <Route path="herramienta4_1" element={<Herramienta4_1_MatricesAmenazas />} />
            <Route path="herramienta4_2_1" element={<Herramienta4_2_1_AmenazasMediosVidaConflictos />} />
            <Route path="herramienta4_2_2" element={<Herramienta4_2_2_AmenazasServiciosEcosistemicosConflictos />} />
            <Route index element={<Navigate to="herramienta4_1" />} />
          </Route>
          <Route path="/paso5" element={<Paso5_CaracterizacionGobernanza />}>
            <Route path="herramienta5_1" element={<Herramienta5_1_RelacionActoresPaisaje />} />
            <Route path="herramienta5_2" element={<Herramienta5_2_EspaciosDialogoCoordinacion />} />
            <Route index element={<Navigate to="herramienta5_1" />} />
          </Route>
          <Route path="/paso6" element={<Paso6_CaracterizacionConflicto />}>
            <Route path="herramienta6_1" element={<Herramienta6_1_EvolucionConflictos />} />
            <Route path="herramienta6_2" element={<Herramienta6_2_ActoresInvolucradosConflictos />} />
            <Route index element={<Navigate to="herramienta6_1" />} />
          </Route>
          <Route path="/paso7" element={<Paso7_CaracterizacionCapacidadAdaptativa />}>
            <Route path="herramienta7_1" element={<Herramienta7_1_CuestionarioCapacidadAdaptativa />} />
            <Route index element={<Navigate to="herramienta7_1" />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};