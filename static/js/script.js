document.getElementById('document-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Zapobiegamy domyślnej akcji formularza

    // Pobieramy wartości z formularza
    const imie = document.getElementById('imie').value;
    const nazwisko = document.getElementById('nazwisko').value;
    const data_zawarcia = document.getElementById('data_zawarcia').value;
    const data_zakonczenia = document.getElementById('data_zakonczenia').value;

    const dokument = {
        imie: imie,
        nazwisko: nazwisko,
        data_zawarcia: data_zawarcia,
        data_zakonczenia: data_zakonczenia,
    };

    // Wysyłamy dane do backendu
    const response = await fetch('http://127.0.0.1:8000/dodaj_dokument/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dokument),
    });

    const data = await response.json();
    
    // Wyświetlamy odpowiedź
    const responseDiv = document.getElementById('response');
    if (response.ok) {
        responseDiv.innerHTML = `<p>Dokument dodany: ${data.imie} ${data.nazwisko}, ${data.data_zawarcia} - ${data.data_zakonczenia}</p>`;
    } else {
        responseDiv.innerHTML = `<p>Błąd: ${data.detail}</p>`;
    }
});