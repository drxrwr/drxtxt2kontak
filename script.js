document.getElementById('processFilesBtn').addEventListener('click', function() {
    const files = document.getElementById('file-input').files;
    const contactName1 = document.getElementById('contactName1Input').value.trim();
    const contactName2 = document.getElementById('contactName2Input').value.trim();
    const fileNameSuffix = document.getElementById('fileNameInput').value.trim();

    if (!contactName1 || !contactName2 || !fileNameSuffix) {
        alert('Harap mengisi semua input (Nama File Hasil, Kontak 1, dan Kontak 2).');
        return;
    }

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const lines = e.target.result.split('\n').map(line => line.trim()).filter(Boolean);
            if (lines.length === 0) return;

            const originalFileName = file.name.replace(/\.[^/.]+$/, ''); // Nama file asli tanpa ekstensi
            const firstNumber = lines[0].replace(/^[^0-9+]+/, ''); // Nomor pertama, abaikan teks awal
            const otherNumbers = lines.slice(1);

            // File VCF untuk kontak pertama
            const adminFileName = `ADMIN_${originalFileName}.vcf`;
            const adminVcfContent = `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName1}\nTEL:${formatPhoneNumber(firstNumber)}\nEND:VCARD\n`;
            downloadFile(adminVcfContent, adminFileName);

            // File VCF untuk kontak kedua dan seterusnya
            if (otherNumbers.length > 0) {
                let vcfContent = '';
                otherNumbers.forEach((number, index) => {
                    vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName2} ${index + 1}\nTEL:${formatPhoneNumber(number)}\nEND:VCARD\n`;
                });
                const otherFileName = `${originalFileName}_${fileNameSuffix}.vcf`;
                downloadFile(vcfContent, otherFileName);
            }
        };
        reader.readAsText(file);
    });
});

function formatPhoneNumber(number) {
    if (!number.startsWith('+')) {
        return `+${number}`;
    }
    return number;
}

function downloadFile(content, fileName) {
    const blob = new Blob([content], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}
