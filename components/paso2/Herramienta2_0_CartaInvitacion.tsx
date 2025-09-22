
import React, { useState } from 'react';
import { ToolCard } from '../ToolCard';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';

export const Herramienta2_0_CartaInvitacion: React.FC = () => {
  const [fecha, setFecha] = useState('[Fecha]');
  const [nombrePaisaje, setNombrePaisaje] = useState('[Nombre del Paisaje]');
  const [nombreDestinatario, setNombreDestinatario] = useState('[Nombre del destinatario]');
  const [nombreSocioImplementador, setNombreSocioImplementador] = useState('[nombre del socio implementador]');
  const [fechaTaller, setFechaTaller] = useState('[fecha]');
  const [ubicacionTaller, setUbicacionTaller] = useState('[ubicación]');
  const [horaInicio, setHoraInicio] = useState('[hora de inicio]');
  const [horaFin, setHoraFin] = useState('[hora de finalización]');
  const [fechaLimiteConfirmacion, setFechaLimiteConfirmacion] = useState('[fecha límite de confirmación]');
  const [nombreContacto, setNombreContacto] = useState('[nombre de contacto, correo electrónico y/o número de teléfono]');
  const [logos, setLogos] = useState('MESA DE LOGOS OFICIAL DEL PROYECTO + LOGO SOCIO COOPERANTE');

  const generatedLetter = `
${logos}

${fecha}

Asunto: Invitación a taller de diagnóstico participativo en ${nombrePaisaje}

Estimado/a ${nombreDestinatario},

Reciba un cordial saludo. En el marco del Proyecto Paz, Acción, Resiliencia y Sostenibilidad en Paisajes de América Latina (PARES), 
financiado por la Unión Europea (UE) y el Programa de las Naciones Unidas para el Medio Ambiente (PNUMA) con el apoyo técnico 
regional del Centro Agronómico Tropical de Investigación y Enseñanza (CATIE) e implementado por ${nombreSocioImplementador}, 
nos complace invitarle a participar en el Taller de Diagnóstico Participativo.

Este taller se llevará a cabo el ${fechaTaller}, en ${ubicacionTaller}, de ${horaInicio} a ${horaFin}, y tiene como objetivo desarrollar un 
análisis de vulnerabilidad y fragilidad del paisaje, permitiendo identificar un portafolio de Soluciones Basadas en la Naturaleza (SbN) 
para la adaptación al cambio climático. Con base en estas soluciones, se diseñará un proyecto piloto a ser ejecutado con la subvención 
otorgada en el marco del proyecto.

El taller reunirá a diversos actores clave con el propósito de integrar diferentes perspectivas y conocimientos, asegurando que las 
intervenciones propuestas sean relevantes, viables y alineadas con las necesidades del paisaje y sus medios de vida.

Agradecemos confirmar su participación antes del ${fechaLimiteConfirmacion}, respondiendo a este correo o comunicándose con 
${nombreContacto}.

Esperamos contar con su valiosa presencia y contribución.
  `;

  return (
    <ToolCard title="Herramienta 2.0 - Borrador Base de Carta de Invitación a Taller">
      <p className="text-sm text-gray-600 mb-4">
        Complete los campos para generar la carta de invitación.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input label="Logos (texto)" value={logos} onChange={(e) => setLogos(e.target.value)} />
        <Input label="Fecha de la carta" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <Input label="Nombre del Paisaje" value={nombrePaisaje} onChange={(e) => setNombrePaisaje(e.target.value)} />
        <Input label="Nombre del Destinatario" value={nombreDestinatario} onChange={(e) => setNombreDestinatario(e.target.value)} />
        <Input label="Nombre del Socio Implementador" value={nombreSocioImplementador} onChange={(e) => setNombreSocioImplementador(e.target.value)} />
        <Input label="Fecha del Taller" value={fechaTaller} onChange={(e) => setFechaTaller(e.target.value)} />
        <Input label="Ubicación del Taller" value={ubicacionTaller} onChange={(e) => setUbicacionTaller(e.target.value)} />
        <Input label="Hora de Inicio" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
        <Input label="Hora de Finalización" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
        <Input label="Fecha Límite de Confirmación" value={fechaLimiteConfirmacion} onChange={(e) => setFechaLimiteConfirmacion(e.target.value)} />
        <Input label="Datos de Contacto" value={nombreContacto} onChange={(e) => setNombreContacto(e.target.value)} />
      </div>
      
      <h3 className="text-lg font-semibold text-[#001F89] mb-2">Carta Generada:</h3>
      <Textarea value={generatedLetter} readOnly rows={15} className="bg-gray-50 font-mono text-xs"/>
      <Button onClick={() => navigator.clipboard.writeText(generatedLetter.trim())} className="mt-2">
        Copiar Carta
      </Button>
    </ToolCard>
  );
};