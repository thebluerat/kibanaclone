export const parseCSV = (csvData) => {
    const rows = csvData.split('\n');
    const headers = rows[0].split(',');
    const data = rows.slice(1).map((row) => {
        const values = row.split(',');
        const result = {};
        headers.forEach((header, index) => {
            result[header] = values[index];
        });
        return result;
    });
    return data;
}