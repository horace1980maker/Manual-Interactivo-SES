
import React from 'react';
import { LivelihoodItem, ServicioEcosistemicoCardItem, EcosystemItem, ActorCardItem, CardItem } from '../../types';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export interface SelectableDisplayCardProps {
  item: LivelihoodItem | ServicioEcosistemicoCardItem | EcosystemItem | ActorCardItem;
  isSelected: boolean;
  onToggleSelect: (id: string, type: 'medioDeVida' | 'ecosistema' | 'servicio' | 'actor') => void;
}

export const SelectableDisplayCard: React.FC<SelectableDisplayCardProps> = ({ item, isSelected, onToggleSelect }) => {
  
  const baseClasses = "relative rounded-lg shadow-md p-2.5 cursor-pointer transition-all duration-200 ease-in-out transform hover:shadow-lg hover:-translate-y-0.5 flex flex-col text-center justify-center";
  const selectedClasses = 'border-2 border-pink-500 bg-pink-50 ring-2 ring-pink-500';
  const unselectedClasses = 'border border-gray-300 bg-white hover:border-pink-400';

  const cardColorClass = isSelected ? selectedClasses : unselectedClasses;

  let itemTypeString: 'medioDeVida' | 'ecosistema' | 'servicio' | 'actor';
  let categoryLabel: string = '';
  let categoryBgColor: string = 'bg-gray-100';
  let categoryTextColor: string = 'text-gray-700';

  if (item.categoria === 'medioDeVida') {
    itemTypeString = 'medioDeVida';
    categoryLabel = 'MEDIO DE VIDA';
    categoryBgColor = 'bg-blue-100';
    categoryTextColor = 'text-blue-700';
  } else if (item.categoria === 'ecosistema') {
    itemTypeString = 'ecosistema';
    categoryLabel = 'ECOSISTEMA';
    categoryBgColor = 'bg-green-100';
    categoryTextColor = 'text-green-700';
  } else if (item.categoria === 'actor') {
    itemTypeString = 'actor';
    categoryLabel = 'ACTOR';
    categoryBgColor = 'bg-indigo-100';
    categoryTextColor = 'text-indigo-700';
  } else if (['APROVISIONAMIENTO', 'REGULACIÓN', 'APOYO', 'CULTURAL'].includes(item.categoria)) {
    itemTypeString = 'servicio';
    categoryLabel = (item as ServicioEcosistemicoCardItem).categoria;
    categoryBgColor = 'bg-purple-100';
    categoryTextColor = 'text-purple-700';
  } else {
    // This should not happen with correct data
    itemTypeString = 'medioDeVida';
  }

  return (
    <div
      className={`${baseClasses} ${cardColorClass}`}
      onClick={() => onToggleSelect(item.id, itemTypeString)}
      style={{ minHeight: '80px' }}
      aria-pressed={isSelected}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleSelect(item.id, itemTypeString);}}}
    >
      {isSelected && (
        <div className="absolute top-1 right-1 bg-white text-pink-500 rounded-full" aria-hidden="true">
          <CheckCircleIcon className="h-5 w-5" />
        </div>
      )}
      <div className="flex-grow flex flex-col items-center justify-center">
        <p className={`font-semibold text-gray-800 text-xs leading-tight`}>
            {item.nombre.toUpperCase()}
        </p>
      </div>
        
      <div className="w-full mt-auto pt-1.5 border-t border-gray-200">
        <div className={`text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-full inline-block ${categoryBgColor} ${categoryTextColor}`}>
          {categoryLabel}
        </div>
      </div>
    </div>
  );
};
