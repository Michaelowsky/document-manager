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
    const submitButton = document.getElementById('submit-document-button');
    submitButton.style.display = 'block'; // Pokaż przycisk
});

document.getElementById('firma').addEventListener('change', function() {
    document.getElementById('nip_regon_group').style.display = 'flex';
    document.getElementById('ubezpieczajacy_group').style.display = 'block';
    document.getElementById('ubezpieczony_group').style.display = 'block';
    const submitButton = document.getElementById('submit-document-button');
    submitButton.style.display = 'block'; // Pokaż przycisk
});

//////////////////////////////
// OBSŁUGA DODAWANIA POLISY //
//////////////////////////////

document.getElementById('document-form').addEventListener('submit', async (e) => {

    //////////////////////////////
    //       TU SĄ ZMIANY       //
    //////////////////////////////


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

    

    console.log("Wysyłane dane polisy:", polisa);

    try {
        const response = await fetch('http://127.0.0.1:8000/dodaj_polise/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(polisa),
        });

        const responseDiv = document.getElementById('response');

        if (response.ok) {
            const data = await response.json();
            console.log("Odpowiedź z serwera:", data);

            responseDiv.innerHTML = `<p>Polisa dodana: ${data.ubezpieczajacy}, ${data.data_zawarcia} - ${data.ochrona_do}</p>`;

            // Resetowanie formularza
            document.getElementById('document-form').reset();

            // Powrót na ekran główny
            przejdzDoEkranuGlownego();
        } else {
            const errorData = await response.json();
            console.error("Błąd z serwera:", errorData);
            responseDiv.innerHTML = `<p>Błąd: ${errorData.detail}</p>`;
        }
    } catch (error) {
        console.error("Błąd podczas wysyłania danych:", error);
        alert("Wystąpił błąd podczas dodawania polisy. Spróbuj ponownie.");
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
        queryParams.numer_polisy = numerPolisy.toUpperCase();
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

    const zakonczenieOd = document.getElementById('search-zakonczenie-od').value;
    if (zakonczenieOd) {
        queryParams.zakonczenie_od = zakonczenieOd;
    }

    const zakonczenieDo = document.getElementById('search-zakonczenie-do').value;
    if (zakonczenieDo) {
        queryParams.zakonczenie_do = zakonczenieDo;
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

        document.querySelectorAll('.clickable-row').forEach(row => {
            row.addEventListener('click', (e) => {
                const numerPolisy = row.getAttribute('data-numer-polisy');
                console.log('Kliknięto wiersz, numer polisy:', numerPolisy);
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

        const response = await fetch(`/platnosci?numer_polisy=${encodedNumerPolisy}`);
        console.log(`Otrzymano odpowiedź z serwera: ${response.status}`);

        if (!response.ok) {
            console.error(`Błąd serwera: ${response.status}`);
            throw new Error(`Błąd serwera: ${response.status}`);
        }

        const data = await response.json();
        console.log("Odpowiedź z backendu (płatności):", data);

        const polisaResponse = await fetch(`/polisy?numer_polisy=${encodedNumerPolisy}`);
        const polisaData = await polisaResponse.json();
        console.log("Dane polisy z backendu:", polisaData);

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
                <table id="platnosci-table">
                    <thead>
                        <tr>
                            <th>Data Płatności</th>
                            <th>Składka</th>
                            <th>Data Zapłacenia</th>
                            <th>Kwota Zapłacenia</th>
                            <th></th> <!-- Kolumna na minus -->
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
                        <td>
                            <button class="usunRateButton" title="Usuń ratę" style="font-size:1.2rem; width:28px; height:28px; border-radius:50%; border:none; background:#e53935; color:white; cursor:pointer;">−</button>
                        </td>
                    </tr>
                `;
            });
            tableHTML += `
                </tbody>
            </table>
            <div style="text-align:center; margin-top:10px; margin-bottom:20px;">
                <button id="dodajRateButton" style="font-size:2rem; width:48px; height:48px; border-radius:50%; border:none; background:#4caf50; color:white; cursor:pointer;">+</button>
            </div>
            <button onclick="zapiszAktualizacjePlatnosci('${numerPolisy}')">Zapisz zmiany</button>
            `;
            tableContainer.innerHTML = tableHTML;

            setTimeout(() => {
                document.querySelectorAll(".usunRateButton").forEach(btn => {
                    btn.onclick = function () {
                        this.closest("tr").remove();
                    };
                });
            }, 0);

            const dodajRateButton = document.getElementById("dodajRateButton");

            if (dodajRateButton) {
                dodajRateButton.addEventListener("click", function () {
                    const tabela = document.getElementById("platnosci-table").getElementsByTagName("tbody")[0];
                    const nowyWiersz = tabela.insertRow();

                    // Data płatności
                    const cellData = nowyWiersz.insertCell();
                    const inputData = document.createElement("input");
                    inputData.type = "date";
                    inputData.placeholder = "Data płatności";
                    cellData.appendChild(inputData);

                    // Składka
                    const cellKwota = nowyWiersz.insertCell();
                    const inputKwota = document.createElement("input");
                    inputKwota.type = "number";
                    inputKwota.placeholder = "Kwota";
                    inputKwota.step = "0.01";
                    cellKwota.appendChild(inputKwota);

                    // Data zapłacenia
                    const cellZap = nowyWiersz.insertCell();
                    const inputZap = document.createElement("input");
                    inputZap.type = "date";
                    inputZap.className = "dataZaplacenia";
                    inputZap.setAttribute("data-index", tabela.rows.length - 1);
                    cellZap.appendChild(inputZap);

                    // Kwota zapłacenia
                    const cellKwZap = nowyWiersz.insertCell();
                    const inputKwZap = document.createElement("input");
                    inputKwZap.type = "number";
                    inputKwZap.className = "kwotaZaplacenia";
                    inputKwZap.setAttribute("data-index", tabela.rows.length - 1);
                    cellKwZap.appendChild(inputKwZap);

                    const cellRemove = nowyWiersz.insertCell();
                    const removeBtn = document.createElement("button");
                    removeBtn.innerText = "−";
                    removeBtn.title = "Usuń ratę";
                    removeBtn.style.cssText = "font-size:1.2rem;width:28px;height:28px;border-radius:50%;border:none;background:#e53935;color:white;cursor:pointer;";
                    removeBtn.className = "usunRateButton";
                    removeBtn.addEventListener("click", function () {
                        nowyWiersz.remove();
                    });
                    cellRemove.appendChild(removeBtn);
                });
            }

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
    const kurtazProcent = parseFloat(document.getElementById("kurtazProcent").value);
    const numerPolisy = document.getElementById("panelPolisyTitle").innerText.split(": ")[1];
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
            kurtaz: kurtazProcent,
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
    const tabela = document.getElementById("platnosci-table").getElementsByTagName("tbody")[0];
    const nowePlatnosci = {};

    for (let i = 0; i < tabela.rows.length; i++) {
        const row = tabela.rows[i];
        // Pobierz dane z inputa jeśli istnieje, w przeciwnym razie z tekstu
        const dataPlatnosci = row.cells[0].querySelector("input") ? row.cells[0].querySelector("input").value : row.cells[0].innerText;
        const skladka = row.cells[1].querySelector("input") ? row.cells[1].querySelector("input").value : row.cells[1].innerText;
        const dataZaplacenia = row.cells[2].querySelector("input") ? row.cells[2].querySelector("input").value : row.cells[2].innerText;
        const kwotaZaplacenia = row.cells[3].querySelector("input") ? row.cells[3].querySelector("input").value : row.cells[3].innerText;

        nowePlatnosci[i] = {
            dataPlatnosci: dataPlatnosci.trim(),
            skladka: skladka.trim(),
            dataZaplacenia: dataZaplacenia.trim(),
            kwotaZaplacenia: kwotaZaplacenia.trim()
        };
    }

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
        przejdzDoEkranuGlownego();
    } else {
        const result = await response.json();
        alert(`Wystąpił błąd: ${result.detail}`);
    }
}

document.getElementById("documentInfo").addEventListener("click", function () {
    console.log("Kliknięto przycisk Dane polisy");

    // Ukryj wszystkie sekcje
    document.querySelectorAll(".content").forEach(section => {
        section.classList.remove("active");
        section.style.display = "none";
    });

    // Pokaż sekcję "Dane polisy"
    const documentInfoContent = document.getElementById("documentInfoContent");
    documentInfoContent.classList.add("active");
    documentInfoContent.style.display = "block";

    // Wyczyść pole numeru polisy
    document.getElementById("policy-number").value = "";
});

document.getElementById("policy-search-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const policyNumber = document.getElementById("policy-number").value.trim();
    if (!policyNumber) {
        alert("Proszę wpisać numer polisy.");
        return;
    }

    try {
        // Pobierz dane polisy z backendu
        const response = await fetch(`/polisy?numer_polisy=${encodeURIComponent(policyNumber)}`);
        if (!response.ok) {
            throw new Error("Nie znaleziono polisy o podanym numerze.");
        }

        const policyData = await response.json();

        // Wygeneruj tabelę z wynikami
        const policyDetailsContainer = document.getElementById("policy-details-container");
        policyDetailsContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Towarzystwo</th>
                        <th>Numer Polisy</th>
                        <th>Ubezpieczający</th>
                        <th>Ubezpieczony</th>
                        <th>Przedmiot Ubezpieczenia</th>
                        <th>Data Zawarcia</th>
                        <th>Data Rozpoczęcia</th>
                        <th>Data Zakończenia</th>
                        <th>Składka</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${policyData.towarzystwo}</td>
                        <td>${policyData.numer_ubezpieczenia}</td>
                        <td>${policyData.ubezpieczajacy}</td>
                        <td>${policyData.ubezpieczony || "Brak danych"}</td>
                        <td>${policyData.przedmiot_ubezpieczenia}</td>
                        <td>${policyData.data_zawarcia}</td>
                        <td>${policyData.ochrona_od}</td>
                        <td>${policyData.ochrona_do}</td>
                        <td>${policyData.skladka}</td>
                    </tr>
                </tbody>
            </table>
        `;
    } catch (error) {
        alert(error.message);
        document.getElementById("policy-details-container").innerHTML = "";
    }
});

document.getElementById("reportKNF").addEventListener("click", function () {
    console.log("Kliknięto przycisk Raport KNF");

    // Ukryj wszystkie sekcje
    document.querySelectorAll(".content").forEach(section => {
        section.classList.remove("active");
        section.style.display = "none";
    });

    // Pokaż sekcję "Raport KNF"
    const reportKNFContent = document.getElementById("reportKNFContent");
    reportKNFContent.classList.add("active");
    reportKNFContent.style.display = "block";

    // Wyczyść pola dat
    document.getElementById("reportKNF-data-zawarcia-od").value = "";
    document.getElementById("reportKNF-data-zawarcia-do").value = "";
});
document.getElementById("reportKNF-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const dataZawarciaOd = document.getElementById("reportKNF-data-zawarcia-od").value;
    const dataZawarciaDo = document.getElementById("reportKNF-data-zawarcia-do").value;

    if (!dataZawarciaOd || !dataZawarciaDo) {
        alert("Proszę podać zakres dat.");
        return;
    }

    try {
        const response = await fetch("/raport_knf/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data_zawarcia_od: dataZawarciaOd,
                data_zawarcia_do: dataZawarciaDo,
            }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message); // Wyświetl komunikat o zapisaniu raportu
        } else {
            alert(`Błąd: ${result.detail}`);
        }
    } catch (error) {
        console.error("Błąd podczas generowania raportu:", error);
        alert("Wystąpił błąd podczas generowania raportu.");
    }
});

document.getElementById("search-nip-button").addEventListener("click", async () => {
    const nipInput = document.getElementById("nip");
    const regonInput = document.getElementById("regon");
    const ubezpieczajacyInput = document.getElementById("ubezpieczajacy");

    const nip = nipInput.value.trim();
    if (!nip) {
        alert("Proszę wpisać NIP.");
        return;
    }

    try {
        const response = await fetch(`/szukaj_firme/?nip=${encodeURIComponent(nip)}`);
        if (!response.ok) {
            throw new Error("Nie znaleziono firmy o podanym NIP.");
        }

        const firma = await response.json();
        regonInput.value = firma.regon;
        ubezpieczajacyInput.value = firma.ubezpieczajacy;
        alert("Dane firmy zostały uzupełnione.");
    } catch (error) {
        alert(error.message);
        regonInput.value = "";
        ubezpieczajacyInput.value = "";
    }
});

document.getElementById("search-regon-button").addEventListener("click", async () => {
    const regonInput = document.getElementById("regon");
    const nipInput = document.getElementById("nip");
    const ubezpieczajacyInput = document.getElementById("ubezpieczajacy");

    const regon = regonInput.value.trim();
    if (!regon) {
        alert("Proszę wpisać REGON.");
        return;
    }

    try {
        const response = await fetch(`/szukaj_firme_regon/?regon=${encodeURIComponent(regon)}`);
        if (!response.ok) {
            throw new Error("Nie znaleziono firmy o podanym REGON.");
        }

        const firma = await response.json();
        nipInput.value = firma.nip;
        ubezpieczajacyInput.value = firma.ubezpieczajacy;
        alert("Dane firmy zostały uzupełnione.");
    } catch (error) {
        alert(error.message);
        nipInput.value = "";
        ubezpieczajacyInput.value = "";
    }
});

document.addEventListener('click', function (event) {
    const target = event.target;

    // Sprawdź, czy kliknięty element ma atrybut data-target
    if (target.dataset && target.dataset.target) {
        const targetId = target.dataset.target;
        console.log(`Przejście do ekranu: ${targetId}`);
        przejdzDoEkranu(targetId); // Użycie funkcji przejdzDoEkranu
    }
});

function przejdzDoEkranu(idNowegoEkranu) {
    const aktywnyEkran = document.querySelector('.content.active');
    const nowyEkran = document.getElementById(idNowegoEkranu);

    if (aktywnyEkran) {
        // Dodaj animację zanikania do obecnego ekranu
        aktywnyEkran.classList.add('fade-out');
        aktywnyEkran.addEventListener('animationend', () => {
            aktywnyEkran.classList.remove('active', 'fade-out');
            aktywnyEkran.style.display = 'none';

            // Pokaż nowy ekran dopiero po zakończeniu animacji
            nowyEkran.style.display = 'block';
            nowyEkran.classList.add('fade-in', 'active');
            nowyEkran.addEventListener('animationend', () => {
                nowyEkran.classList.remove('fade-in');
            });
        }, { once: true });
    } else {
        // Jeśli nie ma aktywnego ekranu, po prostu pokaż nowy ekran
        nowyEkran.style.display = 'block';
        nowyEkran.classList.add('fade-in', 'active');
        nowyEkran.addEventListener('animationend', () => {
            nowyEkran.classList.remove('fade-in');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splashScreen');

    // Sprawdź, czy ekran startowy już się pojawił
    if (!localStorage.getItem('splashShown')) {
        // Pokaż ekran startowy
        splashScreen.style.display = 'flex';

        // Po 3 sekundach ukryj ekran startowy i przejdź do ekranu głównego
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
                przejdzDoEkranu('homeContent'); // Przejdź do ekranu głównego
            }, 1000); // Czas trwania animacji ukrywania
        }, 3000); // Czas wyświetlania ekranu startowego

        // Zapisz w localStorage, że ekran startowy został pokazany
        localStorage.setItem('splashShown', 'true');
    } else {
        // Jeśli ekran startowy już się pojawił, ukryj go natychmiast
        splashScreen.style.display = 'none';
        przejdzDoEkranu('homeContent'); // Przejdź do ekranu głównego
    }
});

