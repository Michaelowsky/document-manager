///////////////////
// EKRAN GŁÓWNY //
//////////////////

document.getElementById('mainScreenButton').addEventListener('click', function() {
    console.log('Kliknięto przycisk Ekran Główny');

    // Ukryj wszystkie sekcje

    document.querySelectorAll('.content').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    // Pokaż ekran główny

    const homeContent = document.getElementById('homeContent');
    homeContent.classList.add('active');
    homeContent.style.display = 'block';

    document.getElementById('homeContent').classList.add('active');
    document.getElementById('addDocumentContent').classList.remove('active');
    document.getElementById('addPaymentContent').classList.remove('active');
    document.getElementById('pierwsze-pozycje').style.display = 'block';
    document.getElementById('wyniki-wyszukiwania').style.display = 'none';
    pobierzPierwszePozycje();

    document.getElementById('search-form').reset();

    document.getElementById('search-data-zawarcia-od').value = '';
    document.getElementById('search-data-zawarcia-do').value = '';
    document.getElementById('search-ochrona-od').value = '';
    document.getElementById('search-ochrona-do').value = '';
});

////////////////////////
// DODANIE DOKUMENTÓW //
////////////////////////

document.getElementById('addDocumentButton').addEventListener('click', function() {

    console.log('Kliknięto przycisk Dodaj dokument');

    // Ukryj wszystkie sekcje

    document.querySelectorAll('.content').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none'; // Ukryj sekcje zawartości
        console.log(`Ukryto sekcję: ${section.id}`);
    });

    // Pokaż sekcję "Dodaj dokument"

    const addDocumentContent = document.getElementById('addDocumentContent');
    addDocumentContent.classList.add('active');
    addDocumentContent.style.display = 'block';
    console.log(`Pokazano sekcję: ${addDocumentContent.id}`);

    document.getElementById('homeContent').classList.remove('active');
    document.getElementById('addDocumentContent').classList.add('active');
    document.getElementById('addPaymentContent').classList.remove('active');

});

////////////////////////
// DODANIE PŁATNOŚCI  //
////////////////////////

document.getElementById("addPaymentButton").addEventListener("click", function () {
    console.log("Kliknięto przycisk Dodanie płatności");

    // Ukryj wszystkie sekcje

    document.querySelectorAll(".content").forEach(section => {
        section.classList.remove("active");
        section.style.display = "none";
    });

    // Pokaż sekcję "Dodanie płatności"

    const addPaymentContent = document.getElementById("addPaymentContent");
    addPaymentContent.classList.add("active");
    addPaymentContent.style.display = "block";

    // Wyczyść pole numeru polisy

    document.getElementById("search-numer-polisy-payment").value = "";
});

/////////////////////////////////////////////////////////////////
// OBSŁUGA POLA FIRMY I OSOBY PRYWATNEJ PRZY DODANIU DOKUMENTU //
/////////////////////////////////////////////////////////////////

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

//////////////////////////////
// OBSŁUGA DODAWANIA POLISY //
//////////////////////////////

