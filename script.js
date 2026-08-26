// ============================================================
// ANATOMIE MUSKEL QUIZ
// ============================================================


// ============================================================
// 1. GLOBALE VARIABLEN
// ============================================================

let muskeln = [];

let reihenfolge = [];

let aktuelleFrage = 0;

let punkte = 0;


// ============================================================
// 2. HTML-ELEMENTE
// ============================================================

const muskelElement =
    document.getElementById("muskel");

const antwortenElement =
    document.getElementById("antworten");

const fortschrittElement =
    document.getElementById("fortschritt");

const punkteElement =
    document.getElementById("punkte");

const feedbackElement =
    document.getElementById("feedback");


// ============================================================
// 3. MUSKELDATEN LADEN
// ============================================================

async function starten() {

    try {

        const response =
            await fetch("muskeln.json");


        // Prüfen, ob Datei geladen werden konnte

        if (!response.ok) {

            throw new Error(
                "muskeln.json konnte nicht geladen werden."
            );

        }


        // JSON in JavaScript umwandeln

        muskeln =
            await response.json();


        console.log(
            "Muskeln geladen:",
            muskeln.length
        );


        // Sicherheitskontrolle

        if (muskeln.length !== 99) {

            console.warn(
                "Warnung: Es wurden " +
                muskeln.length +
                " Muskeln geladen."
            );

        }


        // ====================================================
        // REIHENFOLGE ERSTELLEN
        // ====================================================

        reihenfolge = [];


        for (
            let i = 0;
            i < muskeln.length;
            i++
        ) {

            reihenfolge.push(i);

        }


        // Reihenfolge zufällig machen

        mischen(reihenfolge);


        // Erste Frage anzeigen

        zeigeFrage();


    } catch (error) {

        console.error(error);


        muskelElement.textContent =
            "Fehler beim Laden der Muskeldaten.";


        feedbackElement.textContent =
            "Bitte überprüfe deine muskeln.json.";

    }

}


// ============================================================
// 4. ARRAY ZUFÄLLIG MISCHEN
// Fisher-Yates Shuffle
// ============================================================

function mischen(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];

    }

}


// ============================================================
// 5. URSPRUNG + ANSATZ ALS TEXT
// ============================================================

function antwortText(muskel) {

    return (

        "Ursprung: " +

        muskel.ursprung.join("; ") +

        " → Ansatz: " +

        muskel.ansatz.join("; ")

    );

}


// ============================================================
// 6. FRAGE ANZEIGEN
// ============================================================

function zeigeFrage() {


    // Aktuellen Muskel bestimmen

    const aktuellerMuskel =
        muskeln[
            reihenfolge[aktuelleFrage]
        ];


    // Muskelname anzeigen

    muskelElement.textContent =
        aktuellerMuskel.muskel;


    // Fortschritt

    fortschrittElement.textContent =
        "Muskel " +
        (aktuelleFrage + 1) +
        " / " +
        muskeln.length;


    // Punktestand

    punkteElement.textContent =
        "Punkte: " +
        punkte;


    // Feedback löschen

    feedbackElement.textContent = "";


    // ========================================================
    // RICHTIGE ANTWORT
    // ========================================================

    const richtigeAntwort =
        antwortText(aktuellerMuskel);


    // ========================================================
    // FALSCHE ANTWORTEN
    // ========================================================

    const andereMuskeln =
        muskeln.filter(

            (_, index) =>

                index !==
                reihenfolge[aktuelleFrage]

        );


    // Andere Muskeln zufällig mischen

    mischen(andereMuskeln);


    // ========================================================
    // VIER ANTWORTEN ERSTELLEN
    // ========================================================

    const antworten = [

        {
            text: richtigeAntwort,
            richtig: true
        },

        ...andereMuskeln
            .slice(0, 3)
            .map(muskel => {

                return {

                    text:
                        antwortText(muskel),

                    richtig: false

                };

            })

    ];


    // Antworten zufällig mischen

    mischen(antworten);


    // Alte Antworten löschen

    antwortenElement.innerHTML = "";


    // ========================================================
    // BUTTONS ERSTELLEN
    // ========================================================

    antworten.forEach(antwort => {


        const button =
            document.createElement("button");


        button.className =
            "answer";


        button.textContent =
            antwort.text;


        // Antwort speichern

        button.dataset.richtig =
            antwort.richtig;


        // Klick-Ereignis

        button.addEventListener(
            "click",
            function () {

                pruefen(
                    button,
                    antwort.richtig
                );

            }
        );


        // Button zur Seite hinzufügen

        antwortenElement.appendChild(button);

    });

}


// ============================================================
// 7. ANTWORT PRÜFEN
// ============================================================

function pruefen(
    geklickterButton,
    istRichtig
) {


    // ========================================================
    // ALLE BUTTONS HOLEN
    // ========================================================

    const buttons =
        document.querySelectorAll(
            ".answer"
        );


    // ========================================================
    // MEHRFACHKLICK VERHINDERN
    // ========================================================

    buttons.forEach(button => {

        button.disabled = true;

    });


    // ========================================================
    // RICHTIG
    // ========================================================

    if (istRichtig === true) {


        // Button grün

        geklickterButton.classList.add(
            "correct"
        );


        // Feedback

        feedbackElement.textContent =
            "✓ Richtig!";


        // Punkt hinzufügen

        punkte++;


    }


    // ========================================================
    // FALSCH
    // ========================================================

    else {


        // Geklickten Button rot

        geklickterButton.classList.add(
            "wrong"
        );


        // Feedback

        feedbackElement.textContent =
            "✗ Falsch!";


        // Aktuellen Muskel holen

        const richtigerMuskel =
            muskeln[
                reihenfolge[aktuelleFrage]
            ];


        // Richtige Antwort

        const richtigeAntwort =
            antwortText(
                richtigerMuskel
            );


        // ====================================================
        // RICHTIGE ANTWORT GRÜN MARKIEREN
        // ====================================================

        buttons.forEach(button => {


            if (
                button.textContent ===
                richtigeAntwort
            ) {

                button.classList.add(
                    "correct"
                );

            }

        });

    }


    // ========================================================
    // PUNKTSTAND AKTUALISIEREN
    // ========================================================

    punkteElement.textContent =
        "Punkte: " +
        punkte;


    // ========================================================
    // KURZ WARTEN
    // ========================================================

    setTimeout(
        () => {

            nächsteFrage();

        },
        1800
    );

}


// ============================================================
// 8. NÄCHSTE FRAGE
// ============================================================

function nächsteFrage() {


    aktuelleFrage++;


    // ========================================================
    // ALLE MUSKELN DURCH?
    // ========================================================

    if (
        aktuelleFrage >=
        muskeln.length
    ) {


        // Ergebnis anzeigen

        alert(

            "Quiz beendet!\n\n" +

            "Du hast " +

            punkte +

            " von " +

            muskeln.length +

            " Punkten erreicht."

        );


        // ====================================================
        // QUIZ ZURÜCKSETZEN
        // ====================================================

        aktuelleFrage = 0;

        punkte = 0;


        // Neue zufällige Reihenfolge

        mischen(reihenfolge);

    }


    // Nächste Frage anzeigen

    zeigeFrage();

}


// ============================================================
// 9. QUIZ STARTEN
// ============================================================

starten();