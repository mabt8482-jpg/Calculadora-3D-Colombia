
import { AppState, CalculationResults, TimePeriod } from '../types';

const normalizeToMonthly = (value: number, frequency: TimePeriod): number => {
  switch (frequency) {
    case 'day': return value * 30;
    case 'year': return value / 12;
    default: return value;
  }
};

export const calculateEverything = (state: AppState): CalculationResults => {
  const { fixedCosts, variableCosts, laborCosts, profitSettings, monthlyPrintingHours } = state;

  // Normalización de gastos fijos según su frecuencia
  const monthlyRent = normalizeToMonthly(fixedCosts.rent, fixedCosts.rentFrequency);
  const monthlyInternet = normalizeToMonthly(fixedCosts.internet, fixedCosts.internetFrequency || 'month');
  const monthlyMaintenance = normalizeToMonthly(fixedCosts.maintenance, fixedCosts.maintenanceFrequency || 'month');

  const totalMonthlyFixed = 
    monthlyRent + 
    fixedCosts.electricityBase + 
    monthlyInternet + 
    fixedCosts.subscriptions + 
    monthlyMaintenance + 
    fixedCosts.depreciation + 
    fixedCosts.other;
  
  const hourlyFixedCost = totalMonthlyFixed / (monthlyPrintingHours || 1);

  // Costos variables por pieza
  const filamentCost = (variableCosts.filamentPricePerKg / 1000) * variableCosts.partWeight;
  const electricityKwh = (variableCosts.printerWatts * variableCosts.printTime) / 1000;
  const electricityCost = electricityKwh * variableCosts.electricityKwhPrice;
  
  // Mano de obra
  const totalLaborTime = laborCosts.prepTime + laborCosts.postProcessTime;
  const laborCost = totalLaborTime * laborCosts.hourlyRate;

  // Costos fijos aplicados al tiempo de impresión
  const overheadFixed = hourlyFixedCost * variableCosts.printTime;
  
  // Subtotal antes de margen de error
  const subtotal = filamentCost + electricityCost + laborCost + overheadFixed + variableCosts.otherMaterials;

  // Aplicación del Margen de Seguridad Técnica (Fallas)
  const totalPieceCost = subtotal * (1 + variableCosts.failureRate / 100);

  // Precio final según rentabilidad deseada
  const suggestedPrice = totalPieceCost * (1 + profitSettings.desiredMargin / 100);
  const totalProfit = suggestedPrice - totalPieceCost;

  return {
    hourlyFixedCost,
    filamentCost,
    electricityCost,
    laborCost,
    totalPieceCost,
    suggestedPrice,
    totalProfit,
    breakdown: {
      fixed: overheadFixed,
      filament: filamentCost,
      electricity: electricityCost,
      labor: laborCost,
      materials: variableCosts.otherMaterials
    }
  };
};

export const formatCurrency = (amount: number, currency: 'COP' | 'USD', exchangeRate: number) => {
  const value = currency === 'USD' ? amount / exchangeRate : amount;
  
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'COP' ? 0 : 2,
    maximumFractionDigits: currency === 'COP' ? 0 : 2,
  }).format(value);

  if (currency === 'USD') {
    return formatted.replace('$', '$ ') + ' USD';
  }
  return formatted;
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatInputNumber = (num: number) => {
  if (num === 0) return '';
  return formatNumber(num);
};
