import { SkinColor, SKIN_COLORS } from '@/types/game';
import { useGameStore } from '@/store/gameStore';

const SKIN_OPTIONS: { id: SkinColor; name: string; emoji: string }[] = [
  { id: 'green', name: '翡翠绿', emoji: '🌿' },
  { id: 'blue', name: '电光蓝', emoji: '⚡' },
  { id: 'red', name: '烈焰红', emoji: '🔥' },
];

export default function SkinSelector() {
  const skinColor = useGameStore(state => state.skinColor);
  const setSkinColor = useGameStore(state => state.setSkinColor);
  const isPlaying = useGameStore(state => state.isPlaying);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-sm text-slate-400 uppercase tracking-wider">选择皮肤</div>
      <div className="flex gap-4">
        {SKIN_OPTIONS.map(option => {
          const colors = SKIN_COLORS[option.id];
          const isSelected = skinColor === option.id;
          const isDisabled = isPlaying;

          return (
            <button
              key={option.id}
              onClick={() => !isDisabled && setSkinColor(option.id)}
              disabled={isDisabled}
              className={`
                relative w-16 h-16 rounded-xl transition-all duration-300
                flex flex-col items-center justify-center gap-1
                ${isSelected 
                  ? 'ring-2 ring-offset-2 ring-offset-slate-900 scale-110' 
                  : 'hover:scale-105'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{
                background: `linear-gradient(135deg, ${colors.head}30, ${colors.body}50)`,
                boxShadow: isSelected ? `0 0 20px ${colors.glow}` : 'none',
              }}
            >
              <span className="text-xl">{option.emoji}</span>
              <span 
                className="text-xs font-medium"
                style={{ color: colors.head }}
              >
                {option.name}
              </span>
              {isSelected && (
                <div 
                  className="absolute inset-0 rounded-xl border-2"
                  style={{ borderColor: colors.head }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
