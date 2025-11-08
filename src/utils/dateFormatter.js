export function formatDate(dateStr) {
    const date = new Date(dateStr);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based
    const year = date.getFullYear();
  
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const hour12 = String(hours % 12 || 12).padStart(2, '0');
  
    return `${day}-${month}-${year} ${hour12}:${minutes} ${ampm}`;
  }
  
  export function formatCurrencyValue(value) {
    if (value >= 10000000) {
      return (value / 10000000).toFixed(1) + "Cr";
    } else if (value >= 100000) {
      return (value / 100000).toFixed(1) + "L";
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + "K";
    }
    return value;
  }