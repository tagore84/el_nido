const fs = require('fs');

function parseCsv(text) {
    const lines = text.trim().split(/\r?\n/);
    console.log(`Lines length: ${lines.length}`);
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map(h => h.trim());
    console.log('Headers:', headers);

    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        console.log(`Line ${i}:`, line);
        if (!line.trim()) continue;

        // Naive split, looking for issues
        const cols = line.split(",").map(c => c.trim());
        console.log(`Cols ${i}:`, cols);

        const obj = {};
        headers.forEach((h, idx) => obj[h] = cols[idx] ?? "");
        rows.push(obj);
    }
    return rows;
}

try {
    const buffer = fs.readFileSync('/Users/alberto/src/nido/temp/meals.csv');
    // Simulate base64 roundtrip as in workflow, though readFileSync returns buffer anyway
    const base64 = buffer.toString('base64');
    const csvText = Buffer.from(base64, 'base64').toString('utf8');

    console.log('--- CSV Content ---');
    console.log(csvText);
    console.log('-------------------');

    const items = parseCsv(csvText);
    console.log('Items found:', items.length);
    console.log(JSON.stringify(items, null, 2));

} catch (e) {
    console.error(e);
}
