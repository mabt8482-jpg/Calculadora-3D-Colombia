
import { AppState } from './types';

export const INITIAL_STATE: AppState = {
  fixedCosts: {
    rent: 0,
    rentFrequency: 'month',
    electricityBase: 0,
    internet: 45000,
    internetFrequency: 'month',
    subscriptions: 15000,
    maintenance: 25000,
    maintenanceFrequency: 'month',
    depreciation: 60000,
    other: 0,
  },
  variableCosts: {
    filamentPricePerKg: 105000,
    partWeight: 50,
    printTime: 4,
    printerWatts: 120,
    electricityKwhPrice: 850,
    failureRate: 10,
    otherMaterials: 2000,
  },
  laborCosts: {
    prepTime: 0.25,
    postProcessTime: 0.5,
    hourlyRate: 15000,
  },
  profitSettings: {
    desiredMargin: 40,
  },
  monthlyPrintingHours: 240,
  exchangeRate: 4100,
  currency: 'COP',
};