const osobaPrywatnaRadio = document.getElementById('osoba_prywatna');
const firmaRadio = document.getElementById('firma');
const submitButton = document.getElementById('submit-document-button');

function updateSubmitButtonVisibility() {
    if (osobaPrywatnaRadio.checked || firmaRadio.checked) {
        submitButton.style.display = 'block'; // Pokaż przycisk
    } else {
        submitButton.style.display = 'none'; // Ukryj przycisk
    }
}

osobaPrywatnaRadio.addEventListener('change', updateSubmitButtonVisibility);
firmaRadio.addEventListener('change', updateSubmitButtonVisibility);

document.getElementById("edytowaniePolisy").addEventListener("click", function () {
    console.log("Kliknięto przycisk Edytowanie polisy");

    // Ukryj wszystkie sekcje
    document.querySelectorAll(".content").forEach(section => {
        section.classList.remove("active");
        section.style.display = "none";
    });

    // Pokaż sekcję "Edytowanie polisy"
    const editPolicyContent = document.getElementById("editPolicyContent");
    editPolicyContent.classList.add("active");
    editPolicyContent.style.display = "block";

    // Wyczyść pole numeru polisy
    document.getElementById("edit-policy-number").value = "";
    document.getElementById("edit-policy-results").innerHTML = "";
});

