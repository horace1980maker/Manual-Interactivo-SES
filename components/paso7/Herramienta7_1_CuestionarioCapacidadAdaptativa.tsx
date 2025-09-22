import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { DocumentArrowDownIcon, TrashIcon } from '@heroicons/react/24/outline';
import { 
    PreguntaCuestionario, CuestionarioData, PorcentajeOpcion, porcentajeOpciones, 
    LivelihoodCharacterization, ActorPaisaje, ActorRelationship, ConflictoEvolucion, 
    EventoConflicto, ConflictoConActoresDetallados, ActorConflicto 
} from '../../types';


// Define keys for session storage data
const H31_PAISAJE_FECHA_KEY = 'H31_PAISAJE_FECHA';
const H31_PAISAJE_PAIS_KEY = 'H31_PAISAJE_PAIS';
const H31_PAISAJE_GRUPO_KEY = 'H31_PAISAJE_GRUPO';
const H31_UPLOADED_LIVELIHOODS_KEY = 'H31_UPLOADED_LIVELIHOODS';
const H31_UPLOADED_ECOSYSTEMS_KEY = 'H31_UPLOADED_ECOSYSTEMS';
const H31_DETAILED_LIVELIHOODS_KEY = 'detailedLivelihoodsForH34';
const H31_DETAILED_ECOSYSTEMS_KEY = 'detailedEcosystemsForH34';
const H32_PRIORITIZED_LIVELIHOODS_KEY = 'prioritizedLivelihoods_H32';
const H33_ALL_CHARACTERIZED_SYSTEMS_KEY = 'allCharacterizedSystemsH33';
const H34_CHARACTERIZED_ECOSYSTEMS_KEY = 'allCharacterizedEcosystemsH34';
const H35_TARGETED_SERVICE_CODES_KEY = 'H35_TARGETED_SERVICE_CODES_KEY';
const H4_1_CLIMATIC_THREATS_KEY = 'climaticThreatsData_H41';
const H4_1_NON_CLIMATIC_THREATS_KEY = 'nonClimaticThreatsData_H41';
const H4_2_1_CHARACTERIZED_CONFLICTS_KEY = 'characterizedMedioVidaConflicts_H421';
const H4_2_2_CHARACTERIZED_CONFLICTS_KEY = 'characterizedServicioEcosistemicoConflicts_H422';
const H51_ACTORES_PAISAJE_KEY = 'H51_ACTORES_PAISAJE_KEY';
const H52_ESPACIOS_DIALOGO_KEY = 'H52_ESPACIOS_DIALOGO_KEY';
const H61_EVOLUCION_CONFLICTOS_KEY = 'H61_EVOLUCION_CONFLICTOS_KEY';
const H62_ACTORES_CONFLICTO_KEY = 'H62_ACTORES_CONFLICTO_KEY';
const H71_CUESTIONARIO_DATA_KEY = 'H71_CUESTIONARIO_DATA_KEY';

const REPORT_DATA_KEYS = {
  MdV_H31_Iniciales: H31_UPLOADED_LIVELIHOODS_KEY,
  Ecosistemas_H31_Iniciales: H31_UPLOADED_ECOSYSTEMS_KEY,
  MdV_H31_Detalle: H31_DETAILED_LIVELIHOODS_KEY,
  Ecosistemas_H31_Detalle: H31_DETAILED_ECOSYSTEMS_KEY,
  MdV_H32_Priorizados: H32_PRIORITIZED_LIVELIHOODS_KEY,
  SistemasProductivos_H33: H33_ALL_CHARACTERIZED_SYSTEMS_KEY,
  Ecosistemas_H34_Caracterizados: H34_CHARACTERIZED_ECOSYSTEMS_KEY,
  Codigos_SE_Relevantes_H35: H35_TARGETED_SERVICE_CODES_KEY,
  AmenazasClimaticas_H41: H4_1_CLIMATIC_THREATS_KEY,
  AmenazasNoClimaticas_H41: H4_1_NON_CLIMATIC_THREATS_KEY,
  Conflictos_MdV_H421: H4_2_1_CHARACTERIZED_CONFLICTS_KEY,
  Conflictos_SE_H422: H4_2_2_CHARACTERIZED_CONFLICTS_KEY,
  ActoresPaisaje_H51: H51_ACTORES_PAISAJE_KEY,
  EspaciosDialogo_H52: H52_ESPACIOS_DIALOGO_KEY,
  EvolucionConflictos_H61: H61_EVOLUCION_CONFLICTOS_KEY,
  ActoresEnConflictos_H62: H62_ACTORES_CONFLICTO_KEY,
  Cuestionario_H71: H71_CUESTIONARIO_DATA_KEY,
};

