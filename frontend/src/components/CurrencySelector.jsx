import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function CurrencySelector({ variant = 'navbar' }) {
  const { currency, currencyCode, supportedCurrencies, setCurrencyCode } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          variant === 'navbar'
            ? 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
            : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-2xs'
        }`}
        title="Change Global Viewing Currency"
      >
        <span className="text-sm">{currency.flag}</span>
        <span className="font-bold">{currency.code}</span>
        <span className="text-gray-400 font-mono text-[11px]">({currency.symbol})</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-fade-in max-h-72 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex items-center justify-between">
            <span>Worldwide Currencies</span>
            <Globe className="w-3 h-3 text-gray-400" />
          </div>
          
          <div className="py-1">
            {supportedCurrencies.map((c) => {
              const isSelected = c.code === currencyCode;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setCurrencyCode(c.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors ${
                    isSelected ? 'bg-amber-50/80 font-bold text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{c.flag}</span>
                    <div>
                      <div className="font-semibold text-gray-900 leading-tight">
                        {c.code} <span className="text-gray-400 font-normal">({c.symbol})</span>
                      </div>
                      <div className="text-[10px] text-gray-400 leading-tight">{c.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
