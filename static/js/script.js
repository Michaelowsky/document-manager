document.getElementById('homeButton').addEventListener('click', function() {
    document.getElementById('homeContent').classList.add('active');
    document.getElementById('addDocumentContent').classList.remove('active');
    document.getElementById('addPaymentContent').classList.remove('active');
});

document.getElementById('addDocumentButton').addEventListener('click', function() {
    document.getElementById('homeContent').classList.remove('active');
    document.getElementById('addDocumentContent').classList.add('active');
    document.getElementById('addPaymentContent').classList.remove('active');
});

document.getElementById('addPaymentButton').addEventListener('click', function() {
    document.getElementById('homeContent').classList.remove('active');
    document.getElementById('addDocumentContent').classList.remove('active');
    document.getElementById('addPaymentContent').classList.add('active');
});

// Obsługa formularza
document.getElementById('document-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Zapobiegamy domyślnej akcji formularza

    const polisa = {
        rodzaj: document.getElementById('rodzaj').value,
        typ: document.getElementById('typ').value,
        numer_ubezpieczenia: document.getElementById('numer_ubezpieczenia').value,
        ubezpieczajacy: document.getElementById('ubezpieczajacy').value,
        data_zawarcia: document.getElementById('data_zawarcia').value,
        towarzystwo: document.getElementById('towarzystwo').value,
        przedmiot_ubezpieczenia: document.getElementById('przedmiot_ubezpieczenia').value,
        ochrona_od: document.getElementById('ochrona_od').value,
        ochrona_do: document.getElementById('ochrona_do').value,
        skladka: parseFloat(document.getElementById('skladka').value.replace(',', '.')),  // Zmieniono na parseFloat i zamiana przecinka na kropkę
        opiekun: document.getElementById('opiekun').value,
    };

    console.log(polisa); // Dodaj logowanie, aby sprawdzić dane

    const response = await fetch('http://127.0.0.1:8000/dodaj_polise/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(polisa),
    });

    const data = await response.json();
    
    const responseDiv = document.getElementById('response');
    if (response.ok) {
        responseDiv.innerHTML = `<p>Polisa dodana: ${data.ubezpieczajacy}, ${data.data_zawarcia} - ${data.ochrona_do}</p>`;
    } else {
        responseDiv.innerHTML = `<p>Błąd: ${data.detail}</p>`;
    }
});