const preguntasCuestionario: PreguntaCuestionario[] = [
    { id: 1, texto: '1. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... depende totalmente de este sistema productivo para sostener sus ingresos?', tipoRespuesta: 'porcentaje' },
    { id: 2, texto: '2. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene ingresos estables y suficientes durante todo el año?', tipoRespuesta: 'porcentaje' },
    { id: 3, texto: '3. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene mujeres empleadas con remuneración en este sistema productivo?', tipoRespuesta: 'porcentaje' },
    { id: 4, texto: '4. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene jóvenes [15-24 años] empleados con remuneración en este sistema productivo?', tipoRespuesta: 'porcentaje' },
    { id: 5, texto: '5. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene una vivienda permanente? [con título de propiedad]', tipoRespuesta: 'porcentaje' },
    { id: 6, texto: '6. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene vivienda construida con materiales duraderos (techo firme, paredes de ladrillo, suelo de cemento)?', tipoRespuesta: 'porcentaje' },
    { id: 7, texto: '7. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene vivienda con espacio suficiente para los miembros de la familia?', tipoRespuesta: 'porcentaje' },
    { id: 8, texto: '8. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene seguridad alimentaria durante todo el año? [todas las personas tienen acceso constante a alimentos suficientes, seguros y nutritivos para una vida saludable]', tipoRespuesta: 'porcentaje' },
    { id: 9, texto: '9. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene instalaciones de saneamiento adecuados? [aquellas que separan higiénicamente los desechos humanos del contacto humano]', tipoRespuesta: 'porcentaje' },
    { id: 10, texto: '10. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene acceso a servicios de salud y atención médica? [ todas las personas y las comunidades tienen acceso a servicios integrales de salud, adecuados, oportunos y de calidad]', tipoRespuesta: 'porcentaje' },
    { id: 11, texto: '11. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene acceso a agua limpia y potable durante todo el año? [agua que se puede tomar sin causar problemas de salud]', tipoRespuesta: 'porcentaje' },
    { id: 12, texto: '12. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... usa leña como principal fuente de energía doméstica?', tipoRespuesta: 'porcentaje' },
    { id: 13, texto: '13. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene acceso a leña/energía durante todo el año para uso doméstico?', tipoRespuesta: 'porcentaje' },
    { id: 14, texto: '14. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene acceso a la electricidad?', tipoRespuesta: 'porcentaje' },
    { id: 15, texto: '15. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene acceso a internet?', tipoRespuesta: 'porcentaje' },
    { id: 16, texto: '16. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... envía a los niños a finalizar la enseñanza primaria?', tipoRespuesta: 'porcentaje' },
    { id: 17, texto: '17. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... envía a los jóvenes a terminar la enseñanza secundaria?', tipoRespuesta: 'porcentaje' },
    { id: 18, texto: '18. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene a todas las personas mayores de 15 años que saben leer y escribir?', tipoRespuesta: 'porcentaje' },
    { id: 19, texto: '19. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... está encabezada por mujeres?', tipoRespuesta: 'porcentaje' },
    { id: 20, texto: '20. ¿En qué proporción de familias las mujeres pueden llevar a cabo sus propias decisiones sobre la gestión del hogar?', tipoRespuesta: 'porcentaje' },
    { id: 21, texto: '21. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... ha tenido problemas en los últimos cinco años por deforestación, incendios o algún otro proceso que afecto su medio de vida principal? [especificar cual proceso]', tipoRespuesta: 'texto' },
    { id: 22, texto: '22. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... usa conocimiento local o indígena para enfrentar amenazas climáticas?', subtexto: 'Recordar al interlocutor algunas de las amenazas climáticas identificadas en los Pasos anteriores del taller.', tipoRespuesta: 'porcentaje' },
    { id: 23, texto: '23. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... se organizó para darse apoyo entre ellas en casos de desastres o amenazas climáticas [en forma de apoyo laboral, compartir comida, cuidado los niños/mayores, otros ejemplos - especificar]?', subtexto: 'Recordar al interlocutor algunas de las amenazas climáticas identificadas en los Pasos anteriores del taller.', tipoRespuesta: 'texto' },
    { id: 24, texto: '24. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... confía en miembros de la familia y la comunidad en casos de desastres o amenazas climáticas?', tipoRespuesta: 'porcentaje' },
    { id: 25, texto: '25. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... confía en instituciones locales (iglesia, organizaciones humanitarias, otras) en casos de desastres o amenazas climáticas?', tipoRespuesta: 'porcentaje' },
    { id: 26, texto: '26. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... confía en organizaciones gubernamentales en casos de desastres o amenazas climáticas?', tipoRespuesta: 'porcentaje' },
    { id: 27, texto: '27. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene problemas de seguridad en sus fincas? (p.ej., robos, agresiones)', tipoRespuesta: 'porcentaje' },
    { id: 28, texto: '28. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... puede transitar libremente sin problemas de seguridad?', tipoRespuesta: 'porcentaje' },
    { id: 29, texto: '29. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... si tiene problema de seguridad, confía a mecanismos de estado para resolver sus problemas de seguridad?', tipoRespuesta: 'porcentaje' },
    { id: 30, texto: '30. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... las mujeres pueden transitar libremente sin problemas de seguridad?', tipoRespuesta: 'porcentaje' },
    { id: 31, texto: '31. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene algún miembro del núcleo familiar (padres-hijos) que ha migrado dentro del país?', tipoRespuesta: 'porcentaje' },
    { id: 32, texto: '32. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene algún miembro del núcleo familiar (padres-hijos) que ha migrado fuera del país?', tipoRespuesta: 'porcentaje' },
    { id: 33, texto: '33. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene remesas que representan más del 60% de sus ingresos?', tipoRespuesta: 'porcentaje' },
    { id: 34, texto: '34. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... son familias las que migraron a este paisaje desde el extranjero o desde otras partes del país?', tipoRespuesta: 'porcentaje' },
    { id: 35, texto: '35. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... experimenta discriminación por ser migrante en este paisaje?', tipoRespuesta: 'porcentaje' },
    { id: 36, texto: '36. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... experimenta discriminación o tensiones basadas en la etnia, la religión, el género u otra categoría de identidad? Especificar.', tipoRespuesta: 'texto' },
    { id: 37, texto: '37. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene derechos de tenencia de la tierra (o de los bienes inmuebles clave para el medio de vida o sistema productivo)?', tipoRespuesta: 'porcentaje' },
    { id: 38, texto: '38. Sobre la pregunta anterior: De la proporción de familias que tiene derechos de tenencia, ¿cuántas cuentan con documentación legal que sustente estos derechos?', tipoRespuesta: 'porcentaje' },
    { id: 39, texto: '39. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene acceso a fuentes cercanas de agua para este medio de vida (sistema productivo)?', tipoRespuesta: 'porcentaje' },
    { id: 40, texto: '40. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene acceso a otros insumos necesarios para este medio de vida o sistema productivo (por ejemplo, semillas, animales, maquinaria)?', tipoRespuesta: 'porcentaje' },
    { id: 41, texto: '41. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... dispone con diversidad tecnológica para la implementación de prácticas?', tipoRespuesta: 'porcentaje' },
    { id: 42, texto: '42. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... dispone de mano de obra (familiar o contratada) cuando la necesita?', tipoRespuesta: 'porcentaje' },
    { id: 43, texto: '43. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene acceso a créditos para la producción?', tipoRespuesta: 'porcentaje' },
    { id: 44, texto: '44. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tiene acceso a seguros para la producción?', tipoRespuesta: 'porcentaje' },
    { id: 45, texto: '45. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... dispone de instalaciones o infraestructuras para almacenar productos (por ejemplo, almacenes)?', tipoRespuesta: 'porcentaje' },
    { id: 46, texto: '46. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... dispone de carreteras adecuadas para distribuir los productos?', tipoRespuesta: 'porcentaje' },
    { id: 47, texto: '47. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... dispone de sus propios medios de transporte para comercializar sus productos?', tipoRespuesta: 'porcentaje' },
    { id: 48, texto: '48. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... añade valor a sus productos?', tipoRespuesta: 'porcentaje' },
    { id: 49, texto: '49. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... vende sus productos a través de un intermediario?', tipoRespuesta: 'porcentaje' },
    { id: 50, texto: '50. ¿En qué proporción de familias o unidades productivas las mujeres toman decisiones sobre cambios en sus sistemas productivos?', tipoRespuesta: 'porcentaje' },
    { id: 51, texto: '51. ¿En qué proporción de familias o unidades productivas participan las mujeres en el proceso de transformación (valor añadido) de los productos?', tipoRespuesta: 'porcentaje' },
    { id: 52, texto: '52. ¿En qué proporción de familias o unidades productivas las mujeres toman decisiones en el proceso de comercialización de los productos?', tipoRespuesta: 'porcentaje' },
    { id: 53, texto: '53. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... recibe asistencia técnica y/o formación de instituciones gubernamentales, ONG, empresas, cooperativas u otro tipo de instituciones?', tipoRespuesta: 'porcentaje' },
    { id: 54, texto: '54. Sobre la pregunta anterior: ¿Cuál es la fuente de información en la que más confía para tomar decisiones de producción? a) servicios de gobierno, b) proveedores de insumos, c) vecinos, d) otros (especificar)', tipoRespuesta: 'texto' },
    { id: 55, texto: '55. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... recibe información climática para su sistema productivo?', tipoRespuesta: 'porcentaje' },
    { id: 56, texto: '56. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... accede a información del mercado?', tipoRespuesta: 'porcentaje' },
    { id: 57, texto: '57. De las familias que reciben información agroclimática y/o de mercados, ¿cuántas pueden implementar las recomendaciones?', tipoRespuesta: 'porcentaje' },
    { id: 58, texto: '58. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... estaría dispuesta a cambiar su manera de producir ante acontecimientos adversos?', tipoRespuesta: 'porcentaje' },
    { id: 59, texto: '59. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... ya ha hecho cambios en su manera de producir como respuestas a cambios del mercado, efectos del cambio climático, etc.?', tipoRespuesta: 'porcentaje' },
    { id: 60, texto: '60. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... tenía antes otro medio de vida y lo cambió como respuesta a cambio del mercado, efectos del cambio climático, etc.?', tipoRespuesta: 'porcentaje' },
    { id: 61, texto: '61. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... participa en asociaciones o cooperativas relacionadas con este medio de vida (sistema productivo)?', tipoRespuesta: 'porcentaje' },
    { id: 62, texto: '62. ¿Qué proporción de familias que tiene este sistema productivo como medio de vida principal... participa en plataformas/espacios de toma de decisiones comunitarias?', tipoRespuesta: 'porcentaje' },
];

