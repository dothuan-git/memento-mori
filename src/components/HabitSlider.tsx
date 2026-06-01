import { ReactNode } from 'react';
import { Trash2, Smartphone, Moon, Briefcase, Utensils, Car, Compass, Smile } from 'lucide-react';

interface HabitSliderProps {
  id: string;
  name: string;
  hours: number;
  max: number;
  step: number;
  color: string;
  isCustom?: boolean;
  onHoursChange: (hours: number) => void;
  onNameChange?: (name: string) => void;
  onDelete?: () => void;
  onColorChange?: (color: string) => void;
  impactText: string;
  icon?: ReactNode;
  key?: string;
  onStartPour?: () => void;
  onEndPour?: () => void;
}

const PRESET_COLORS = [
  '#1E3A8A', // Deep Indigo Blue
  '#7C3AED', // Royal Purple Violet
  '#059669', // Emerald Green
  '#D97706', // Bronze Amber
  '#DC2626', // Crimson Red
  '#06B6D4', // Vivid Cyan
  '#DB2777', // Deep Pink
  '#4F46E5', // Vapor Indigo
];

export default function HabitSlider({
  id,
  name,
  hours,
  max,
  step,
  color,
  isCustom = false,
  onHoursChange,
  onNameChange,
  onDelete,
  onColorChange,
  impactText,
  icon,
  onStartPour,
  onEndPour
}: HabitSliderProps) {
  return (
    <div 
      className="group relative p-4 rounded-xl border border-[#2c2a29]/10 bg-[#fbfaf7]/60 hover:bg-[#fbfaf7] hover:border-[#2c2a29]/20 transition-all duration-300 space-y-3" 
      id={`slider-card-${id}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div 
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-[#2c2a29]/10"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            {icon || <Smile className="w-4 h-4" />}
          </div>
          
          <div className="flex-1 min-w-0">
            {isCustom && onNameChange ? (
              <input
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full bg-transparent font-serif text-sm font-medium text-[#2c2a29] border-b border-transparent hover:border-[#2c2a29]/20 focus:border-[#c8563f] focus:outline-none transition-colors py-0.5"
                placeholder="Custom Habit"
                maxLength={24}
                id={`input-name-${id}`}
              />
            ) : (
              <span className="font-serif text-sm font-medium text-[#2c2a29] tracking-wide block truncate">
                {name}
              </span>
            )}
          </div>
        </div>

        {/* Tactical Direct Number Input and Accents */}
        <div className="flex items-center gap-1.5 matches-number-input">
          <button
            type="button"
            onClick={() => {
              const val = Math.max(0, hours - step);
              onHoursChange(parseFloat(val.toFixed(1)));
            }}
            className="w-6 h-6 rounded border border-[#2c2a29]/10 bg-[#eae6db]/30 hover:bg-[#eae6db]/60 text-xs font-semibold text-[#2c2a29] flex items-center justify-center cursor-pointer select-none transition-colors"
            title="Decrease hours"
          >
            -
          </button>
          
          <div className="flex items-center bg-[#eae6db]/30 border border-[#2c2a29]/10 rounded px-1.5 focus-within:ring-1 focus-within:ring-[#c8563f] focus-within:bg-[#fbfaf7] overflow-hidden">
            <input
              type="number"
              min={0}
              max={max}
              step={step}
              value={Number(hours.toFixed(1))}
              onChange={(e) => {
                let val = parseFloat(e.target.value);
                if (isNaN(val)) val = 0;
                val = Math.max(0, Math.min(max, val));
                onHoursChange(parseFloat(val.toFixed(1)));
              }}
              onFocus={onStartPour}
              onBlur={onEndPour}
              className="font-mono text-xs font-bold text-[#2c2a29] bg-transparent w-10 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              title="Type precise hours directly"
              id={`input-hours-${id}`}
            />
            <span className="text-[10px] text-[#73706c] font-semibold select-none">h</span>
          </div>

          <button
            type="button"
            onClick={() => {
              const val = Math.min(max, hours + step);
              onHoursChange(parseFloat(val.toFixed(1)));
            }}
            className="w-6 h-6 rounded border border-[#2c2a29]/10 bg-[#eae6db]/30 hover:bg-[#eae6db]/60 text-xs font-semibold text-[#2c2a29] flex items-center justify-center cursor-pointer select-none transition-colors"
            title="Increase hours"
          >
            +
          </button>

          {isCustom && onDelete && (
            <button
              onClick={onDelete}
              className="text-[#73706c] hover:text-[#b8483f] p-1 rounded-lg hover:bg-[#b8483f]/10 transition-colors cursor-pointer ml-1"
              title="Delete custom habit"
              id={`btn-delete-${id}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>



      {/* Impact Statement */}
      <div className="flex items-center justify-between pt-1 border-t border-[#2c2a29]/5">
        <span className="text-[11px] font-serif italic text-[#73706c] select-none">
          {impactText}
        </span>

        {/* Inline Color Dot selector for Customs */}
        {isCustom && onColorChange && (
          <div className="flex items-center gap-1.5">
            {PRESET_COLORS.map((col) => (
              <button
                key={col}
                onClick={() => onColorChange(col)}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300 relative"
                style={{ 
                  backgroundColor: col,
                  transform: color === col ? 'scale(1.25)' : 'scale(1)',
                  boxShadow: color === col ? `0 0 6px ${col}80` : 'none'
                }}
                title="Change habit color"
                id={`btn-col-${id}-${col.replace('#', '')}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
