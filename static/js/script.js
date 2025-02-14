document.getElementById('homeButton').addEventListener('click', function() {
    document.getElementById('homeContent').classList.add('active');
    document.getElementById('addDocumentContent').classList.remove('active');
});

document.getElementById('addDocumentButton').addEventListener('click', function() {
    document.getElementById('homeContent').classList.remove('active');
    document.getElementById('addDocumentContent').classList.add('active');
});

// Obsługa formularza
document.getElementById('document-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Zapobiegamy domyślnej akcji formularza

    const polisa = {
        rodzaj_polisy: document.getElementById('rodzaj_polisy').value,
        imie: document.getElementById('imie').value,
        nazwisko: document.getElementById('nazwisko').value,
        data_zawarcia: document.getElementById('data_zawarcia').value,
        data_zakonczenia: document.getElementById('data_zakonczenia').value,
    };

    const response = await fetch('http://127.0.0.1:8000/dodaj_polise/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(polisa),
    });

    const data = await response.json();
    
    const responseDiv = document.getElementById('response');
    if (response.ok) {
        responseDiv.innerHTML = `<p>Polisa dodana: ${data.imie} ${data.nazwisko}, ${data.data_zawarcia} - ${data.data_zakonczenia}</p>`;
    } else {
        responseDiv.innerHTML = `<p>Błąd: ${data.detail}</p>`;
    }
});