
import { HomeIcon, AdjustmentsHorizontalIcon, MapIcon, ShieldCheckIcon, UsersIcon, ChatBubbleBottomCenterTextIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';
import { StepDefinition } from './types';

// Import Herramienta components from their new individual files
import { Herramienta2_0_CartaInvitacion } from './components/paso2/Herramienta2_0_CartaInvitacion';
import { Herramienta2_1_IdentificacionActores } from './components/paso2/Herramienta2_1_IdentificacionActores';
import { Herramienta2_2_EstrategiaParticipacion } from './components/paso2/Herramienta2_2_EstrategiaParticipacion';
import { Herramienta2_3_DisenoFlujoTaller } from './components/paso2/Herramienta2_3_DisenoFlujoTaller';

import { Herramienta3_1_LluviaMediosVida } from './components/paso3/Herramienta3_1_LluviaMediosVida';
import { Herramienta3_2_PriorizacionMediosVida } from './components/paso3/Herramienta3_2_PriorizacionMediosVida';
import { Herramienta3_3_CaracterizacionMediosVida } from './components/paso3/Herramienta3_3_CaracterizacionMediosVida';
import { Herramienta3_4_CaracterizacionEcosistemas } from './components/paso3/Herramienta3_4_CaracterizacionEcosistemas';
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


export const STEPS_DATA: StepDefinition[] = [
  {
    name: 'Paso 2: Preparación de Talleres',
    path: '/paso2',
    icon: AdjustmentsHorizontalIcon,
    tools: [
      { id: 'h2_0', name: 'H2.0 Carta de Invitación', description: 'Borrador base de carta de invitación a taller.', path: 'herramienta2_0', component: Herramienta2_0_CartaInvitacion },
      { id: 'h2_1', name: 'H2.1 Identificación de Actores', description: 'Identificación de actores a convocar a los talleres participativos.', path: 'herramienta2_1', component: Herramienta2_1_IdentificacionActores },
      { id: 'h2_2', name: 'H2.2 Estrategia de Participación', description: 'Estrategia de participación e inclusión.', path: 'herramienta2_2', component: Herramienta2_2_EstrategiaParticipacion },
      { id: 'h2_3', name: 'H2.3 Diseño de Flujo de Taller', description: 'Diseño de flujo de taller y logística.', path: 'herramienta2_3', component: Herramienta2_3_DisenoFlujoTaller },
    ],
  },
  {
    name: 'Paso 3: Identificación de Medios de Vida, Ecosistemas y Servicios',
    path: '/paso3',
    icon: MapIcon,
    tools: [
      { id: 'h3_1', name: 'H3.1 Lluvia de Medios de Vida y Ecosistemas', description: 'Identificar principales medios de vida y ecosistemas.', path: 'herramienta3_1', component: Herramienta3_1_LluviaMediosVida },
      { id: 'h3_2', name: 'H3.2 Priorización de Medios de Vida', description: 'Priorizar medios de vida según su importancia.', path: 'herramienta3_2', component: Herramienta3_2_PriorizacionMediosVida },
      { id: 'h3_3', name: 'H3.3 Caracterización de Medios de Vida', description: 'Analizar estructura, uso final, tenencia y cadenas de valor.', path: 'herramienta3_3', component: Herramienta3_3_CaracterizacionMediosVida },
      { id: 'h3_4', name: 'H3.4 Caracterización de Ecosistemas', description: 'Analizar funcionalidad y servicios ecosistémicos.', path: 'herramienta3_4', component: Herramienta3_4_CaracterizacionEcosistemas },
      { id: 'h3_5', name: 'H3.5 Caracterización de Servicios Ecosistémicos', description: 'Relación con los medios de vida.', path: 'herramienta3_5', component: Herramienta3_5_CaracterizacionServiciosEcosistemicos },
      { id: 'h3_6', name: 'H3.6 Mapeo de Ecosistemas y Medios de Vida', description: 'Visualizar distribución espacial.', path: 'herramienta3_6', component: Herramienta3_6_MapeoEcosistemasMediosVida },
    ],
  },
  {
    name: 'Paso 4: Identificación de Amenazas e Impactos',
    path: '/paso4',
    icon: ShieldCheckIcon,
    tools: [
        { id: 'h4_1', name: 'H4.1 Matrices de Amenazas', description: 'Identificación de amenazas climáticas y no-climáticas.', path: 'herramienta4_1', component: Herramienta4_1_MatricesAmenazas },
        { id: 'h4_2_1', name: 'H4.2.1 Amenazas (Medios de Vida) y Conflictos', description: 'Caracterización de amenazas (para medios de vida) e identificación de conflictos.', path: 'herramienta4_2_1', component: Herramienta4_2_1_AmenazasMediosVidaConflictos },
        { id: 'h4_2_2', name: 'H4.2.2 Amenazas (Servicios Ecosistémicos) y Conflictos', description: 'Caracterización de amenazas (para servicios ecosistémicos) e identificación de conflictos.', path: 'herramienta4_2_2', component: Herramienta4_2_2_AmenazasServiciosEcosistemicosConflictos },
    ],
  },
  {
    name: 'Paso 5: Caracterización de la Gobernanza',
    path: '/paso5',
    icon: UsersIcon,
    tools: [
      { id: 'h5_1', name: 'H5.1 Relación de Actores con el Paisaje', description: 'Mapear relaciones de poder e influencia.', path: 'herramienta5_1', component: Herramienta5_1_RelacionActoresPaisaje },
      { id: 'h5_2', name: 'H5.2 Espacios de Diálogo y Coordinación', description: 'Identificar y analizar espacios de articulación multiactor.', path: 'herramienta5_2', component: Herramienta5_2_EspaciosDialogoCoordinacion },
    ],
  },
  {
    name: 'Paso 6: Caracterización del Conflicto',
    path: '/paso6',
    icon: ChatBubbleBottomCenterTextIcon,
    tools: [
      { id: 'h6_1', name: 'H6.1 Evolución de los Conflictos', description: 'Registrar eventos clave y comprender condiciones.', path: 'herramienta6_1', component: Herramienta6_1_EvolucionConflictos },
      { id: 'h6_2', name: 'H6.2 Actores Involucrados en los Conflictos', description: 'Identificar actores clave y su rol e influencia.', path: 'herramienta6_2', component: Herramienta6_2_ActoresInvolucradosConflictos },
    ],
  },
  {
    name: 'Paso 7: Caracterización de la Capacidad Adaptativa',
    path: '/paso7',
    icon: PuzzlePieceIcon,
    tools: [
      { id: 'h7_1', name: 'H7.1 Cuestionario de Capacidad Adaptativa', description: 'Recolectar datos para estimar capacidad de adaptación.', path: 'herramienta7_1', component: Herramienta7_1_CuestionarioCapacidadAdaptativa },
    ],
  },
];