document.getElementById("edit-policy-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const policyNumber = document.getElementById("edit-policy-number").value.trim();
    if (!policyNumber) {
        alert("Proszę wpisać numer polisy.");
        return;
    }

    try {
        // Pobierz dane polis z backendu
        const response = await fetch(`/polisy?numer_polisy=${encodeURIComponent(policyNumber)}`);
        if (!response.ok) {
            throw new Error("Nie znaleziono polisy o podanym numerze.");
        }

        let policies = await response.json();

        console.log("Odpowiedź z backendu:", policies);

        // Upewnij się, że policies jest tablicą
        if (!Array.isArray(policies)) {
            policies = [policies]; // Opakuj pojedynczy obiekt w tablicę
        }

        // Wygeneruj tabelę z wynikami
        const resultsContainer = document.getElementById("edit-policy-results");
        resultsContainer.innerHTML = `
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
                    ${policies.map(policy => `
                        <tr class="clickable-row" data-policy-number="${policy.numer_ubezpieczenia}">
                            <td>${policy.numer_ubezpieczenia}</td>
                            <td>${policy.ubezpieczajacy}</td>
                            <td>${policy.przedmiot_ubezpieczenia}</td>
                            <td>${policy.data_zawarcia}</td>
                            <td>${policy.ochrona_do}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;

        // Dodaj obsługę kliknięcia w wiersz
        document.querySelectorAll(".clickable-row").forEach(row => {
            row.addEventListener("click", (e) => {
                const policyNumber = row.getAttribute("data-policy-number");
                console.log("Kliknięto wiersz, numer polisy:", policyNumber);
                przejdzDoSzczegolowPolisy(policyNumber); // Wywołaj poprawną funkcję
            });
        });
    } catch (error) {
        alert(error.message);
        document.getElementById("edit-policy-results").innerHTML = "";
    }
});

