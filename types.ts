
export interface NavItem {
  name: string;
  path: string;
  subItems?: NavSubItem[];
  icon?: React.ElementType;
}

export interface NavSubItem {
  name: string;
  path: string;
  fullPath: string; // Added for easier linking
}

// Herramienta 2.1 Types
export interface Actor {
  id: string;
  nombre: string;
  tipo: string;
  rol: string;
  conflictoCon: string;
  colaboracionCon: string;
  poder: number;
  interes: number;
}

// Herramienta 2.3 Types
export interface AgendaItem {
  hora: string;
  actividad: string;
}

// Herramienta 3.1 - Card Types
export interface LivelihoodItem {
  id: string;
  nombre: string;
  codigo: string;
  categoria: 'medioDeVida';
  isAutoconsumo?: boolean;
  isComercial?: boolean;
}

export interface EcosystemItem {
  id: string;
  nombre: string;
  codigo: string;
  salud: 1 | 2 | 3;
  categoria: 'ecosistema';
}

// New type for Actors to be used in cards
export interface ActorCardItem {
  id: string;
  nombre: string;
  codigo: string; // e.g., Actor's type or a generic "ACTOR"
  categoria: 'actor';
  // Include other relevant fields from ActorPaisaje if needed for card display, e.g., 'tipo'
  tipoActor?: string; 
}


export type CardItem = LivelihoodItem | EcosystemItem | ServicioEcosistemicoCardItem | ActorCardItem;

export interface SelectableCardProps {
  item: CardItem; 
  isSelected: boolean;
  onToggleSelect: (id: string, categoria: 'medioDeVida' | 'ecosistema' | 'servicio' | 'actor') => void;
}


// Herramienta 3.2 Types
export interface PrioritizedLivelihood {
  id: string; // Corresponds to LivelihoodItem.id
  nombreMedioVida: string; // Corresponds to LivelihoodItem.nombre
  codigoMedioVida: string; // Corresponds to LivelihoodItem.codigo
  productosPrincipales: string;
  seguridadAlimentaria: number; // 0-3
  area: number; // 0-3, (was areaCultivada) matches "Área" in image/manual
  desarrolloLocal: number; // 0-3
  ambiente: number; // 0-3
  inclusion: number; // 0-3
  total: number; // Calculated sum
}

// Herramienta 3.3 Types
export interface LivelihoodCharacterization {
  id: string; // Unique ID for this characterization instance
  sistemaProductivoId: string; // Combined code like Gn_Br, identifies the system being characterized
  livelihoodIdsInSystem: string[]; // IDs of PrioritizedLivelihood items in this system
  
  // Fields from "Tamaño" section
  unidadTamanio: string;
  minArea: number | null;
  maxArea: number | null;
  rangoPequenoCalculado: string;
  rangoMedianoCalculado: string;
  rangoGrandeCalculado: string;
  
  // Fields from "Tenencia y Porcentaje" section
  tenenciaTipo1Nombre: string;
  tenenciaTipo2Nombre: string;
  tenenciaTipo3Nombre: string;
  
  tenenciaPequenoTipo1Pct: number | null;
  tenenciaPequenoTipo2Pct: number | null;
  tenenciaPequenoTipo3Pct: number | null;
  
  tenenciaMedianoTipo1Pct: number | null;
  tenenciaMedianoTipo2Pct: number | null;
  tenenciaMedianoTipo3Pct: number | null;
  
  tenenciaGrandeTipo1Pct: number | null;
  tenenciaGrandeTipo2Pct: number | null;
  tenenciaGrandeTipo3Pct: number | null;

  // Fields from "Importancia y Cadena de Valor" section
  importanciaPorMedioDeVida: Array<{
    medioDeVidaId: string;
    codigoMedioVida: string;
    nombreMedioVida: string;
    importancia: 0 | 1 | 2 | 3;
    productoFinal: string; 
  }>;
  
  destinoProduccion: {
    local: boolean;
    regional: boolean;
    nacional: boolean;
    exportacion: boolean;
    noAplica: boolean;
  };
}

// Herramienta 3.4 Types
export interface ServicioEcosistemicoCardItem {
  id: string; // e.g., "P1"
  nombre: string; // e.g., "ALIMENTOS"
  categoria: 'APROVISIONAMIENTO' | 'REGULACIÓN' | 'APOYO' | 'CULTURAL'; // This is SE category
  codigo: string; // e.g., "P1"
  descripcion?: string; // Optional detailed description
}