export const Herramienta7_1_CuestionarioCapacidadAdaptativa: React.FC = () => {
    const navigate = useNavigate();
    const [respuestas, setRespuestas] = useState<CuestionarioData>({});
    
    useEffect(() => {
        try {
            const storedData = sessionStorage.getItem(H71_CUESTIONARIO_DATA_KEY);
            if (storedData) {
                setRespuestas(JSON.parse(storedData));
            }
        } catch (error) {
            console.error("Error loading H7.1 data from sessionStorage:", error);
        }
    }, []);

    useEffect(() => {
        try {
            sessionStorage.setItem(H71_CUESTIONARIO_DATA_KEY, JSON.stringify(respuestas));
        } catch (error) {
            console.error("Error saving H7.1 data to sessionStorage:", error);
        }
    }, [respuestas]);

    const handleAnswerChange = (preguntaId: number, respuesta: PorcentajeOpcion | string) => {
        setRespuestas(prev => ({ ...prev, [preguntaId]: respuesta }));
    };

    const porcentajeOptionsForSelect = porcentajeOpciones.map(opt => ({ value: opt, label: opt }));

    const handleGenerateReport = () => {
        const wb = XLSX.utils.book_new();

        const pais = sessionStorage.getItem(H31_PAISAJE_PAIS_KEY) || 'No especificado';
        const grupo = sessionStorage.getItem(H31_PAISAJE_GRUPO_KEY) || 'Paisaje/Grupo no especificado';
        const fecha = sessionStorage.getItem(H31_PAISAJE_FECHA_KEY) || 'No especificada';
        
        const landscapeInfoBase = {
            'País': pais,
            'Paisaje/Grupo': grupo,
            'Fecha del Taller': fecha,
        };

        Object.entries(REPORT_DATA_KEYS).forEach(([sheetName, storageKey]) => {
            try {
                const rawData = sessionStorage.getItem(storageKey);
                let originalData = rawData ? JSON.parse(rawData) : null;
                
                if (!originalData || (Array.isArray(originalData) && originalData.length === 0) || (typeof originalData === 'object' && Object.keys(originalData).length === 0)) {
                    const ws = XLSX.utils.json_to_sheet([{ "Datos": `No hay datos disponibles para ${sheetName}` }]);
                    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
                    return;
                }

                let flattenedData: any[] = [];
                
                if (storageKey === H33_ALL_CHARACTERIZED_SYSTEMS_KEY) {
                    (originalData as LivelihoodCharacterization[]).forEach(system => {
                        const baseSystemData = { ...system };
                        delete baseSystemData.importanciaPorMedioDeVida;
                        delete baseSystemData.destinoProduccion;
                        
                        // Convert destinoProduccion object to a string
                        const destinoString = Object.entries(system.destinoProduccion || {})
                            .filter(([, value]) => value)
                            .map(([key]) => key)
                            .join(', ');
                        (baseSystemData as any).destinoProduccion = destinoString;

                        if (system.importanciaPorMedioDeVida && system.importanciaPorMedioDeVida.length > 0) {
                            system.importanciaPorMedioDeVida.forEach(imp => {
                                flattenedData.push({ ...landscapeInfoBase, ...baseSystemData, ...imp });
                            });
                        } else {
                            flattenedData.push({ ...landscapeInfoBase, ...baseSystemData });
                        }
                    });
                } else if (storageKey === H51_ACTORES_PAISAJE_KEY) {
                    sheetName = "Actores_y_Relaciones_H51";
                    (originalData as ActorPaisaje[]).forEach(actor => {
                        const baseActorData = { ...actor };
                        delete baseActorData.medioVidaServicioRelacionado;
                        delete baseActorData.relationships;
                        
                        (baseActorData as any).medioVidaServicioRelacionado = (actor.medioVidaServicioRelacionado || []).join(', ');

                        const hasRelationships = actor.relationships && actor.relationships.length > 0;

                        if (hasRelationships) {
                            actor.relationships!.forEach(rel => {
                                 const relatedActor = (originalData as ActorPaisaje[]).find(a => a.id === rel.relatedActorId);
                                 flattenedData.push({
                                    ...landscapeInfoBase,
                                    ...baseActorData,
                                    relacion_tipo: rel.relationshipType,
                                    relacion_con_actor: relatedActor ? relatedActor.nombre : rel.relatedActorId,
                                    relacion_tema: rel.theme,
                                 });
                            });
                        } else {
                            flattenedData.push({ ...landscapeInfoBase, ...baseActorData, relacion_tipo: 'N/A', relacion_con_actor: 'N/A', relacion_tema: 'N/A' });
                        }
                    });
                } else if (storageKey === H61_EVOLUCION_CONFLICTOS_KEY) {
                     (originalData as ConflictoEvolucion[]).forEach(evo => {
                        const baseEvoData = { conflictoId: evo.id };
                        if (evo.eventos && evo.eventos.length > 0) {
                            evo.eventos.forEach((evento: EventoConflicto) => {
                               flattenedData.push({ ...landscapeInfoBase, ...baseEvoData, ...evento });
                            });
                        } else {
                             flattenedData.push({ ...landscapeInfoBase, ...baseEvoData, acontecimiento: 'Sin eventos registrados' });
                        }
                     });
                } else if (storageKey === H62_ACTORES_CONFLICTO_KEY) {
                    (originalData as ConflictoConActoresDetallados[]).forEach(conflict => {
                        const baseConflictData = { ...conflict };
                        delete baseConflictData.actoresDetalles;

                         if (conflict.actoresDetalles && conflict.actoresDetalles.length > 0) {
                            conflict.actoresDetalles.forEach((actorDetail: ActorConflicto) => {
                               flattenedData.push({ ...landscapeInfoBase, ...baseConflictData, ...actorDetail });
                            });
                        } else {
                             flattenedData.push({ ...landscapeInfoBase, ...baseConflictData, actorPrincipal: 'Sin actores asignados' });
                        }
                    });
                } else if (storageKey === H71_CUESTIONARIO_DATA_KEY) {
                    const cuestionarioData = originalData as CuestionarioData;
                    flattenedData = preguntasCuestionario.map(pregunta => ({
                        ...landscapeInfoBase,
                        "ID Pregunta": pregunta.id,
                        "Pregunta": pregunta.texto,
                        "Respuesta": cuestionarioData[pregunta.id] || 'No respondida'
                    }));
                } else if (storageKey === H35_TARGETED_SERVICE_CODES_KEY) {
                    flattenedData = (originalData as string[]).map(code => ({ ...landscapeInfoBase, 'Codigo_Servicio_Ecosistemico': code }));
                }
                else {
                    const dataArray = Array.isArray(originalData) ? originalData : [originalData];
                    flattenedData = dataArray.map(item => ({...landscapeInfoBase, ...item}));
                }

                if (flattenedData.length === 0) {
                     const ws = XLSX.utils.json_to_sheet([{ "Datos": `No hay datos para procesar en ${sheetName}` }]);
                     XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
                     return;
                }

                const ws = XLSX.utils.json_to_sheet(flattenedData);
                XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
            } catch (error) {
                console.error(`Error procesando sheet ${sheetName}:`, error);
                const ws = XLSX.utils.json_to_sheet([{ Message: `Error procesando datos para ${sheetName}` }]);
                XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
            }
        });
        
        const currentDate = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(wb, `Reporte_Facilitacion_SES_${currentDate}.xlsx`);
    };

    const handleClearAllAndRestart = () => {
        if (window.confirm("¿Está seguro de que desea limpiar todos los datos y volver al inicio? Esta acción no se puede deshacer.")) {
            try {
                sessionStorage.clear();
                window.location.hash = '/';
                (window.location.reload as (forceReload?: boolean) => void)(true);
            } catch (error) {
                console.error("Error al limpiar sessionStorage o al recargar:", error);
                alert("Ocurrió un error al intentar limpiar los datos y reiniciar.");
            }
        }
    };

    return (
        <ToolCard 
          title="Herramienta 7.1 - Cuestionario de Capacidad Adaptativa"
          objetivo="Recolectar datos para estimar la capacidad de adaptación de los hogares y sus unidades productivas en los medios de vida priorizados, respondiendo a una serie de preguntas clave."
        >
            <div className="space-y-6">
                {preguntasCuestionario.map(pregunta => (
                    <div key={pregunta.id} className="p-4 border rounded-lg bg-gray-50/50">
                        <label htmlFor={`q-${pregunta.id}`} className="block text-sm font-medium text-gray-800">{pregunta.texto}</label>
                        {pregunta.subtexto && <p className="text-xs text-gray-500 mt-1">{pregunta.subtexto}</p>}
                        
                        {pregunta.tipoRespuesta === 'porcentaje' ? (
                            <Select
                                id={`q-${pregunta.id}`}
                                name={`q-${pregunta.id}`}
                                value={respuestas[pregunta.id] || ''}
                                onChange={(e) => handleAnswerChange(pregunta.id, e.target.value as PorcentajeOpcion)}
                                options={porcentajeOptionsForSelect}
                                placeholder="Seleccione un porcentaje..."
                                wrapperClassName="mt-2 mb-0"
                            />
                        ) : (
                            <Input
                                id={`q-${pregunta.id}`}
                                name={`q-${pregunta.id}`}
                                value={(respuestas[pregunta.id] as string) || ''}
                                onChange={(e) => handleAnswerChange(pregunta.id, e.target.value)}
                                placeholder="Escriba su respuesta..."
                                wrapperClassName="mt-2 mb-0"
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-10 pt-6 border-t border-gray-300 space-y-4 md:space-y-0 md:flex md:justify-around md:items-center">
                <Button
                    variant="success"
                    size="lg"
                    onClick={handleGenerateReport}
                    aria-label="Generar Reporte en Excel de todos los datos recopilados"
                    className="w-full md:w-auto mb-4 md:mb-0"
                >
                    <DocumentArrowDownIcon className="h-5 w-5 mr-2 inline-block" />
                    Generar Reporte en Excel
                </Button>
                <Button
                    variant="danger"
                    size="lg"
                    onClick={handleClearAllAndRestart}
                    aria-label="Limpiar todos los datos y volver al inicio de la aplicación"
                    className="w-full md:w-auto"
                >
                    <TrashIcon className="h-5 w-5 mr-2 inline-block" />
                    Limpiar Todo y Volver al Inicio
                </Button>
            </div>
             <p className="text-xs text-gray-500 mt-4 text-center">
                El reporte en Excel incluirá todos los datos guardados en las herramientas anteriores.
                El botón "Limpiar Todo" borrará permanentemente toda la información ingresada en la aplicación.
            </p>
        </ToolCard>
    );
};