document.getElementById('document-form').addEventListener('submit', async (e) => {

    e.preventDefault();

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

    console.log(polisa);

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

/////////////////////////////////////////////////////////
// POBIERANIE PIERWSZYCH POZYCJI PO ZAŁADOWANIU STRONY //
/////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', pobierzPierwszePozycje);

////////////////////////////////////////////////////////
// POBIERANIE WYNIKÓW WYSZUKIWANIA NA EKRANIE GŁÓWNYM //
////////////////////////////////////////////////////////

let currentOffset = 0;
const limit = 10;

async function pobierzWynikiWyszukiwania(queryParams, append = false) {
    queryParams.limit = limit;
    queryParams.offset = currentOffset;
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`http://127.0.0.1:8000/wyszukaj?${queryString}`);
    const data = await response.json();

    console.log("Pobrane dane:", data);

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
    e.preventDefault(); 

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

// Obsługa przycisku "Generuj zestawienie"

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

///////////////////////////////////////////////////////
// SZUKANIE POLISY DO DODANIA/AKTUALIZACJI PŁATNOŚCI //
///////////////////////////////////////////////////////

document.getElementById('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    console.log('Obsługiwany formularz: payment-form');

    const inputElement = document.getElementById('search-numer-polisy-payment');
    console.log('Input Element:', inputElement); 

    const numerPolisy = inputElement ? inputElement.value.trim() : '';
    console.log('Numer Polisy:', numerPolisy); 

    if (!numerPolisy) {
        alert('Proszę wpisać numer polisy.');
        return;
    }

    const queryParams = { numer_polisy: numerPolisy };
    const queryString = new URLSearchParams(queryParams).toString();
    console.log('Query String:', queryString);

    const response = await fetch(`http://127.0.0.1:8000/wyszukaj?${queryString}`);
    const data = await response.json();
    console.log('Response Data:', data);

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
                        <tr class="clickable-row" data-numer-polisy="${pozycja.numer_ubezpieczenia}">
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

        // Dodaj obsługę kliknięcia dla każdego wiersza

        document.querySelectorAll('.clickable-row').forEach(row => {
            row.addEventListener('click', (e) => {
                const numerPolisy = row.getAttribute('data-numer-polisy');
                console.log('Kliknięto wiersz, numer polisy:', numerPolisy); // Logowanie
                przejdzDoPaneluPolisy(numerPolisy);
            });
        });
    } else {
        paymentResponseDiv.innerHTML = `<p>Błąd: ${data.detail}</p>`;
    }
});

///////////////////////////////////////////////////////////
// PRZEJŚCIE DO POLISY PO ZNALEZIENIU JEJ W PŁATNOŚCIACH //
///////////////////////////////////////////////////////////

function przejdzDoPaneluPolisy(numerPolisy) {
    console.log('Przejście do panelu polisy:', numerPolisy);

    document.querySelectorAll('.content').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    const panelPolisy = document.getElementById('panelPolisy');
    panelPolisy.classList.add('active');
    panelPolisy.style.display = 'block';

    const panelPolisyTitle = document.getElementById('panelPolisyTitle');
    panelPolisyTitle.innerText = `Numer Polisy: ${numerPolisy}`;

    // Wywołanie funkcji sprawdzPlatnosci
    console.log('Wywołanie funkcji sprawdzPlatnosci z numerem polisy:', numerPolisy);
    sprawdzPlatnosci(numerPolisy);
}

