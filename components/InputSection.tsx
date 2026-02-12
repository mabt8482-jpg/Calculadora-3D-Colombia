
import React, { useState, useEffect } from 'react';
import { formatInputNumber } from '../services/calculator';

interface InputSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const InputSection: React.FC<InputSectionProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-[#1E293B] rounded-2xl shadow-lg border border-white/5 overflow-hidden mb-8 transition-all hover:border-blue-500/30">
      <div className="bg-[#2a374a] px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <span className="text-[#2563EB]">{icon}</span>
        <h2 className="font-bold text-white uppercase tracking-widest text-xs">{title}</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        {children}
      </div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  suffix?: string;
  prefix?: string;
  helper?: string;
  isCurrency?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, suffix, prefix, helper }) => {
  const [displayValue, setDisplayValue] = useState(formatInputNumber(value));

  useEffect(() => {
    setDisplayValue(formatInputNumber(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const num = parseFloat(raw) || 0;
    
    if (raw.split('.').length > 2) return;
    
    setDisplayValue(raw);
    onChange(num);
  };

  const handleBlur = () => {
    setDisplayValue(formatInputNumber(value));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</label>
      <div className="relative flex items-center group">
        {prefix && <span className="absolute left-4 text-slate-500 text-sm font-bold">{prefix}</span>}
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0"
          className={`w-full bg-[#0F172A] border border-white/10 rounded-xl py-3.5 font-semibold text-white ${prefix ? 'pl-9' : 'px-5'} ${suffix ? 'pr-20' : 'px-5'} focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all text-sm group-hover:border-white/20`}
        />
        {suffix && (
          <span className="absolute right-4 text-slate-500 text-[9px] font-black uppercase tracking-tight pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {helper && <p className="text-[10px] text-slate-500 leading-tight font-medium italic">{helper}</p>}
    </div>
  );
};

interface InputSelectFieldProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  selectValue: string;
  onSelectChange: (val: any) => void;
  options: { label: string; value: string }[];
  prefix?: string;
  helper?: string;
}

export const InputSelectField: React.FC<InputSelectFieldProps> = ({ label, value, onChange, selectValue, onSelectChange, options, prefix, helper }) => {
  const [displayValue, setDisplayValue] = useState(formatInputNumber(value));

  useEffect(() => {
    setDisplayValue(formatInputNumber(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setDisplayValue(raw);
    onChange(parseFloat(raw) || 0);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">{prefix}</span>}
          <input
            type="text"
            value={displayValue}
            onChange={handleChange}
            onBlur={() => setDisplayValue(formatInputNumber(value))}
            className={`w-full bg-[#0F172A] border border-white/10 rounded-xl py-3.5 font-semibold text-white ${prefix ? 'pl-9' : 'px-5'} focus:ring-2 focus:ring-[#2563EB] outline-none transition-all text-sm`}
          />
        </div>
        <select
          value={selectValue}
          onChange={(e) => onSelectChange(e.target.value)}
          className="bg-[#0F172A] border border-white/10 rounded-xl px-3 py-3.5 text-[10px] font-black text-white uppercase outline-none focus:ring-2 focus:ring-[#2563EB] cursor-pointer"
        >
          {options.map(opt => <option key={opt.value} value={opt.value} className="bg-[#1E293B]">{opt.label}</option>)}
        </select>
      </div>
      {helper && <p className="text-[10px] text-slate-500 leading-tight font-medium italic">{helper}</p>}
    </div>
  );
};
