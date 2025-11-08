import React from 'react';
import { Settings } from '../types';
import { SCENARIOS, USER_MODES } from '../constants';
import { TrashIcon } from './icons';


interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  onClear: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange, onClear }) => {
  const selectedScenario = SCENARIOS.find(s => s.id === settings.scenarioId);

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange('temperature', parseFloat(e.target.value));
  };
  
  return (
    <div className="space-y-6">
      <div className="border-t border-slate-200 pt-6">
        <label htmlFor="scenario" className="block text-sm font-medium text-slate-600 mb-1 px-1">Scenario</label>
        <select
          id="scenario"
          value={settings.scenarioId}
          onChange={(e) => onSettingsChange('scenarioId', e.target.value)}
          className="w-full bg-white border border-slate-300 rounded-md shadow-sm p-2 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        >
          {SCENARIOS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {selectedScenario && (
            <p className="text-xs text-slate-500 mt-2 px-1">{selectedScenario.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1 px-1">Mode</label>
        <div className="flex bg-slate-200 rounded-lg p-1 space-x-1">
          {USER_MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => onSettingsChange('userModeId', mode.id)}
              className={`w-full text-center px-3 py-1.5 text-sm rounded-md transition-colors ${
                settings.userModeId === mode.id 
                ? 'bg-white text-sky-600 font-semibold shadow-sm' 
                : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              {mode.name}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="temperature" className="block text-sm font-medium text-slate-600 mb-2 px-1">
          Creativity: {settings.temperature.toFixed(1)}
        </label>
        <input
          id="temperature"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={settings.temperature}
          onChange={handleTemperatureChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
      </div>

       <div>
        <label className="flex items-center justify-between cursor-pointer p-1">
          <span className="text-sm font-medium text-slate-600">Teacher Voice (TTS)</span>
          <div className="relative">
            <input type="checkbox" className="sr-only peer" checked={settings.useTTS} onChange={(e) => onSettingsChange('useTTS', e.target.checked)} />
            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
          </div>
        </label>
      </div>
      
      <div className="border-t border-slate-200 pt-6">
        <button onClick={onClear} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-rose-500/30 text-rose-500 rounded-lg hover:bg-rose-500/10 hover:border-rose-500/50 transition-colors font-semibold">
          <TrashIcon className="w-4 h-4" />
          Clear Conversation
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;