async function sprawdzPlatnosci(numerPolisy) {
    try {
        console.log(`Sprawdzanie płatności dla numeru polisy: ${numerPolisy}`);

        const encodedNumerPolisy = encodeURIComponent(numerPolisy);
        console.log(`Encoded numer polisy: ${encodedNumerPolisy}`);

        // Pobierz dane o płatnościach
        const response = await fetch(`/platnosci?numer_polisy=${encodedNumerPolisy}`);
        console.log(`Otrzymano odpowiedź z serwera: ${response.status}`);

        if (!response.ok) {
            console.error(`Błąd serwera: ${response.status}`);
            throw new Error(`Błąd serwera: ${response.status}`);
        }

        const data = await response.json();
        console.log("Odpowiedź z backendu (płatności):", data);

        // Pobierz dodatkowe informacje o polisie
        const polisaResponse = await fetch(`/polisy?numer_polisy=${encodedNumerPolisy}`);
        const polisaData = await polisaResponse.json();
        console.log("Dane polisy z backendu:", polisaData);

        // Pobierz dane o ubezpieczonym
        let ubezpieczonyData = null;
        try {
            const ubezpieczonyResponse = await fetch(`/ubezpieczony?numer_polisy=${encodedNumerPolisy}`);
            if (ubezpieczonyResponse.ok) {
                ubezpieczonyData = await ubezpieczonyResponse.json();
                console.log("Dane ubezpieczonego z backendu:", ubezpieczonyData);
            } else {
                console.log("Nie znaleziono danych o ubezpieczonym.");
            }
        } catch (error) {
            console.log("Błąd podczas pobierania danych o ubezpieczonym:", error);
        }

        // Wyświetl tabelkę z informacjami o polisie i ubezpieczonym
        const formContainer = document.getElementById("formContainer");
        formContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Ubezpieczający</th>
                        ${ubezpieczonyData ? '<th>Ubezpieczony</th>' : ''}
                        <th>Przedmiot Ubezpieczenia</th>
                        <th>Data Początku</th>
                        <th>Data Zakończenia</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${polisaData.ubezpieczajacy}</td>
                        ${ubezpieczonyData ? `<td>${ubezpieczonyData.ubezpieczony}</td>` : ''}
                        <td>${polisaData.przedmiot_ubezpieczenia}</td>
                        <td>${polisaData.ochrona_od}</td>
                        <td>${polisaData.ochrona_do}</td>
                    </tr>
                </tbody>
            </table>
        `;

        const tableContainer = document.getElementById("tableContainer");
        const ratContainer = document.getElementById("ratContainer");
        const savePaymentsButton = document.getElementById("savePaymentsButton");

        if (data.exists && data.platnosci.trim() !== "") {
            console.log("Wyświetlam tabelę z istniejącymi ratami.");
            const platnosci = data.platnosci.replace(/\\"/g, '"').split(";").filter(p => p.trim() !== "");
            console.log("Przetworzone płatności:", platnosci);

            let tableHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Data Płatności</th>
                            <th>Składka</th>
                            <th>Data Zapłacenia</th>
                            <th>Kwota Zapłacenia</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            platnosci.forEach((platnosc, index) => {
                const [dataPlatnosci, skladka, dataZaplacenia, kwotaZaplacenia] = platnosc.split(",");
                console.log(`Przetwarzanie płatności ${index}:`, platnosc);
                tableHTML += `
                    <tr>
                        <td>${dataPlatnosci}</td>
                        <td>${skladka}</td>
                        <td>
                            <input type="date" class="dataZaplacenia" data-index="${index}" 
                                value="${dataZaplacenia && dataZaplacenia.trim() ? dataZaplacenia.trim() : ""}" />
                        </td>
                        <td>
                            <input type="number" class="kwotaZaplacenia" data-index="${index}" 
                                value="${kwotaZaplacenia && kwotaZaplacenia.trim() ? kwotaZaplacenia.trim() : ""}" />
                        </td>
                    </tr>
                `;
            });
            tableHTML += `
                    </tbody>
                </table>
                <button onclick="zapiszAktualizacjePlatnosci('${numerPolisy}')">Zapisz zmiany</button>
            `;
            tableContainer.innerHTML = tableHTML;

            // Ukryj ekran dodawania rat
            ratContainer.style.display = "none";
            savePaymentsButton.style.display = "none";
        } else {
            console.log("Wyświetlam ekran dodawania nowych rat.");
            ratContainer.style.display = "block";
            tableContainer.innerHTML = "";
            savePaymentsButton.style.display = "none";
        }
    } catch (error) {
        console.error("Błąd podczas sprawdzania płatności:", error);
        alert("Wystąpił błąd podczas sprawdzania płatności. Spróbuj ponownie później.");
    }
}

function pokazFormularzRat(numerPolisy) {
    const formContainer = document.getElementById("paymentResponse");
    formContainer.innerHTML = `
        <label for="liczbaRat">Podaj liczbę rat:</label>
        <input type="number" id="liczbaRat" min="1" />
        <button onclick="generujTabeleRat('${numerPolisy}')">Generuj tabelę</button>
    `;
}

function generujTabeleRat() {
    const liczbaRat = document.getElementById("liczbaRat").value;
    if (!liczbaRat || liczbaRat <= 0) {
        alert("Podaj poprawną liczbę rat.");
        return;
    }

    const tableContainer = document.getElementById("tableContainer");
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Data składki</th>
                    <th>Kwota</th>
                </tr>
            </thead>
            <tbody>
    `;
    for (let i = 0; i < liczbaRat; i++) {
        tableHTML += `
            <tr>
                <td><input type="date" class="dataPlatnosci" /></td>
                <td><input type="number" class="kwotaPlatnosci" /></td>
            </tr>
        `;
    }
    tableHTML += `
            </tbody>
        </table>
    `;
    tableContainer.innerHTML = tableHTML;

    document.getElementById("savePaymentsButton").style.display = "block";
}

async function zapiszPlatnosci() {
    const dataPlatnosci = document.querySelectorAll(".dataPlatnosci");
    const kwotaPlatnosci = document.querySelectorAll(".kwotaPlatnosci");
    const kurtazProcent = parseFloat(document.getElementById("kurtazProcent").value); // Pobierz wartość kurtażu
    const numerPolisy = document.getElementById("panelPolisyTitle").innerText.split(": ")[1]; // Pobierz numer polisy
    let platnosci = [];

    for (let i = 0; i < dataPlatnosci.length; i++) {
        const data = dataPlatnosci[i].value;
        const kwota = kwotaPlatnosci[i].value;
        if (!data || !kwota) {
            alert("Uzupełnij wszystkie pola w tabeli.");
            return;
        }
        platnosci.push(`${data}, ${kwota}, "",""`);
    }

    const platnosciString = platnosci.join("; ");
    console.log("Zapisane płatności:", platnosciString);

    if (!numerPolisy || typeof numerPolisy !== "string") {
        alert("Numer polisy jest nieprawidłowy.");
        return;
    }

    if (!platnosciString || typeof platnosciString !== "string") {
        alert("Płatności są nieprawidłowe.");
        return;
    }

    if (isNaN(kurtazProcent)) {
        alert("Kurtaż musi być liczbą.");
        return;
    }

    const response = await fetch("/platnosci/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            numer_polisy: numerPolisy,
            platnosci: platnosciString,
            kurtaz: kurtazProcent, // Dodano kurtaż
        }),
    });

    const result = await response.json();

    if (response.ok) {
        alert("Płatności zapisane pomyślnie.");
        przejdzDoEkranuGlownego();
    } else {
        alert(`Wystąpił błąd: ${result.detail}`);
    }
}

