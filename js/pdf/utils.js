const pdfUtils = {
    async readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    },

    parseRange(rangeStr, maxPages) {
        const pages = new Set();
        if (!rangeStr.trim()) return null; // All pages
        
        const parts = rangeStr.split(',');
        parts.forEach(part => {
            const bounds = part.trim().split('-');
            if (bounds.length === 2) {
                let start = parseInt(bounds[0]);
                let end = parseInt(bounds[1]);
                if (start > end) [start, end] = [end, start];
                for (let i = start; i <= end; i++) pages.add(i);
            } else {
                pages.add(parseInt(bounds[0]));
            }
        });
        
        // Filter valid and 1-based index conversion to 0-based
        return Array.from(pages)
            .filter(p => !isNaN(p) && p >= 1 && p <= maxPages)
            .map(p => p - 1)
            .sort((a,b) => a-b);
    }
};
