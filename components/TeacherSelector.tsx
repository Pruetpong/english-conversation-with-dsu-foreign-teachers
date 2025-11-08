import React from 'react';
import { TEACHERS } from '../constants';
import { Teacher } from '../types';
import { CheckCircleIcon } from './icons';

interface TeacherSelectorProps {
  selectedTeacherId: string;
  onSelectTeacher: (id: string) => void;
}

const TeacherCard: React.FC<{ teacher: Teacher; isSelected: boolean; onSelect: () => void }> = ({ teacher, isSelected, onSelect }) => (
  <div
    onClick={onSelect}
    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 relative overflow-hidden group ${
      isSelected 
        ? 'bg-sky-500/10 border-sky-500 shadow-lg shadow-sky-500/10' 
        : 'bg-white border-slate-200 hover:border-sky-400 hover:bg-slate-50'
    }`}
  >
    {isSelected && (
        <div className="absolute top-2 right-2 text-sky-500">
            <CheckCircleIcon className="w-5 h-5" />
        </div>
    )}
    <div className="flex items-center">
      <img src={`https://picsum.photos/seed/${teacher.id}/50/50`} alt={teacher.name} className="w-12 h-12 rounded-full mr-4 border-2 border-slate-300" />
      <div>
        <h3 className="font-bold text-slate-800 pr-6">{teacher.name}</h3>
        <p className="text-sm text-slate-500">{teacher.nationality}</p>
      </div>
    </div>
    <p className="text-sm text-slate-600 line-clamp-2 mt-3 pl-1"><span className="font-semibold text-slate-500">Specializes in:</span> {teacher.subjects}</p>
  </div>
);


const TeacherSelector: React.FC<TeacherSelectorProps> = ({ selectedTeacherId, onSelectTeacher }) => {
  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold text-slate-600 mb-3 px-1">Choose Your Teacher</h2>
      <div className="grid grid-cols-1 gap-3">
        {TEACHERS.map(teacher => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            isSelected={selectedTeacherId === teacher.id}
            onSelect={() => onSelectTeacher(teacher.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TeacherSelector;