export interface EcosystemCharacterization {
  id: string; // Unique ID for this characterization instance, e.g. the ecosystemId itself or a generated one
  ecosystemId: string; // The ID of the EcosystemItem being characterized
  relatedLivelihoodCodes: string[]; // Array of LivelihoodItem.codigo
  relatedServicioEcosistemicoCodes: string[]; // Array of ServicioEcosistemicoCardItem.codigo
  causasDegradacion: string;
}


// Herramienta 3.5 Types
export interface AccesoDetalle {
  condicion: 'Disminuye' | 'Se mantiene' | 'Aumenta' | 'Complicado' | 'Fácil' | ''; // Specific options for conditions
  barreras?: string;
}

export interface EcosystemServiceCharacterization {
  id: string; // Unique ID, e.g., targetEcosystem.id + "_" + service.id
  ecosistemaId: string;
  servicioEcosistemicoId: string;
  codigoEcosistemaSE: string; // Combined code: ECOSISTEMA_CODE + "_" + SERVICIO_CODE
  
  mediosVidaRelacionadosCodes: string[]; // Array of LivelihoodItem.codigo for "Usuarios"
  
  provisionP: string; // General description: ¿Qué puede ofrecer el Ecosistema?
  flujoF: string;     // General description: ¿Cómo se obtiene el Servicio Ecosistémico?
  demandaD: string;   // General description: ¿Quiénes se benefician del Servicio Ecosistémico?
  
  // Detailed access conditions for Provision, Flujo, and Demanda
  accesoProvision: AccesoDetalle;
  accesoFlujo: AccesoDetalle;
  accesoDemanda: AccesoDetalle;
  
  numeroUsuarios: string; 
  
  temporalidadContribuyenMeses: string[]; // Array of month strings e.g. ["ENE", "FEB"]
  temporalidadFaltanMeses: string[];     // Array of month strings
  
  equidadImpacto: {
    hombres: boolean;
    mujeres: boolean;
    jovenes: boolean;
    gruposMarginados: boolean;
  };
  equidadDescripcion: string;
}


// Herramienta 4.1 Types
export enum MagnitudImpacto {
  MUY_BAJO = 1, // "Casi no nos afecta"
  BAJO = 2,     // "Nos afecta un poco, pero lo podemos manejar"
  MODERADO = 3, // "Nos complica bastante"
  ALTO = 4,     // "Nos golpea duro"
  MUY_ALTO = 5  // "Nos deja sin nada"
}

export enum FrecuenciaAmenaza {
  OCASIONAL = 1,
  RECURRENTE = 2,
  CONSTANTE = 3
}

export enum TendenciaAmenaza {
  DISMINUYE_FUERTE = -2, // Disminuye
  DISMINUYE_LIGERO = -1, // Ligeramente disminuye
  ESTABLE = 0,
  AUMENTA_LIGERO = 1,  // Ligeramente aumenta
  AUMENTA_FUERTE = 2,  // Aumenta
  NUEVA = 3
}

export interface AmenazaClimatica {
  id: string;
  nombre: string;
  magnitud: number; // 1-5 based on manual text
  frecuencia: number; // 1-3
  tendencia: number; // -2 to 3
  priorizacionSuma: number;
  sitiosAfectados: string;
  ubicacionMapaCodigo: string;
}

export interface AmenazaNoClimatica extends AmenazaClimatica {}

// Herramienta 4.2.1 Types
export interface AmenazaMedioVidaConflicto {
  id: string;
  amenaza: string;
  medioDeVida: string; // Name of LivelihoodItem
  codigoMedioVida?: string; // Code of LivelihoodItem, added for easier lookup in H6.2
  // Impacto dimensiones seguridad
  economica: number;
  alimentaria: number;
  sanitaria: number;
  ambiental: number;
  personal: number;
  comunitaria: number;
  politica: number;
  // Fin impacto
  numeroFamilias: number | string; // Can be a number or range like "30-50"
  impactoDiferenciado: string; // H,M,J,GM (comma-separated)
  observacionesImpacto?: string;
  familiasImpactadas?: string; // número de familias impactadas
  // Conflictos
  conflictoGenerado: string;
  tipoConflictoCodigo?: string; // C1,C2 etc. (comma-separated or empty)
  nivelConflicto?: 'L' | 'M' | 'G' | 'NINGUNO'; // Leve, Moderado, Grave, o NINGUNO
  descripcionConflicto?: string;
  mapeoConflictoCodigo?: string;
}

