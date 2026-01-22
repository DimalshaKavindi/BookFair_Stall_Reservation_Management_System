import { useState } from 'react';
import { CheckCircle2, MapPin, Grid3x3, List, Eye, Warehouse } from 'lucide-react';
import type { Stall } from '../types/StallType';

interface StallMapProps {
    stalls: Stall[];
    selectedStalls?: Stall[];
    onStallClick?: (stall: Stall) => void;
    readOnly?: boolean;
    showLegend?: boolean;
    highlightReserved?: boolean;
    className?: string;
}

type ViewMode = 'map' | 'list';

export default function StallMap({ 
    stalls, 
    selectedStalls = [], 
    onStallClick,
    readOnly = false,
    highlightReserved = false,
    className = ''
}: StallMapProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('map');

const getStallColor = (stall: Stall) => {
const isSelected = selectedStalls.find(s => s.id === stall.id);
    
if (isSelected) {
    return {
        bg: 'bg-sky-400',
        border: 'border-sky-500',
        text: 'text-white',
        hover: readOnly ? '' : 'hover:bg-sky-500'
    };
}

if (!stall.isAvailable) {
    if (highlightReserved) {
    return {
        bg: 'bg-red-400',
        border: 'border-red-500',
        text: 'text-white',
        hover: ''
    };
    }
    return {
        bg: 'bg-gray-300',
        border: 'border-gray-400',
        text: 'text-gray-600',
        hover: ''
    };
}

switch (stall.size) {
    case 'SMALL':
        return {
        bg: 'bg-green-300 ',
        border: 'border-green-400',
        text: 'text-green-800',
        hover: readOnly ? '' : 'hover:bg-emerald-500'
        };
    case 'MEDIUM':
        return {
        bg: 'bg-yellow-300',
        border: 'border-yellow-400',
        text: 'text-yellow-800',
        hover: readOnly ? '' : 'hover:bg-yellow-500'
        };
    case 'LARGE':
        return {
        bg: 'bg-red-300',
        border: 'border-red-400',
        text: 'text-red-800',
        hover: readOnly ? '' : 'hover:bg-red-500'
        };
    default:
        return {
        bg: 'bg-gray-300',
        border: 'border-gray-400',
        text: 'text-gray-700',
        hover: ''
        };
    }
};

const handleStallClick = (stall: Stall) => {
    if (readOnly) return;
    if (!stall.isAvailable && !highlightReserved) return;
    onStallClick?.(stall);
};


const groupStallsByRow = () => {
    const rows = new Map<number, Stall[]>();
    stalls.forEach(stall => {
    if (!rows.has(stall.positionY)) {
        rows.set(stall.positionY, []);
    }
    rows.get(stall.positionY)!.push(stall);
    });
    
    const sizeOrder = { 'SMALL': 1, 'MEDIUM': 2, 'LARGE': 3 };
    rows.forEach(row => {
        row.sort((a, b) => {
        const sizeDiff = sizeOrder[a.size] - sizeOrder[b.size];
        if (sizeDiff !== 0) return sizeDiff;
        return a.positionX - b.positionX;
        });
    });
    
    return Array.from(rows.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([_, stallsInRow]) => stallsInRow);
};

const stallRows = groupStallsByRow();

return (
    <div className={`space-y-4 ${className}`}>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
            
            <div className='flex flex-col'>
                <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-3'>
                <Warehouse className="w-5 h-5 text-gray-500" />
                Stall Type Legend
                </h3>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-8 flex-wrap">
                    <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-emerald-400 border-2 border-emerald-500 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-white">S</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Small Stall</p>
                        <p className="text-xs text-gray-600">2x2m - LKR 20,000</p>
                    </div>
                    </div>

                    <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-yellow-400 border-2 border-yellow-500 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-white">M</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Medium Stall</p>
                        <p className="text-xs text-gray-600">3x3m - LKR 35,000</p>
                    </div>
                    </div>

                    <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-red-400 border-2 border-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-white">L</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Large Stall</p>
                        <p className="text-xs text-gray-600">4x3m - LKR 50,000</p>
                    </div>
                    </div>

                    <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-300 border-2 border-gray-400 rounded-lg flex items-center justify-center opacity-60">
                        <span className="text-xs text-gray-600">✕</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Reserved</p>
                        <p className="text-xs text-gray-600">Not Available</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'map' 
                    ? 'bg-white text-blue-600 shadow-sm font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                >
                <Grid3x3 className="w-4 h-4" />
                <span className="text-sm">Map View</span>
                </button>
                <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                >
                <List className="w-4 h-4" />
                <span className="text-sm">List View</span>
                </button>
            </div>
            </div>
        </div>

        
        {viewMode === 'map' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Exhibition Venue Map</h3>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border-2 border-gray-200">
                <div className="flex justify-center mb-6">
                <div className="bg-blue-500 text-white px-8 py-3 rounded-xl shadow-lg text-sm font-bold flex items-center gap-2">
                    ← ENTRANCE →
                </div>
                </div>

                <div className="space-y-4">
                {stallRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-2 flex-wrap">
                    {row.map(stall => {
                        const colors = getStallColor(stall);
                        const isSelected = selectedStalls.find(s => s.id === stall.id);
                        
                        return (
                        <button
                            key={stall.id}
                            onClick={() => handleStallClick(stall)}
                            disabled={readOnly ? false : !stall.isAvailable}
                            className={`
                            ${colors.bg} ${colors.border} ${colors.text} ${colors.hover}
                            border-2 rounded-lg transition-all duration-200 
                            flex flex-col items-center justify-center gap-1
                            ${stall.size === 'SMALL' ? 'w-16 h-16' : ''}
                            ${stall.size === 'MEDIUM' ? 'w-24 h-16' : ''}
                            ${stall.size === 'LARGE' ? 'w-32 h-16' : ''}
                            ${readOnly ? 'cursor-default' : stall.isAvailable ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : 'cursor-not-allowed opacity-60'}
                            ${isSelected ? 'ring-4 ring-sky-300 scale-105 shadow-xl' : ''}
                            `}
                            title={`Stall ${stall.name} - ${stall.size} (${stall.dimensions}) - ${stall.isAvailable ? 'Available' : 'Reserved'}`}
                        >
                            <span className="text-lg font-bold">{stall.name}</span>
                            <span className="text-xs font-semibold opacity-90">{stall.size[0]}</span>
                            {isSelected && <CheckCircle2 className="w-3 h-3 absolute top-0.5 right-0.5" />}
                            
                        </button>
                        );
                    })}
                    </div>
                ))}
                </div>

                <div className="mt-6 flex justify-center">
                <div className="bg-white/90 px-6 py-3 rounded-lg shadow-md border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700">BMICH Hall A</p>
                    <p className="text-xs text-gray-500">Exhibition Floor</p>
                </div>
                </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {readOnly ? (
                    <span><strong>View Mode:</strong> This is a read-only view of the exhibition floor plan.</span>
                ) : (
                    <span><strong>Interactive Map:</strong> Click on available stalls to select them for reservation.</span>
                )}
                </p>
            </div>
            </div>
        )}

        {viewMode === 'list' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
                <List className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">All Stalls</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {stalls
                .sort((a, b) => {
                    const sizeOrder = { 'SMALL': 1, 'MEDIUM': 2, 'LARGE': 3 };
                    const sizeDiff = sizeOrder[a.size] - sizeOrder[b.size];
                    if (sizeDiff !== 0) return sizeDiff;
                    return a.name.localeCompare(b.name);
                })
                .map(stall => {
                    const colors = getStallColor(stall);
                    const isSelected = selectedStalls.find(s => s.id === stall.id);
                    
                    return (
                    <button
                        key={stall.id}
                        onClick={() => handleStallClick(stall)}
                        disabled={readOnly ? false : !stall.isAvailable}
                        className={`
                            ${colors.bg} ${colors.border} ${colors.text}
                            border-2 rounded-xl p-4 transition-all duration-200
                            ${readOnly ? 'cursor-default' : stall.isAvailable ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : 'cursor-not-allowed opacity-60'}
                            ${isSelected ? 'ring-4 ring-sky-300 scale-105 shadow-xl' : ''}
                        `}
                        >
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-left">
                            <p className="text-2xl font-bold">{stall.name}</p>
                            <p className="text-sm opacity-90 font-semibold">{stall.size}</p>
                            </div>
                            <div className="text-left">
                            <p className="text-xs opacity-90">{stall.dimensions}</p>
                            <p className="text-xs opacity-75">{stall.location}</p>
                            <p className="text-xs font-semibold mt-2">
                                {stall.isAvailable ? 'Available' : 'Reserved'}
                            </p>
                            </div>
                        </div>
                        </button>
                    );
                })}
            </div>
            </div>
        )}
        </div>
    );
}