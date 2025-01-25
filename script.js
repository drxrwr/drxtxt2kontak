document.getElementById('processFilesBtn').addEventListener('click', function () {
    const files = document.getElementById('file-input').files;
    const contactName1 = document.getElementById('contactName1Input').value.trim();
    const contactName2 = document.getElementById('contactName2Input').value.trim();

    if (!contactName1 || !contactName2) {
        alert('Harap mengisi nama kontak 1 dan kontak 2.');
        return;
    }

    const fileAreas = document.getElementById('file-areas');
    fileAreas.innerHTML = ''; // Kosongkan area sebelumnya

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const lines = e.target.result.split('\n').map(line => line.trim()).filter(Boolean);
            if (lines.length === 0) return;

            const originalFileName = file.name.replace(/\.[^/.]+$/, ''); // Nama file asli tanpa ekstensi
            const firstNumber = lines[0].replace(/^[^0-9+]+/, ''); // Nomor pertama
            const otherNumbers = lines.slice(1);

            const container = document.createElement('div');
            container.classList.add('file-container');

            // Tampilkan petunjuk nama file TXT asli
            const fileLabel = document.createElement('p');
            fileLabel.textContent = `Nama File TXT Asli: ${file.name}`;
            fileLabel.style.fontWeight = 'bold';
            container.appendChild(fileLabel);

            // Input untuk nama file
            const fileNameInput = document.createElement('input');
            fileNameInput.type = 'text';
            fileNameInput.value = `${originalFileName}`;
            fileNameInput.placeholder = 'Nama file untuk VCF';
            container.appendChild(fileNameInput);

            // Tombol download untuk kontak pertama
            const adminDownloadBtn = document.createElement('button');
            adminDownloadBtn.textContent = 'Download Kontak Pertama';
            adminDownloadBtn.addEventListener('click', () => {
                const adminFileName = `ADMIN_${fileNameInput.value.trim() || originalFileName}`;
                const adminVcfContent = `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName1}\nTEL:${formatPhoneNumber(firstNumber)}\nEND:VCARD\n`;
                downloadFile(adminVcfContent, `${adminFileName}.vcf`);
            });
            container.appendChild(adminDownloadBtn);

            // Tombol download untuk kontak kedua dan seterusnya
            if (otherNumbers.length > 0) {
                const otherDownloadBtn = document.createElement('button');
                otherDownloadBtn.textContent = 'Download Kontak Kedua+';
                otherDownloadBtn.addEventListener('click', () => {
                    const otherFileName = fileNameInput.value.trim() || originalFileName;
                    let vcfContent = '';
                    otherNumbers.forEach((number, index) => {
                        vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName2} ${index + 1}\nTEL:${formatPhoneNumber(number)}\nEND:VCARD\n`;
                    });
                    downloadFile(vcfContent, `${otherFileName}.vcf`);
                });
                container.appendChild(otherDownloadBtn);
            }

            fileAreas.appendChild(container);
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
