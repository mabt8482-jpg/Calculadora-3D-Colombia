
import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_STATE } from './constants';
import { AppState } from './types';
import { calculateEverything, formatCurrency, formatNumber } from './services/calculator';
import { InputSection, InputField, InputSelectField } from './components/InputSection';
import { 
  Settings, 
  Package, 
  Clock, 
  TrendingUp, 
  Layers, 
  Zap, 
  Wrench, 
  RefreshCcw, 
  ArrowRightLeft,
  Activity,
  BarChart3,
  Scale,
  Heart,
  X,
  CreditCard,
  ExternalLink,
  Smartphone,
  Globe
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('calc3d_state_final');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [showWelcome, setShowWelcome] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  useEffect(() => {
    localStorage.setItem('calc3d_state_final', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('calc3d_welcome_seen');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const closeWelcome = () => {
    localStorage.setItem('calc3d_welcome_seen', 'true');
    setShowWelcome(false);
  };

  const results = useMemo(() => calculateEverything(state), [state]);

  const chartData = useMemo(() => {
    const total = Object.values(results.breakdown).reduce((a, b) => a + b, 0);
    return [
      { name: 'Gastos Fijos', value: results.breakdown.fixed, perc: ((results.breakdown.fixed/total)*100).toFixed(1) },
      { name: 'Filamento', value: results.breakdown.filament, perc: ((results.breakdown.filament/total)*100).toFixed(1) },
      { name: 'Energía', value: results.breakdown.electricity, perc: ((results.breakdown.electricity/total)*100).toFixed(1) },
      { name: 'Mano Obra', value: results.breakdown.labor, perc: ((results.breakdown.labor/total)*100).toFixed(1) },
      { name: 'Insumos / Otros', value: results.breakdown.materials, perc: ((results.breakdown.materials/total)*100).toFixed(1) },
    ].filter(item => item.value > 0);
  }, [results]);

  const COLORS = ['#2563EB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];

  const handleUpdate = (path: string, value: any) => {
    const keys = path.split('.');
    setState(prev => {
      const newState = { ...prev };
      let current: any = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const wastedGrams = (state.variableCosts.partWeight * (state.variableCosts.failureRate / 100));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, perc }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[13px] font-black pointer-events-none drop-shadow-md">
        {perc}%
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-[#0F172A] pb-20 selection:bg-[#2563EB] selection:text-white">
      {/* Modal de Bienvenida */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-all duration-500"></div>
          
          <div className="relative bg-[#1E293B] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {!showAccount ? (
              <div className="text-center">
                <div className="bg-[#2563EB] w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/20">
                   <Heart className="text-white fill-white" size={40} />
                </div>
                <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter italic">
                  Proyecto <span className="text-[#22C55E]">Comunidad Maker</span>
                </h2>
                <div className="space-y-4 text-slate-300 text-sm leading-relaxed mb-10 font-medium">
                  <p>Este proyecto nació con una idea simple: hacer que la impresión 3D en Colombia sea más clara, justa y accesible para todos.</p>
                  <p>La calculadora es completamente gratuita y seguirá siéndolo. Si te ha ayudado en tu trabajo o emprendimiento, puedes apoyar su crecimiento con una donación voluntaria.</p>
                  <p className="font-bold text-white italic">Cada aporte ayuda a mantener esta herramienta viva para toda la comunidad maker.</p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setShowAccount(true)}
                    className="w-full bg-[#22C55E] hover:bg-[#1DA851] text-[#0F172A] font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                  >
                    <CreditCard size={18} /> Ver canales de apoyo
                  </button>
                  <button 
                    onClick={closeWelcome}
                    className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-slate-400 font-bold py-4 rounded-2xl transition-all uppercase tracking-widest text-xs"
                  >
                    Cerrar y no volver a mostrar
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center animate-in slide-in-from-right-10 duration-300">
                <button 
                  onClick={() => setShowAccount(false)}
                  className="absolute top-6 right-6 text-slate-500 hover:text-white transition-all"
                >
                  <X size={24} />
                </button>
                <div className="bg-[#22C55E]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Heart className="text-[#22C55E]" size={32} />
                </div>
                <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest italic">Medios de Apoyo</h3>
                
                <div className="space-y-4 text-left">
                  {/* Nequi & Daviplata */}
                  <div className="bg-[#0F172A] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <Smartphone size={16} className="text-[#22C55E]" />
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Nequi / Daviplata</p>
                      </div>
                      <p className="text-2xl font-black text-[#22C55E] tracking-[0.1em]">316 522 3695</p>
                    </div>
                  </div>

                  {/* Bancolombia - Bre-B */}
                  <div className="bg-[#0F172A] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard size={16} className="text-[#2563EB]" />
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Bancolombia (Llave Bre-B)</p>
                      </div>
                      <p className="text-2xl font-black text-white tracking-[0.1em]">009 166 1951</p>
                      <p className="text-[9px] text-blue-400 font-bold uppercase mt-2">Usa este número como llave para transferencias</p>
                    </div>
                  </div>

                  {/* Mercado Pago - Internacional */}
                  <div className="bg-[#0F172A] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe size={16} className="text-[#00B1EA]" />
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Apoyo Internacional / Otros</p>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-2">Link de Mercado Pago para extranjeros:</p>
                      <a 
                        href="https://link.mercadopago.com.co/calculadora3dpro" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-black text-blue-400 hover:text-blue-300 underline break-all flex items-center gap-1"
                      >
                        link.mercadopago.com.co/calculadora3dpro <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic my-8 leading-relaxed px-4">
                  Tu apoyo nos permite seguir innovando y manteniendo esta herramienta gratuita para todos los emprendedores del país.
                </p>

                <button 
                  onClick={closeWelcome}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20"
                >
                  Entendido, ¡gracias!
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header Tecnológico */}
      <header className="bg-[#1E293B] border-b border-white/5 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 h-24 flex flex-col md:flex-row items-center justify-between gap-4 py-2 md:py-0">
          <div className="flex items-center gap-4">
            <div className="bg-[#2563EB] p-3 rounded-2xl text-white shadow-xl shadow-blue-900/40">
              <Layers size={28} />
            </div>
            <div>
              <h1 className="font-black text-2xl text-white tracking-tighter uppercase italic">Calculadora <span className="text-[#22C55E]">3D</span> Pro</h1>
              <p className="text-[9px] text-[#22C55E] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
                Sector Industrial Colombia 🇨🇴
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-5 bg-[#0F172A] p-2 rounded-2xl border border-white/5 shadow-inner">
            <div className="flex items-center gap-3 px-3 border-r border-white/10 mr-2">
              <ArrowRightLeft size={16} className="text-[#2563EB]" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">TRM (COP/USD)</span>
                <input 
                  type="number"
                  value={state.exchangeRate}
                  onChange={(e) => handleUpdate('exchangeRate', parseFloat(e.target.value) || 0)}
                  className="bg-transparent border-none text-sm font-black text-white w-24 outline-none p-0 h-5"
                />
              </div>
            </div>

            <div className="flex bg-[#1E293B] shadow-lg rounded-xl p-1 border border-white/5">
              <button 
                onClick={() => handleUpdate('currency', 'COP')}
                className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${state.currency === 'COP' ? 'bg-[#2563EB] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                COP
              </button>
              <button 
                onClick={() => handleUpdate('currency', 'USD')}
                className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${state.currency === 'USD' ? 'bg-[#2563EB] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                USD
              </button>
            </div>

            <button 
              onClick={() => { if(confirm('¿Reiniciar todos los campos?')) setState(INITIAL_STATE); }}
              className="p-3 text-slate-500 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-xl"
              title="Reiniciar"
            >
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Columna de Entradas */}
        <div className="lg:col-span-7 space-y-4">
          
          <InputSection title="Capacidad de Operación" icon={<Settings size={20} />}>
            <InputField 
              label="Horas de impresión mensuales" 
              value={state.monthlyPrintingHours} 
              onChange={(v) => handleUpdate('monthlyPrintingHours', v)}
              suffix="H / MES"
              helper="Total de horas reales que la impresora está trabajando"
            />
            <InputField 
              label="Consumo Promedio Impresora" 
              value={state.variableCosts.printerWatts} 
              onChange={(v) => handleUpdate('variableCosts.printerWatts', v)}
              suffix="WATTS"
              helper="Consumo promedio sostenido (Ej. 120W - 200W)"
            />
          </InputSection>

          <InputSection title="Gastos Fijos Estructurales" icon={<Wrench size={20} />}>
            <InputSelectField 
              label="Renta / Alquiler del Espacio"
              value={state.fixedCosts.rent}
              onChange={(v) => handleUpdate('fixedCosts.rent', v)}
              selectValue={state.fixedCosts.rentFrequency}
              onSelectChange={(v) => handleUpdate('fixedCosts.rentFrequency', v)}
              prefix="$"
              options={[
                { label: 'Día', value: 'day' },
                { label: 'Mes', value: 'month' },
                { label: 'Año', value: 'year' }
              ]}
              helper="Se prorrateará mensualmente de forma automática"
            />
            <InputField 
              label="Energía Eléctrica (Recibo Base)" 
              value={state.fixedCosts.electricityBase} 
              onChange={(v) => handleUpdate('fixedCosts.electricityBase', v)}
              prefix="$"
              helper="Cargos fijos de factura (Aseo, Alumbrado, Red)"
            />
            <InputSelectField 
              label="Conectividad y Servicios Cloud" 
              value={state.fixedCosts.internet} 
              onChange={(v) => handleUpdate('fixedCosts.internet', v)}
              selectValue={state.fixedCosts.internetFrequency}
              onSelectChange={(v) => handleUpdate('fixedCosts.internetFrequency', v)}
              prefix="$"
              options={[
                { label: 'Día', value: 'day' },
                { label: 'Mes', value: 'month' }
              ]}
              helper="Internet, Hosting, Canva, Midjourney, etc."
            />
            <InputField 
              label="Fondo de Amortización" 
              value={state.fixedCosts.depreciation} 
              onChange={(v) => handleUpdate('fixedCosts.depreciation', v)}
              prefix="$"
              helper="Reserva mensual para reponer la impresora en el futuro"
            />
            <InputSelectField 
              label="Mantenimiento Técnico" 
              value={state.fixedCosts.maintenance} 
              onChange={(v) => handleUpdate('fixedCosts.maintenance', v)}
              selectValue={state.fixedCosts.maintenanceFrequency}
              onSelectChange={(v) => handleUpdate('fixedCosts.maintenanceFrequency', v)}
              prefix="$"
              options={[
                { label: 'Día', value: 'day' },
                { label: 'Mes', value: 'month' }
              ]}
              helper="Aceites, boquillas, repuestos de desgaste"
            />
            <InputField 
              label="Otros Gastos Operativos" 
              value={state.fixedCosts.other} 
              onChange={(v) => handleUpdate('fixedCosts.other', v)}
              prefix="$"
              helper="Ej: Papelería, envíos, marketing, licencias, seguros"
            />
          </InputSection>

          <InputSection title="Costos de Producción" icon={<Package size={20} />}>
            <InputField 
              label="Precio Filamento por Kg" 
              value={state.variableCosts.filamentPricePerKg} 
              onChange={(v) => handleUpdate('variableCosts.filamentPricePerKg', v)}
              prefix="$"
              helper="Costo neto de adquisición por kilo"
            />
            <InputField 
              label="Peso Final del Modelo" 
              value={state.variableCosts.partWeight} 
              onChange={(v) => handleUpdate('variableCosts.partWeight', v)}
              suffix="GRAMOS (g)"
              helper="Peso reportado por el laminador (incluye soportes)"
            />
            <InputField 
              label="Tiempo de Ejecución" 
              value={state.variableCosts.printTime} 
              onChange={(v) => handleUpdate('variableCosts.printTime', v)}
              suffix="HORAS"
              helper="Tiempo de impresión real (Ej. 2.5 horas)"
            />
            <InputField 
              label="Tarifa kWh (Costo Unitario)" 
              value={state.variableCosts.electricityKwhPrice} 
              onChange={(v) => handleUpdate('variableCosts.electricityKwhPrice', v)}
              prefix="$"
              helper="Verifica el valor de kWh en tu recibo según estrato"
            />
            <InputField 
              label="Insumos Complementarios" 
              value={state.variableCosts.otherMaterials} 
              onChange={(v) => handleUpdate('variableCosts.otherMaterials', v)}
              prefix="$"
              helper="Packaging, post-procesado, pintura, etc."
            />
            <div className="flex flex-col gap-2">
              <InputField 
                label="Margen de Seguridad Técnica (Residuo)" 
                value={state.variableCosts.failureRate} 
                onChange={(v) => handleUpdate('variableCosts.failureRate', v)}
                suffix="%"
                helper="Factor para cubrir fallos, purgas y soportes perdidos"
              />
              <div className="bg-[#22C55E]/5 border border-[#22C55E]/20 rounded-xl px-4 py-2 flex justify-between items-center">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Residuos Estimados</span>
                 <span className="text-sm font-black text-[#22C55E] italic tracking-tight">{formatNumber(wastedGrams)} g</span>
              </div>
            </div>
          </InputSection>

          <InputSection title="Labor Profesional" icon={<Clock size={20} />}>
            <InputField 
              label="Tiempo de Preparación" 
              value={state.laborCosts.prepTime} 
              onChange={(v) => handleUpdate('laborCosts.prepTime', v)}
              suffix="H"
            />
            <InputField 
              label="Limpieza y Post-proceso" 
              value={state.laborCosts.postProcessTime} 
              onChange={(v) => handleUpdate('laborCosts.postProcessTime', v)}
              suffix="H"
            />
            <InputField 
              label="Tu Salario Hora Pretendido" 
              value={state.laborCosts.hourlyRate} 
              onChange={(v) => handleUpdate('laborCosts.hourlyRate', v)}
              prefix="$"
              helper="Costo de tu tiempo activo por hora de trabajo"
            />
          </InputSection>

          <InputSection title="Rentabilidad de Negocio" icon={<TrendingUp size={20} />}>
            <div className="col-span-1 md:col-span-2 space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-white uppercase tracking-widest">Utilidad sobre el Costo</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Multiplicador neto de ganancia</span>
                  </div>
                  <div className="bg-[#2563EB]/10 px-6 py-3 rounded-2xl border border-[#2563EB]/30 shadow-lg shadow-blue-500/10">
                    <span className="text-4xl font-black text-[#22C55E] italic">{state.profitSettings.desiredMargin}%</span>
                  </div>
               </div>
               <input 
                type="range" 
                min="0" 
                max="400" 
                step="5"
                value={state.profitSettings.desiredMargin}
                onChange={(e) => handleUpdate('profitSettings.desiredMargin', parseInt(e.target.value))}
                className="w-full h-4 bg-[#0F172A] rounded-2xl appearance-none cursor-pointer accent-[#2563EB] border border-white/5"
               />
               <div className="grid grid-cols-4 text-[9px] text-slate-500 font-black uppercase tracking-tighter text-center">
                  <div className="border-r border-white/5 opacity-50">Equilibrio<br/>(0%)</div>
                  <div className="border-r border-white/5 opacity-70">Normal<br/>(100%)</div>
                  <div className="border-r border-white/5">Alta Gama<br/>(200%)</div>
                  <div className="text-[#22C55E]">Premium<br/>(300%+)</div>
               </div>
            </div>
          </InputSection>

        </div>

        {/* Panel de Resultados / Dashboard */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 h-fit space-y-6">
          <div className="bg-[#1E293B] rounded-[2.5rem] shadow-2xl p-10 text-white border border-white/5 relative overflow-hidden ring-4 ring-[#0F172A]">
            
            {/* Indicador de Moneda */}
            <div className="absolute top-0 right-0 bg-[#2563EB] px-6 py-2 rounded-bl-3xl font-black text-[10px] tracking-[0.2em] uppercase shadow-lg z-10 italic">
               MODO {state.currency}
            </div>

            <div className="space-y-12 relative z-0">
              {/* Bloque Precio Sugerido */}
              <div className="text-center md:text-left">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-center md:justify-start gap-2">
                   <BarChart3 size={14} className="text-[#2563EB]" /> Precio Final de Mercado
                </p>
                <div className="flex flex-col gap-1">
                  <h4 className="text-6xl font-black text-[#22C55E] tracking-tighter drop-shadow-2xl italic leading-none">
                    {formatCurrency(results.suggestedPrice, state.currency, state.exchangeRate)}
                  </h4>
                  <div className="flex items-center justify-center md:justify-start gap-3 mt-10">
                    <div className="bg-[#22C55E]/10 px-6 py-4 rounded-2xl border border-[#22C55E]/20 flex items-center gap-2 shadow-2xl">
                       <TrendingUp size={20} className="text-[#22C55E]" />
                       <span className="text-base font-black text-[#22C55E] uppercase tracking-tighter">
                         Ganancia Neta: {formatCurrency(results.totalProfit, state.currency, state.exchangeRate)}
                       </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid de Datos Clave */}
              <div className="grid grid-cols-2 gap-4 pt-10 border-t border-white/5">
                <div className="p-5 bg-[#0F172A]/80 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all">
                  <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Costo Producción</p>
                  <p className="text-lg font-bold text-slate-200 tracking-tight leading-none">{formatCurrency(results.totalPieceCost, state.currency, state.exchangeRate)}</p>
                </div>
                <div className="p-5 bg-[#0F172A]/80 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all">
                  <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Costo por Gramo</p>
                  <p className="text-lg font-bold text-slate-300 tracking-tight leading-none">{formatCurrency(results.totalPieceCost / (state.variableCosts.partWeight || 1), state.currency, state.exchangeRate)}</p>
                </div>
                <div className="p-5 bg-[#0F172A]/80 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all">
                  <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Hora Técnica Fija</p>
                  <p className="text-lg font-bold text-slate-300 tracking-tight leading-none">{formatCurrency(results.hourlyFixedCost, state.currency, state.exchangeRate)}</p>
                </div>
                <div className="p-5 bg-[#0F172A]/80 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all">
                  <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Rentabilidad</p>
                  <p className="text-lg font-bold text-[#2563EB] tracking-tight leading-none">+{state.profitSettings.desiredMargin}%</p>
                </div>
              </div>

              {/* Gráfica Circular Optimizada */}
              <div className="pt-10 border-t border-white/5">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-12 text-center italic">Composición Técnica del Costo</p>
                <div className="h-[400px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="45%"
                        innerRadius={90}
                        outerRadius={150}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        labelLine={false}
                        label={renderCustomizedLabel}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 25px 30px -5px rgb(0 0 0 / 0.5)' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(val: number) => formatCurrency(val, state.currency, state.exchangeRate)}
                      />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        iconType="circle"
                        iconSize={10}
                        wrapperStyle={{ paddingTop: '40px' }}
                        formatter={(value, entry: any) => (
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mx-2 inline-block">
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Barra de Capacidad */}
              <div className="bg-[#0F172A] rounded-3xl p-7 border border-white/5 space-y-5 shadow-inner ring-1 ring-white/5">
                 <div className="flex items-center gap-3">
                    <Activity size={20} className="text-[#2563EB]" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 italic">Ocupación Operativa</span>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Capacidad Instalada</span>
                       <span className="text-sm font-black text-white">{Math.round((state.monthlyPrintingHours / 720) * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-[#1E293B] rounded-full overflow-hidden shadow-inner">
                       <div 
                        className="h-full bg-gradient-to-r from-[#2563EB] to-[#22C55E] shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min(100, (state.monthlyPrintingHours / 720) * 100)}%` }}
                       ></div>
                    </div>
                    <p className="text-[10px] text-slate-600 italic leading-none">Cálculo basado en ciclo industrial 24/7 (720h/mes).</p>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#22C55E]/5 border border-[#22C55E]/10 rounded-3xl p-8 flex items-start gap-5 shadow-2xl">
            <div className="text-[#22C55E] p-3 bg-[#22C55E]/10 rounded-2xl shadow-lg shadow-green-500/10">
              <Scale size={24} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                <span className="text-white font-black uppercase block mb-2 tracking-widest">Nota Profesional:</span>
                Esta herramienta utiliza <span className="text-white font-bold italic">Costeo por Absorción</span>. 
                Los gastos fijos se distribuyen proporcionalmente. Escalar tu producción baja el costo unitario de cada gramo extruido.
              </p>
            </div>
          </div>
        </div>

      </main>

      <footer className="max-w-6xl mx-auto px-4 mt-32 text-center border-t border-white/5 pt-16">
        <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-700 mb-3 leading-none italic">3D PRODUCTION SUITE | COLOMBIA EDITION</p>
        <p className="text-[10px] text-slate-800 font-bold italic max-w-xl mx-auto leading-relaxed">
          Diseñado para optimización financiera en manufactura aditiva profesional.<br/>
          Listo para desplegar en GitHub Pages.
        </p>
      </footer>
    </div>
  );
};

export default App;