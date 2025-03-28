document.getElementById('mainScreenButton').addEventListener('click', function() {
    document.getElementById('homeContent').classList.add('active');
    document.getElementById('addDocumentContent').classList.remove('active');
    document.getElementById('addPaymentContent').classList.remove('active');
    document.getElementById('pierwsze-pozycje').style.display = 'block'; // Pokaż główną tabelę
    document.getElementById('wyniki-wyszukiwania').style.display = 'none'; // Ukryj tabelę wyników wyszukiwania
    pobierzPierwszePozycje(); // Pobierz pierwsze pozycje przy przejściu na ekran główny

    // Resetuj wszystkie kryteria wyszukiwania
    document.getElementById('search-form').reset();

    // Ręcznie resetuj pola typu date
    document.getElementById('search-data-zawarcia-od').value = '';
    document.getElementById('search-data-zawarcia-do').value = '';
    document.getElementById('search-ochrona-od').value = '';
    document.getElementById('search-ochrona-do').value = '';
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

// Pobierz pierwsze pozycje przy załadowaniu strony
document.addEventListener('DOMContentLoaded', pobierzPierwszePozycje);

// Funkcja do pobierania wyników wyszukiwania
let currentOffset = 0;
const limit = 10;

async function pobierzWynikiWyszukiwania(queryParams, append = false) {
    queryParams.limit = limit;
    queryParams.offset = currentOffset;
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`http://127.0.0.1:8000/wyszukaj?${queryString}`);
    const data = await response.json();

    console.log("Pobrane dane:", data); // Dodaj logowanie

    const listaWynikow = document.querySelector('#lista-wynikow tbody');
    if (!listaWynikow) {
        console.error("Element #lista-wynikow tbody nie został znaleziony.");
        return;
    }
    if (!append) {
        listaWynikow.innerHTML = '';
    }

    data.forEach(pozycja => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pozycja.numer_ubezpieczenia}</td>
            <td>${pozycja.ubezpieczajacy}</td>
            <td>${pozycja.przedmiot_ubezpieczenia}</td>
            <td>${pozycja.data_zawarcia}</td>
            <td>${pozycja.ochrona_do}</td>
        `;
        listaWynikow.appendChild(tr);
    });

   // Ukryj główną tabelę i pokaż tabelę wyników wyszukiwania
   document.getElementById('pierwsze-pozycje').style.display = 'none';
   document.getElementById('wyniki-wyszukiwania').style.display = 'block';

   // Pokaż przyciski "Pokaż więcej" i "Wygeneruj zestawienie" jeśli jest więcej wyników
   if (data.length === limit) {
       document.getElementById('show-more-button').style.display = 'inline-block';
       document.getElementById('generate-report-button').style.display = 'inline-block';
   } else {
       document.getElementById('show-more-button').style.display = 'none';
       document.getElementById('generate-report-button').style.display = 'inline-block';
   }
}


async function pobierzPierwszePozycje() {
    const response = await fetch('http://127.0.0.1:8000/pierwsze_pozycje/');
    const data = await response.json();

    const listaPierwszychPozycji = document.querySelector('#lista-pierwszych-pozycji tbody');
    if (!listaPierwszychPozycji) {
        console.error("Element #lista-pierwszych-pozycji tbody nie został znaleziony.");
        return;
    }

    listaPierwszychPozycji.innerHTML = '';

    data.forEach(pozycja => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pozycja.numer_ubezpieczenia}</td>
            <td>${pozycja.ubezpieczajacy}</td>
            <td>${pozycja.przedmiot_ubezpieczenia}</td>
            <td>${pozycja.data_zawarcia}</td>
            <td>${pozycja.ochrona_do}</td>
        `;
        listaPierwszychPozycji.appendChild(tr);
    });
}

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

    const numerPolisy = document.getElementById('search-numer-polisy').value;
    if (numerPolisy) {
        queryParams.numer_polisy = numerPolisy;
    }

    const dataZawarciaOd = document.getElementById('search-data-zawarcia-od').value;
    if (dataZawarciaOd) {
        queryParams.data_zawarcia_od = dataZawarciaOd;
    }

    const dataZawarciaDo = document.getElementById('search-data-zawarcia-do').value;
    if (dataZawarciaDo) {
        queryParams.data_zawarcia_do = dataZawarciaDo;
    }

    const ochronaOd = document.getElementById('search-ochrona-od').value;
    if (ochronaOd) {
        queryParams.ochrona_od = ochronaOd;
    }

    const ochronaDo = document.getElementById('search-ochrona-do').value;
    if (ochronaDo) {
        queryParams.ochrona_do = ochronaDo;
    }

    const zakonczenieOd = document.getElementById('search-zakonczenie-od').value;
    if (zakonczenieOd) {
        queryParams.zakonczenie_od = zakonczenieOd;
    }

    const zakonczenieDo = document.getElementById('search-zakonczenie-do').value;
    if (zakonczenieDo) {
        queryParams.zakonczenie_do = zakonczenieDo;
    }

    // Sprawdź, czy jakiekolwiek kryteria wyszukiwania zostały uzupełnione
    if (Object.keys(queryParams).length === 0) {
        // Jeśli nie, wyświetl ekran główny
        document.getElementById('pierwsze-pozycje').style.display = 'block';
        document.getElementById('wyniki-wyszukiwania').style.display = 'none';
        return;
    }

    currentOffset = 0;
    await pobierzWynikiWyszukiwania(queryParams);
});

