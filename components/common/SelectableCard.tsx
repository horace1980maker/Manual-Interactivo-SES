
import React from 'react';
import { LivelihoodItem, EcosystemItem } from '../../types';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface SelectableCardProps {
  item: LivelihoodItem | EcosystemItem;
  isSelected: boolean;
  onToggleSelect: (id: string, categoria: 'medioDeVida' | 'ecosistema') => void;
}

export const SelectableCard: React.FC<SelectableCardProps> = ({ item, isSelected, onToggleSelect }) => {
  const { id, nombre, codigo, categoria } = item;

  const cardClasses = isSelected 
    ? 'border-[#009EE2] ring-2 ring-[#009EE2] bg-[#EBF5FF]' 
    : 'border-gray-300 bg-white hover:border-[#009EE2]/70';
  
  const textColor = isSelected ? 'text-[#001F89]' : 'text-gray-800';
  const codeColor = isSelected ? 'text-[#009EE2]' : 'text-[#001F89]';

  return (
    <div
      className={`relative rounded-lg shadow-md p-3 cursor-pointer transition-all duration-200 ease-in-out transform hover:shadow-lg hover:-translate-y-1 ${cardClasses} flex flex-col items-center text-center justify-between`}
      onClick={() => onToggleSelect(id, categoria)}
      style={{ minHeight: '120px' }}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleSelect(id, categoria);}}}
    >
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 text-white rounded-full">
          <CheckCircleIcon className="h-6 w-6 text-[#009EE2] bg-white rounded-full" />
        </div>
      )}
      
      <p className={`font-bold ${textColor} text-sm leading-tight`}>{nombre}</p>

      <div className="w-full mt-auto pt-2 border-t border-gray-200">
        <div className="flex justify-between items-baseline">
            <span className={`text-xs ${textColor} font-medium`}>CÓDIGO</span>
            <span className={`text-2xl font-bold ${codeColor}`}>{codigo}</span>
        </div>
      </div>
    </div>
  );
};
