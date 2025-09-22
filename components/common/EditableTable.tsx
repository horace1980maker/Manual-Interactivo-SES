
import React from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export interface ColumnConfig<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  render?: (row: T, rowIndex: number, onChange: (rowIndex: number, field: keyof T, value: any) => void) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface EditableTableProps<T extends { id: string | number }> {
  columns: ColumnConfig<T>[];
  data: T[];
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  onAddRow?: () => void;
  onDeleteRow?: (rowIndex: number) => void;
  newRowTemplate?: T; // For adding new rows with a specific template
  caption?: string;
}

export const EditableTable = <T extends { id: string | number }>(
  { columns, data, setData, onAddRow, onDeleteRow, newRowTemplate, caption }: EditableTableProps<T>
) => {
  const handleInputChange = (rowIndex: number, field: keyof T, value: any) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [field]: value };
    setData(newData);
  };

  const defaultRender = (row: T, rowIndex: number, accessor: keyof T) => (
    <Input
      type="text"
      value={row[accessor] as string | number}
      onChange={(e) => handleInputChange(rowIndex, accessor, e.target.value)}
      className="w-full text-sm border-gray-200"
      wrapperClassName="m-0"
    />
  );
  
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      {caption && <caption className="p-2 text-lg font-semibold text-left text-gray-900 bg-gray-50">{caption}</caption>}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#EBF5FF]">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className={`px-4 py-3 text-left text-xs font-medium text-[#001F89] uppercase tracking-wider ${col.headerClassName || ''}`}
              >
                {col.header}
              </th>
            ))}
            {onDeleteRow && (
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#001F89] uppercase tracking-wider">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={row.id} className="hover:bg-[#EBF5FF]/50 transition-colors">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={`px-4 py-2 whitespace-nowrap text-sm text-gray-700 ${col.className || ''}`}>
                  {col.render
                    ? col.render(row, rowIndex, handleInputChange)
                    : typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : defaultRender(row, rowIndex, col.accessor as keyof T)}
                </td>
              ))}
              {onDeleteRow && (
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <Button variant="danger" size="sm" onClick={() => onDeleteRow(rowIndex)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {onAddRow && newRowTemplate && (
        <div className="p-2 bg-gray-50 text-right">
          <Button variant="primary" size="sm" onClick={onAddRow}>
            <PlusIcon className="h-5 w-5 mr-1 inline-block" /> Añadir Fila
          </Button>
        </div>
      )}
    </div>
  );
};