// Obsługa przycisku "Pokaż więcej"
document.getElementById('show-more-button').addEventListener('click', async () => {
    currentOffset += limit;
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

    const numerPolisy = document.getElementById('search-numer-polisy').value;
    if (numerPolisy) {
        queryParams.numer_polisy = numerPolisy;
    }

    const dataZawarciaOd = document.getElementById('search-data-zawarcia-od').value;
    if (dataZawarciaOd) {
        queryParams.data_zawarcia_od = dataZawarciaOd;
    }

    const dataZawarciaDo = document.getElementById('search-data-zawarcia-do').value;
    if (dataZawarciaDo) {
        queryParams.data_zawarcia_do = dataZawarciaDo;
    }

    const ochronaOd = document.getElementById('search-ochrona-od').value;
    if (ochronaOd) {
        queryParams.ochrona_od = ochronaOd;
    }

    const ochronaDo = document.getElementById('search-ochrona-do').value;
    if (ochronaDo) {
        queryParams.ochrona_do = ochronaDo;
    }

    const zakonczenieOd = document.getElementById('search-zakonczenie-od').value;
    if (zakonczenieOd) {
        queryParams.zakonczenie_od = zakonczenieOd;
    }

    const zakonczenieDo = document.getElementById('search-zakonczenie-do').value;
    if (zakonczenieDo) {
        queryParams.zakonczenie_do = zakonczenieDo;
    }

    await pobierzWynikiWyszukiwania(queryParams, true);
});

document.getElementById('generate-report-button').addEventListener('click', async () => {
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

    const numerPolisy = document.getElementById('search-numer-polisy').value;
    if (numerPolisy) {
        queryParams.numer_polisy = numerPolisy;
    }

    const dataZawarciaOd = document.getElementById('search-data-zawarcia-od').value;
    if (dataZawarciaOd) {
        queryParams.data_zawarcia_od = dataZawarciaOd;
    }

    const dataZawarciaDo = document.getElementById('search-data-zawarcia-do').value;
    if (dataZawarciaDo) {
        queryParams.data_zawarcia_do = dataZawarciaDo;
    }

    const ochronaOd = document.getElementById('search-ochrona-od').value;
    if (ochronaOd) {
        queryParams.ochrona_od = ochronaOd;
    }

    const ochronaDo = document.getElementById('search-ochrona-do').value;
    if (ochronaDo) {
        queryParams.ochrona_do = ochronaDo;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`http://127.0.0.1:8000/generuj_zestawienie?${queryString}`, {
        method: 'POST'
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message);
    } else {
        alert('Błąd podczas generowania zestawienia.');
    }
});


document.getElementById('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Zapobiegamy domyślnej akcji formularza

    console.log('Obsługiwany formularz: payment-form');

    const inputElement = document.getElementById('search-numer-polisy-payment');
    console.log('Input Element:', inputElement); // Sprawdź, czy element został znaleziony

    const numerPolisy = inputElement ? inputElement.value.trim() : '';
    console.log('Numer Polisy:', numerPolisy); // Sprawdź wartość pola tekstowego

    if (!numerPolisy) {
        alert('Proszę wpisać numer polisy.');
        return;
    }

    const queryParams = { numer_polisy: numerPolisy };
    const queryString = new URLSearchParams(queryParams).toString();
    console.log('Query String:', queryString); // Dodaj logowanie

    const response = await fetch(`http://127.0.0.1:8000/wyszukaj?${queryString}`);
    const data = await response.json();
    console.log('Response Data:', data); // Dodaj logowanie

    const paymentResponseDiv = document.getElementById('paymentResponse');
    if (response.ok) {
        paymentResponseDiv.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Numer Polisy</th>
                        <th>Ubezpieczający</th>
                        <th>Przedmiot Ubezpieczenia</th>
                        <th>Data Zawarcia</th>
                        <th>Data Zakończenia</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(pozycja => `
                        <tr>
                            <td>${pozycja.numer_ubezpieczenia}</td>
                            <td>${pozycja.ubezpieczajacy}</td>
                            <td>${pozycja.przedmiot_ubezpieczenia}</td>
                            <td>${pozycja.data_zawarcia}</td>
                            <td>${pozycja.ochrona_do}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        paymentResponseDiv.innerHTML = `<p>Błąd: ${data.detail}</p>`;
    }
});