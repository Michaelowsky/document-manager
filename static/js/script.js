document.getElementById('homeButton').addEventListener('click', function() {
    document.getElementById('homeContent').classList.add('active');
    document.getElementById('addDocumentContent').classList.remove('active');
    document.getElementById('addPaymentContent').classList.remove('active');
    document.getElementById('pierwsze-pozycje').style.display = 'block'; // Pokaż główną tabelę
    document.getElementById('wyniki-wyszukiwania').style.display = 'none'; // Ukryj tabelę wyników wyszukiwania
    pobierzPierwszePozycje(); // Pobierz pierwsze pozycje przy przejściu na ekran główny
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

// Obsługa dynamicznego wyświetlania pól NIP i REGON oraz ubezpieczającego
document.getElementById('osoba_prywatna').addEventListener('change', function() {
    document.getElementById('nip_regon_group').style.display = 'none';
    document.getElementById('ubezpieczajacy_group').style.display = 'block';
    document.getElementById('ubezpieczony_group').style.display = 'block';
});

document.getElementById('firma').addEventListener('change', function() {
    document.getElementById('nip_regon_group').style.display = 'flex';
    document.getElementById('ubezpieczajacy_group').style.display = 'block';
    document.getElementById('ubezpieczony_group').style.display = 'block';
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

    // Jeśli użytkownik zaznaczył "Firma", zapisz dane do tabeli "Firmy"
    if (document.getElementById('firma').checked) {
        const firma = {
            nip: document.getElementById('nip').value,
            regon: document.getElementById('regon').value,
            ubezpieczajacy: document.getElementById('ubezpieczajacy').value,
        };

        const firmaResponse = await fetch('http://127.0.0.1:8000/dodaj_firme/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(firma),
        });

        const firmaData = await firmaResponse.json();
        if (firmaResponse.ok) {
            console.log(`Firma dodana: ${firmaData.ubezpieczajacy}`);
        } else {
            console.log(`Błąd: ${firmaData.detail}`);
        }
    }

    // Zapisz dane do tabeli "Ubezpieczeni"
    const ubezpieczony = {
        numer_polisy: document.getElementById('numer_ubezpieczenia').value,
        ubezpieczony: document.getElementById('ubezpieczony').value,
    };

    const ubezpieczonyResponse = await fetch('http://127.0.0.1:8000/dodaj_ubezpieczonego/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ubezpieczony),
    });

    const ubezpieczonyData = await ubezpieczonyResponse.json();
    if (ubezpieczonyResponse.ok) {
        console.log(`Ubezpieczony dodany: ${ubezpieczonyData.ubezpieczony}`);
    } else {
        console.log(`Błąd: ${ubezpieczonyData.detail}`);
    }
});

// Funkcja do pobierania 10 pierwszych pozycji z tabeli archiwum
async function pobierzPierwszePozycje() {
    const response = await fetch('http://127.0.0.1:8000/pierwsze_pozycje/');
    const data = await response.json();

    const listaPierwszychPozycji = document.querySelector('#lista-pierwszych-pozycji tbody');
    listaPierwszychPozycji.innerHTML = '';

    data.forEach(pozycja => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pozycja.numer_ubezpieczenia}</td>
            <td>${pozycja.ubezpieczajacy}</td>
            <td>${pozycja.przedmiot_ubezpieczenia}</td>
            <td>${pozycja.data_zawarcia}</td>
            <td>${pozycja.ochrona_do}</td> <!-- Dodaj tę linię -->
        `;
        listaPierwszychPozycji.appendChild(tr);
    });
}

// Pobierz pierwsze pozycje przy załadowaniu strony
document.addEventListener('DOMContentLoaded', pobierzPierwszePozycje);

// Funkcja do pobierania wyników wyszukiwania
async function pobierzWynikiWyszukiwania(queryParams) {
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`http://127.0.0.1:8000/wyszukaj?${queryString}`);
    const data = await response.json();

    const listaWynikow = document.querySelector('#lista-wynikow tbody');
    if (!listaWynikow) {
        console.error("Element #lista-wynikow tbody nie został znaleziony.");
        return;
    }
    listaWynikow.innerHTML = '';

    data.forEach(pozycja => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pozycja.numer_ubezpieczenia}</td>
            <td>${pozycja.ubezpieczajacy}</td>
            <td>${pozycja.przedmiot_ubezpieczenia}</td>
            <td>${pozycja.data_zawarcia}</td>
            <td>${pozycja.ochrona_do}</td> <!-- Dodaj tę linię -->
        `;
        listaWynikow.appendChild(tr);
    });

    // Ukryj główną tabelę i pokaż tabelę wyników wyszukiwania
    document.getElementById('pierwsze-pozycje').style.display = 'none';
    document.getElementById('wyniki-wyszukiwania').style.display = 'block';
}

// Obsługa formularza wyszukiwania
document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Zapobiegamy domyślnej akcji formularza

    const queryParams = {};

    const ubezpieczajacy = document.getElementById('search-ubezpieczajacy').value;
    if (ubezpieczajacy) {
        queryParams.ubezpieczajacy = ubezpieczajacy;
    }

    const ubezpieczony = document.getElementById('search-ubezpieczony').value;
    if (ubezpieczony) {
        queryParams.ubezpieczony = ubezpieczony;
    }

    const nip = document.getElementById('search-nip').value;
    if (nip) {
        queryParams.nip = nip;
    }

    const regon = document.getElementById('search-regon').value;
    if (regon) {
        queryParams.regon = regon;
    }

    const przedmiot = document.getElementById('search-przedmiot').value;
    if (przedmiot) {
        queryParams.przedmiot = przedmiot;
    }

    if (Object.keys(queryParams).length > 0) {
        await pobierzWynikiWyszukiwania(queryParams);
    } else {
        alert('Proszę uzupełnić przynajmniej jedno pole wyszukiwania.');
        // Pokaż główną tabelę i ukryj tabelę wyników wyszukiwania
        document.getElementById('pierwsze-pozycje').style.display = 'block';
        document.getElementById('wyniki-wyszukiwania').style.display = 'none';
    }
});