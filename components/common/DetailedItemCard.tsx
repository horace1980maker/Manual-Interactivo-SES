
import React from 'react';
import { LivelihoodItem, EcosystemItem } from '../../types';

interface DetailedItemCardProps {
  item: LivelihoodItem | EcosystemItem;
  onUpdateLivelihoodDetail?: (id: string, detail: 'isAutoconsumo' | 'isComercial', value: boolean) => void;
  onUpdateEcosystemHealth?: (id: string, health: 1 | 2 | 3) => void;
}

export const DetailedItemCard: React.FC<DetailedItemCardProps> = ({ 
  item, 
  onUpdateLivelihoodDetail,
  onUpdateEcosystemHealth 
}) => {
  const { id, nombre, codigo, categoria } = item;
  const isLivelihood = (item: LivelihoodItem | EcosystemItem): item is LivelihoodItem => item.categoria === 'medioDeVida';
  
  const primaryTextColor = 'text-[#B71373]';
  const bgColor = 'bg-white';
  const borderColor = 'border-gray-300';

  return (
    <div
      className={`rounded-lg shadow-lg p-4 border ${bgColor} ${borderColor} flex flex-col justify-between`}
    >
      <div className="mb-4">
        <p className={`text-xs font-semibold ${primaryTextColor} uppercase tracking-wider mb-1`}>
          {isLivelihood(item) ? 'Medio de Vida' : 'Ecosistema'}
        </p>
        <p className={`text-center font-bold ${primaryTextColor} text-base leading-tight mb-2`}>{nombre.toUpperCase()}</p>
        <div className={`text-sm font-mono px-2 py-1 bg-[#FDF0F8] text-[#B71373] rounded-md text-center`}>
          CÓDIGO: {codigo}
        </div>
      </div>
      
      <div className="mt-auto pt-3 border-t border-gray-200 space-y-3">
        {isLivelihood(item) && onUpdateLivelihoodDetail && (
          <>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Tipo de Uso:</h4>
            <label className="flex items-center space-x-2 text-sm text-gray-600 hover:bg-[#FDF0F8] p-1 rounded">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-[#B71373] border-gray-300 rounded focus:ring-[#B71373]"
                checked={item.isAutoconsumo || false}
                onChange={(e) => onUpdateLivelihoodDetail(id, 'isAutoconsumo', e.target.checked)}
              />
              <span>Autoconsumo</span>
            </label>
            <label className="flex items-center space-x-2 text-sm text-gray-600 hover:bg-[#FDF0F8] p-1 rounded">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-[#B71373] border-gray-300 rounded focus:ring-[#B71373]"
                checked={item.isComercial || false}
                onChange={(e) => onUpdateLivelihoodDetail(id, 'isComercial', e.target.checked)}
              />
              <span>Comercial</span>
            </label>
          </>
        )}

        {!isLivelihood(item) && onUpdateEcosystemHealth && (
          <>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Nivel de Salud:</h4>
            {[1, 2, 3].map(level => (
              <label key={level} className="flex items-center space-x-2 text-sm text-gray-600 hover:bg-[#FDF0F8] p-1 rounded">
                <input
                  type="radio"
                  name={`health-${id}`}
                  className="form-radio h-4 w-4 text-[#B71373] border-gray-300 focus:ring-[#B71373]"
                  value={level}
                  checked={(item as EcosystemItem).salud === level}
                  onChange={() => onUpdateEcosystemHealth(id, level as 1 | 2 | 3)}
                />
                <span>Salud Nivel {level}</span>
              </label>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
