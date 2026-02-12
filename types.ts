
export type TimePeriod = 'day' | 'month' | 'year';

export interface FixedCosts {
  rent: number;
  rentFrequency: TimePeriod;
  electricityBase: number;
  internet: number;
  internetFrequency: TimePeriod;
  subscriptions: number;
  maintenance: number;
  maintenanceFrequency: TimePeriod;
  depreciation: number; 
  other: number;
}

export interface VariableCosts {
  filamentPricePerKg: number;
  partWeight: number; // grams
  printTime: number; // decimal hours
  printerWatts: number;
  electricityKwhPrice: number;
  failureRate: number; // percentage
  otherMaterials: number;
}

export interface LaborCosts {
  prepTime: number; // hours
  postProcessTime: number; // hours
  hourlyRate: number;
}

export interface ProfitSettings {
  desiredMargin: number; // percentage
}

export interface AppState {
  fixedCosts: FixedCosts;
  variableCosts: VariableCosts;
  laborCosts: LaborCosts;
  profitSettings: ProfitSettings;
  monthlyPrintingHours: number;
  exchangeRate: number; // COP to USD
  currency: 'COP' | 'USD';
}

export interface CalculationResults {
  hourlyFixedCost: number;
  filamentCost: number;
  electricityCost: number;
  laborCost: number;
  totalPieceCost: number;
  suggestedPrice: number;
  totalProfit: number;
  breakdown: {
    fixed: number;
    filament: number;
    electricity: number;
    labor: number;
    materials: number;
  };
}
