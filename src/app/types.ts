export type InvestmentYear = {
  year: number;
  yearEndMoney: number;
  yearEndMoneyValueToday: number;
  startingMoney: number;
  intraYearGrowth: number;
  totalInflation: number;
  totalGrowth: number;
  savingsMonthly: number;
  totalInvested: number;
  totalInvestedValueToday: number;
  totalEarnings: number;
  totalEarningsValueToday: number;
};

export type Trading212CashResponse = {
  free: number;
  total: number;
  ppl: number;
  result: number;
  invested: number;
  pieCash: number;
  blocked: unknown;
};
