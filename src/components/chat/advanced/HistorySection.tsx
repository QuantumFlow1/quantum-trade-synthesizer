
import React from 'react';
import { HistorySectionProps } from './types';

const HistorySection: React.FC<HistorySectionProps> = ({ history }) => {
  return (
    <div className="w-full md:w-1/4 p-4 border-l">
      <h2 className="text-lg font-bold mb-4">Geschiedenis</h2>
      {history.length > 0 ? (
        <ul className="space-y-4">
          {history.map((item, index) => (
            <li key={index} className="p-3 bg-gray-50 rounded-md">
              <div className="font-medium text-blue-600 mb-1">{item.task}</div>
              <div className="text-sm text-gray-700">
                {item.output.length > 100 
                  ? `${item.output.slice(0, 100)}...` 
                  : item.output}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">Nog geen geschiedenis beschikbaar</p>
      )}
    </div>
  );
};

export default HistorySection;
