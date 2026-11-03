export function formatCurrency(amount, currency = 'USD') {
  const rates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 154
  };
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
  };

  const rate = rates[currency] || 1;
  const sym = symbols[currency] || '$';
  const converted = amount * rate;

  if (currency === 'JPY') {
    return `${sym}${Math.round(converted).toLocaleString()}`;
  }
  return `${sym}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatWeight(kg, unit = 'metric') {
  if (unit === 'imperial') {
    const lbs = (kg * 2.20462).toFixed(1);
    return `${lbs} lbs`;
  }
  return `${kg.toFixed(2)} kg`;
}