// Herramienta 4.2.2 Types
export interface AmenazaServicioEcosistemicoConflicto extends Omit<AmenazaMedioVidaConflicto, 'medioDeVida' | 'codigoMedioVida'> {
  codigoSE: string; 
  nombreServicioEcosistemico?: string; // Added for easier display in H6.2
  medioDeVida?: string; // Make medioDeVida optional or ensure it's not expected
}


// Herramienta 5.1 Types
export interface ActorRelationship {
  relatedActorId: string; // ID of the other actor
  relationshipType: 'Conflicto' | 'Colaboracion' | 'N/A' | ''; 
  theme: string;
}

export interface ActorPaisaje {
  id: string;
  nombre: string;
  medioVidaServicioRelacionado: string[]; // Changed to string array
  tipo: string; // e.g., Organización comunitaria
  alcance: 'Local' | 'Paisaje' | 'Nacional';
  conflictoConActorOTema: string; // Legacy, may be phased out
  colaboracionConActorOTema: string; // Legacy, may be phased out
  poder: number; // 0-10
  interes: number; // 0-10
  letraDiagrama?: string; // For Part B
  relationships?: ActorRelationship[]; // For Paso 2
}


// Herramienta 5.2 Types
export interface EspacioDialogo {
  id: string;
  nombre: string;
  tipo: 'Formal' | 'Informal' | '';
  alcance: string;
  actoresInvolucrados: string; // Comma-separated actor names
  funcionPrincipal: string;
  nivelIncidencia: 'Bajo' | 'Medio' | 'Alto' | '';
  fortalezas: string;
  debilidades: string;
}

// Herramienta 6.1 Types
export interface EventoConflicto {
  acontecimiento: string;
  ano: string;
  diferencias: -1 | 0 | 1; // -1: Intolerables, 0: Intermedias, 1: Tolerables
  factorDiferencias: string;
  cooperacion: -1 | 0 | 1; // -1: Baja, 0: Media, 1: Alta
  factorCooperacion: string;
  totalTension: number; // Calculated: diferencias + cooperacion (or other logic based on manual)
}

export interface ConflictoEvolucion {
  id: string; // some unique id for the conflict being analyzed, e.g. code from H4.2
  eventos: EventoConflicto[]; 
}


// Herramienta 6.2 Types
export interface ActorConflicto {
  id: string; // internal row id, can be actorId from ActorPaisaje
  actorPrincipal: string; // Name of the actor from H5.1
  impactoConflictoEnActorSigno: '+' | 'o' | '-';
  impactoConflictoEnActorFactores: string;
  impactoActorEnConflictoSigno: '+' | 'o' | '-';
  impactoActorEnConflictoFactores: string;
  estrategiasAccionesInfluyentes: string; // Added from manual's image text for this column
}

export interface ConflictoConActoresDetallados {
  conflictoId: string; // ID of the original conflict from H4.2.1/H4.2.2 (matches ConflictoEvolucion.id)
  codigoConflictoCalculado: string; // e.g., Ag_L_C1C3
  actoresDetalles: ActorConflicto[]; // Details for each actor involved in this specific conflict
}


// Herramienta 7.1 Types
export type PorcentajeOpcion = '0-20' | '20-40' | '40-60' | '60-80' | '80-100' | 'N/A (0)';
export const porcentajeOpciones: PorcentajeOpcion[] = ['0-20', '20-40', '40-60', '60-80', '80-100', 'N/A (0)'];

export interface RespuestaCuestionario {
  preguntaId: number;
  respuesta: PorcentajeOpcion | string; // String for free text like 'especificar cual proceso'
}

export interface CuestionarioData {
  [key: number]: PorcentajeOpcion | string;
}

export interface PreguntaCuestionario {
  id: number;
  texto: string;
  subtexto?: string; // For reminders or additional info
  tipoRespuesta: 'porcentaje' | 'texto';
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  path: string;
  component: React.FC<any>;
}

export interface StepDefinition {
  name: string;
  path: string;
  icon?: React.ElementType;
  tools: ToolDefinition[];
}