//////////////////////////////////
// PRZEJŚCIE DO EKRANU GŁÓWNEGO //
//////////////////////////////////

function przejdzDoEkranuGlownego() {
    console.log("Przejście na ekran główny");

    document.querySelectorAll(".content").forEach(section => {
        section.classList.remove("active");
        section.style.display = "none";
    });

    const homeContent = document.getElementById("homeContent");
    homeContent.classList.add("active");
    homeContent.style.display = "block";

    // Resetuj formularz wyszukiwania
    document.getElementById("search-form").reset();

    pobierzPierwszePozycje();
}


/////////////////////////////////////////////////////
// ZAPISANIE AKTUALIZACJI PŁATNOŚCI W PŁATNOŚCIACH //
/////////////////////////////////////////////////////

async function zapiszAktualizacjePlatnosci(numerPolisy) {
    const dataZaplaceniaInputs = document.querySelectorAll(".dataZaplacenia");
    const kwotaZaplaceniaInputs = document.querySelectorAll(".kwotaZaplacenia");
    const nowePlatnosci = {};

    dataZaplaceniaInputs.forEach(input => {
        const index = input.getAttribute("data-index");
        const dataZaplacenia = input.value;
        const kwotaZaplacenia = kwotaZaplaceniaInputs[index].value;

        nowePlatnosci[index] = {
            dataZaplacenia: dataZaplacenia || "",
            kwotaZaplacenia: kwotaZaplacenia || ""
        };
    });

    console.log("Nowe płatności do zapisania:", nowePlatnosci);

    const response = await fetch(`/platnosci?numer_polisy=${encodeURIComponent(numerPolisy)}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(nowePlatnosci),
    });

    if (response.ok) {
        alert("Płatności zaktualizowane pomyślnie.");

        // Przejdź na ekran główny
        przejdzDoEkranuGlownego();
    } else {
        const result = await response.json();
        alert(`Wystąpił błąd: ${result.detail}`);
    }
}