function przejdzDoSzczegolowPolisy(policyNumber) {
    console.log("Przejście do szczegółów polisy:", policyNumber);

    // Ukryj wszystkie sekcje
    document.querySelectorAll(".content").forEach(section => {
        section.classList.remove("active");
        section.style.display = "none";
    });

    // Pokaż sekcję szczegółów polisy
    const policyDetailsContent = document.getElementById("policyDetailsContent");
    policyDetailsContent.classList.add("active");
    policyDetailsContent.style.display = "block";

    // Pobierz dane polisy z backendu
    pobierzDanePolisy(policyNumber);
}

async function pobierzDanePolisy(policyNumber) {
    try {
        console.log("Wysyłany numer polisy:", policyNumber);

        const response = await fetch(`/polisy?numer_polisy=${encodeURIComponent(policyNumber)}`);
        if (!response.ok) {
            throw new Error("Nie znaleziono polisy o podanym numerze.");
        }

        const policyData = await response.json();
        console.log("Dane polisy z backendu:", policyData);

        // Wypełnij dane w formularzu
        const fieldsContainer = document.getElementById("policy-details-fields");
        fieldsContainer.innerHTML = `
            <div class="form-group">
                <label for="policy-number">Numer Polisy:</label>
                <input type="hidden" id="hidden-policy-number" name="hidden-policy-number" value="${policyData.numer_ubezpieczenia}">
                <input type="text" id="policy-number" name="policy-number" value="${policyData.numer_ubezpieczenia}" readonly  
                    style="font-size:1.3rem; height: 2.5em; width: 350px;">
            </div>
            <div class="form-group">
                <label for="policy-holder">Ubezpieczający:</label>
                <input type="text" id="policy-holder" name="policy-holder" value="${policyData.ubezpieczajacy}" 
                    style="font-size:1.3rem; height: 2.5em; width: 350px;">
            </div>
            <div class="form-group">
                <label for="insured">Ubezpieczony:</label>
                <input type="text" id="insured" name="insured" value="${policyData.ubezpieczony || ''}" 
                    style="font-size:1.3rem; height: 2.5em; width: 350px;">
            </div>
            <div class="form-group">
                <label for="insurance-object">Przedmiot Ubezpieczenia:</label>
                <input type="text" id="insurance-object" name="insurance-object" value="${policyData.przedmiot_ubezpieczenia}" 
                    style="font-size:1.3rem; height: 2.5em; width: 350px;">
            </div>
            <div class="form-group">
                <label for="start-date">Data Rozpoczęcia:</label>
                <input type="date" id="start-date" name="start-date" value="${policyData.ochrona_od}" 
                    style="font-size:1.3rem; height: 2.5em; width: 350px;">
            </div>
            <div class="form-group">
                <label for="end-date">Data Zakończenia:</label>
                <input type="date" id="end-date" name="end-date" value="${policyData.ochrona_do}" 
                    style="font-size:1.3rem; height: 2.5em; width: 350px;">
            </div>
            <div class="form-group">
                <label for="premium">Składka:</label>
                <input type="number" id="premium" name="premium" value="${policyData.skladka}" 
                    style="font-size:1.3rem; height: 2.5em; width: 350px;">
            </div>
        `;
    } catch (error) {
        console.error("Błąd podczas pobierania danych polisy:", error);
        alert(error.message);
    }
}

