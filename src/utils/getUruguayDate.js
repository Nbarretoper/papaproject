export function getUruguayDate() {
  const uruguayTimeZone = 'America/Montevideo';
  const date = new Date();
  const uruguayDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: uruguayTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
  return uruguayDate;
}