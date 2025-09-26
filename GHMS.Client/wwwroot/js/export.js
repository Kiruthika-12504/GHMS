window.saveAsFile = (filename, bytesBase64) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = "data:application/octet-stream;base64," + bytesBase64;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.exportToExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
};

window.exportToPDF = (data, filename) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    data.forEach(row => {
        doc.text(Object.values(row).join(" | "), 10, y);
        y += 10;
    });
    doc.save(filename);
};