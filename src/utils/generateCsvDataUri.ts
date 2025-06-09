export function generateCsvDataUri(csvString: string) {
  return `data:text/csv;charset=utf-8,${encodeURIComponent(csvString)}`;
}