document.getElementById("policy-details-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedPolicy = {
        numer_ubezpieczenia: document.getElementById("hidden-policy-number").value, // Pobierz z ukrytego pola
        ubezpieczajacy: document.getElementById("policy-holder").value,
        ubezpieczony: document.getElementById("insured").value,
        przedmiot_ubezpieczenia: document.getElementById("insurance-object").value,
        ochrona_od: document.getElementById("start-date").value,
        ochrona_do: document.getElementById("end-date").value,
        skladka: parseFloat(document.getElementById("premium").value),
    };

    console.log("Dane wysyłane do backendu:", updatedPolicy);

    try {
        const response = await fetch(`/polisy`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedPolicy),
        });

        const responseData = await response.json();
        console.log("Odpowiedź z backendu:", responseData);

        if (!response.ok) {
            throw new Error(responseData.detail || "Nie udało się zapisać zmian.");
        }

        alert("Zmiany zapisane pomyślnie.");
        przejdzDoEkranuGlownego();
    } catch (error) {
        console.error("Błąd podczas zapisywania zmian:", error);
        alert(error.message);
    }
});

// Obsługa formularza wyszukiwania notatek
document.getElementById("notatki-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const policyNumber = document.getElementById("notatki-policy-number").value.trim();
    if (!policyNumber) {
        alert("Proszę wpisać numer polisy.");
        return;
    }

    try {
        const response = await fetch(`/notatki/${encodeURIComponent(policyNumber)}`);
        if (!response.ok) {
            throw new Error("Nie znaleziono notatek dla podanego numeru polisy.");
        }

        const notatki = await response.json();
        console.log("Odpowiedź z backendu:", notatki);

        const resultsContainer = document.getElementById("notatki-results");
        resultsContainer.innerHTML = `
            <h2 style="text-align: center; color: #333;">Notatki dla polisy: ${policyNumber}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Data Zapisania</th>
                        <th>Notatka</th>
                    </tr>
                </thead>
                <tbody>
                    ${notatki.map(notatka => `
                        <tr>
                            <td>${new Date(notatka.data_zapisania).toLocaleString()}</td>
                            <td>${notatka.notatka}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
            <div class="form-group">
                <label for="new-note" style="font-weight: bold; color: #333;">Dodaj nową notatkę:</label>
                <textarea id="new-note" rows="4" placeholder="Wpisz treść notatki..."></textarea>
                <button id="save-note-button">Zapisz Notatkę</button>
            </div>
        `;

        // Obsługa zapisywania nowej notatki
        ustawObslugePrzyciskuZapiszNotatke(policyNumber);
    } catch (error) {
        console.error("Błąd podczas pobierania notatek:", error);
        alert(error.message);
        document.getElementById("notatki-results").innerHTML = "";
    }
});

// Funkcja obsługująca zapis nowej notatki
function ustawObslugePrzyciskuZapiszNotatke(policyNumber) {
    const saveNoteButton = document.getElementById("save-note-button");
    saveNoteButton.addEventListener("click", async () => {
        const newNote = document.getElementById("new-note").value.trim();
        if (!newNote) {
            alert("Proszę wpisać treść notatki.");
            return;
        }

        try {
            const response = await fetch(`/notatki/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    numer_polisy: policyNumber,
                    notatka: newNote,
                }),
            });

            if (!response.ok) {
                throw new Error("Nie udało się zapisać notatki.");
            }

            alert("Notatka została zapisana.");
            document.getElementById("new-note").value = "";

            // Odśwież listę notatek
            document.getElementById("notatki-form").dispatchEvent(new Event("submit"));
        } catch (error) {
            console.error("Błąd podczas zapisywania notatki:", error);
            alert(error.message);
        }
    });
}
