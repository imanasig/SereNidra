
import React from 'react';
import { Moon, Sun, Zap, Layers } from 'lucide-react';

const FilterPanel = ({ selectedType, onSelectType }) => {
    const filters = [
        { id: 'all', label: 'All', icon: Layers, color: 'text-gray-600', activeColor: 'text-white', activeBg: 'bg-gray-800' },
        { id: 'stress-relief', label: 'Stress Relief', icon: Sun, color: 'text-amber-500', activeColor: 'text-white', activeBg: 'bg-amber-500' },
        { id: 'sleep', label: 'Deep Sleep', icon: Moon, color: 'text-indigo-500', activeColor: 'text-white', activeBg: 'bg-indigo-500' },
        { id: 'focus', label: 'Better Focus', icon: Zap, color: 'text-violet-500', activeColor: 'text-white', activeBg: 'bg-violet-500' },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
                const Icon = filter.icon;
                const isSelected = selectedType === filter.id || (selectedType === '' && filter.id === 'all');

                return (
                    <button
                        key={filter.id}
                        onClick={() => onSelectType(filter.id === 'all' ? '' : filter.id)}
                        className={`
                            px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 flex items-center gap-2
                            ${isSelected
                                ? `${filter.activeBg} ${filter.activeColor} border-transparent shadow-lg transform scale-105 ring-2 ring-offset-2 ring-violet-200`
                                : `bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-violet-200 hover:shadow-md hover:-translate-y-0.5`
                            }
                        `}
                    >
                        <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : filter.color}`} />
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
};

export default FilterPanel;
