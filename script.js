
// ===================================================
// ANATOMIE QUIZ – KATEGORIEN UND RANDOM-MODUS
// ===================================================

let muskeln = [];
let quizMuskeln = [];
let aktuelleFrage = 0;
let punkte = 0;
let aktuelleKategorie = "random";
let antwortGesperrt = false;
let weiterTimer = null;

const kategorienNamen = {
    random: "Random – Alle Muskeln",
    schulter: "Schulter",
    ellenbogen: "Ellenbogen",
    hand: "Hand",
    becken: "Becken",
    huefte: "Hüfte",
    knie: "Knie",
    fuss: "Fuß"
};

// Namen müssen den Namen aus muskeln.json entsprechen.
// Schreibweise wird durch normalizeName vereinheitlicht.

const kategorien = {

    schulter: [
        "M. deltoideus",
        "M. supraspinatus",
        "M. infraspinatus",
        "M. subscapularis",
        "M. teres minor",
        "M. teres major",
        "M. latissimus dorsi",
        "M. pectoralis major",
        "M. pectoralis minor",
        "M. trapezius",
        "M. levator scapulae",
        "M. rhomboideus major",
        "M. rhomboideus minor",
        "M. serratus anterior",
        "M. biceps brachii",
        "M. triceps brachii",
        "M. coracobrachialis"
    ],

    ellenbogen: [
        "M. biceps brachii",
        "M. brachialis",
        "M. brachioradialis",
        "M. triceps brachii",
        "M. anconeus",
        "M. pronator teres",
        "M. supinator",
        "M. epitrochleoanconeus"
    ],

    hand: [
        "M. flexor carpi radialis",
        "M. flexor carpi ulnaris",
        "M. extensor carpi radialis brevis",
        "M. extensor carpi radialis longus",
        "M. extensor carpi ulnaris",
        "M. flexor digitorum superficialis",
        "M. flexor digitorum profundus",
        "M. extensor digitorum",
        "M. extensor digiti minimi",
        "M. extensor pollicis brevis",
        "M. extensor pollicis longus",
        "M. abductor digiti minimi (Hand)",
        "M. abductor pollicis brevis",
        "M. adductor pollicis",
        "M. flexor pollicis brevis",
        "M. opponens pollicis",
        "M. pronator quadratus"
    ],

    becken: [
        "M. gluteus maximus",
        "M. gluteus medius",
        "M. gluteus minimus",
        "M. iliacus",
        "M. psoas major",
        "M. psoas minor",
        "M. piriformis",
        "M. obturatorius internus",
        "M. obturatorius externus",
        "M. gemellus superior",
        "M. gemellus inferior",
        "M. quadratus femoris",
        "M. tensor fasciae latae",
        "M. quadratus lumborum",
        "M. rectus abdominis",
        "M. transversus abdominis",
        "M. obliquus externus abdominis",
        "M. obliquus internus abdominis",
        "M. erector spinae"
    ],

    huefte: [
        "M. gluteus maximus",
        "M. gluteus medius",
        "M. gluteus minimus",
        "M. iliacus",
        "M. psoas major",
        "M. piriformis",
        "M. tensor fasciae latae",
        "M. adductor brevis",
        "M. adductor longus",
        "M. adductor magnus",
        "M. adductor minimus",
        "M. gracilis",
        "M. pectineus",
        "M. sartorius",
        "M. rectus femoris",
        "M. biceps femoris",
        "M. semitendinosus",
        "M. semimembranosus",
        "M. obturatorius internus",
        "M. obturatorius externus",
        "M. gemellus superior",
        "M. gemellus inferior",
        "M. quadratus femoris"
    ],

    knie: [
        "M. rectus femoris",
        "M. vastus medialis",
        "M. vastus lateralis",
        "M. vastus intermedius",
        "M. biceps femoris",
        "M. semitendinosus",
        "M. semimembranosus",
        "M. sartorius",
        "M. gracilis",
        "M. gastrocnemius",
        "M. popliteus",
        "M. tensor fasciae latae"
    ],

    fuss: [
        "M. tibialis anterior",
        "M. tibialis posterior",
        "M. gastrocnemius",
        "M. soleus",
        "M. fibularis brevis",
        "M. fibularis longus",
        "M. fibularis tertius",
        "M. flexor hallucis longus",
        "M. flexor digitorum longus",
        "M. extensor hallucis longus",
        "M. extensor digitorum brevis",
        "M. abductor digiti minimi (Fuß)",
        "M. abductor hallucis",
        "M. adductor hallucis",
        "M. flexor digiti minimi brevis (Fuß)",
        "M. flexor digitorum brevis",
        "M. flexor hallucis brevis"
    ]
};

// ===================================================
// HTML ELEMENTE
// ===================================================

const hauptmenue = document.getElementById("hauptmenue");
const quiz = document.getElementById("quiz");
const ergebnis = document.getElementById("ergebnis");

const muskelElement = document.getElementById("muskel");
const antwortenElement = document.getElementById("antworten");
const fortschrittElement = document.getElementById("fortschritt");
const punkteElement = document.getElementById("punkte");
const feedbackElement = document.getElementById("feedback");
const progressBar = document.getElementById("progress-bar");
const prozentElement = document.getElementById("prozent");

// ===================================================
// MUSKELNAMEN NORMALISIEREN
// ===================================================

function normalizeName(name) {
    return name
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

// ===================================================
// DATEN LADEN
// ===================================================

async function laden() {
    try {
        const response = await fetch("muskeln.json");

        if (!response.ok) {
            throw new Error("muskeln.json nicht gefunden.");
        }

        const daten = await response.json();

        if (!Array.isArray(daten) || daten.length < 4) {
            throw new Error("Zu wenige Muskeldaten.");
        }

        for (const muskel of daten) {
            if (
                typeof muskel.muskel !== "string" ||
                !Array.isArray(muskel.ursprung) ||
                !Array.isArray(muskel.ansatz) ||
                !muskel.ursprung.length ||
                !muskel.ansatz.length
            ) {
                throw new Error("Ungültiger Muskeleintrag.");
            }
        }

        muskeln = daten;

        document.getElementById("gesamtzahl").textContent =
            muskeln.length + " Muskeln";

        document.getElementById("menue-status").textContent =
            "Wähle eine Kategorie, um zu starten.";

        document.querySelectorAll("[data-kategorie]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    quizStarten(button.dataset.kategorie);
                });
            });

        // Kontrolle: Sind Kategorienamen vorhanden?
        for (const [kategorie, namen] of Object.entries(kategorien)) {
            const vorhanden = new Set(
                muskeln.map(m => normalizeName(m.muskel))
            );

            const fehlend = namen.filter(
                name => !vorhanden.has(normalizeName(name))
            );

            if (fehlend.length) {
                console.warn(
                    "Nicht gefundene Muskeln in " + kategorie,
                    fehlend
                );
            }
        }

    } catch (error) {
        console.error(error);

        document.getElementById("menue-status").textContent =
            "Fehler: " + error.message;
    }
}

// ===================================================
// ZUFÄLLIG MISCHEN
// ===================================================

function mischen(array) {
    const kopie = [...array];

    for (let i = kopie.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
    }

    return kopie;
}

// ===================================================
// QUIZ STARTEN
// ===================================================

function quizStarten(kategorie) {

    if (!muskeln.length) return;

    if (weiterTimer !== null) {
        clearTimeout(weiterTimer);
        weiterTimer = null;
    }

    aktuelleKategorie = kategorie;
    aktuelleFrage = 0;
    punkte = 0;
    antwortGesperrt = false;

    if (kategorie === "random") {
        quizMuskeln = mischen(muskeln);
    } else {
        const namen = new Set(
            kategorien[kategorie].map(normalizeName)
        );

        quizMuskeln = mischen(
            muskeln.filter(m =>
                namen.has(normalizeName(m.muskel))
            )
        );
    }

    if (!quizMuskeln.length) {
        alert("Keine Muskeln in dieser Kategorie gefunden.");
        return;
    }

    hauptmenue.classList.add("hidden");
    ergebnis.classList.add("hidden");
    quiz.classList.remove("hidden");

    document.getElementById("kategorie-titel").textContent =
        kategorienNamen[kategorie];

    zeigeFrage();
}

// ===================================================
// ANTWORTTEXT
// ===================================================

function antwortText(muskel) {
    return (
        "Ursprung: " +
        muskel.ursprung.join("; ") +
        "\n\nAnsatz: " +
        muskel.ansatz.join("; ")
    );
}

// ===================================================
// FRAGE ANZEIGEN
// ===================================================

function zeigeFrage() {

    antwortGesperrt = false;

    const aktuellerMuskel = quizMuskeln[aktuelleFrage];

    muskelElement.textContent = aktuellerMuskel.muskel;

    fortschrittElement.textContent =
        "Muskel " + (aktuelleFrage + 1) +
        " / " + quizMuskeln.length;

    punkteElement.textContent = "Punkte: " + punkte;

    const prozent = Math.round(
        (aktuelleFrage / quizMuskeln.length) * 100
    );

    progressBar.style.width = prozent + "%";
    prozentElement.textContent = prozent + "%";

    feedbackElement.textContent = "";
    antwortenElement.innerHTML = "";

    // Richtige Antwort
    const richtig = {
        text: antwortText(aktuellerMuskel),
        richtig: true
    };

    // Falsche Antworten aus gesamter Datenbank
    // Doppelte Antworttexte werden ausgeschlossen.
    const benutzteTexte = new Set([richtig.text]);

    const falscheAntworten = [];

    for (const muskel of mischen(muskeln)) {
        const text = antwortText(muskel);

        if (!benutzteTexte.has(text)) {
            benutzteTexte.add(text);

            falscheAntworten.push({
                text: text,
                richtig: false
            });
        }

        if (falscheAntworten.length === 3) break;
    }

    if (falscheAntworten.length < 3) {
        feedbackElement.textContent =
            "Nicht genügend unterschiedliche Antworten.";
        return;
    }

    const antworten = mischen([
        richtig,
        ...falscheAntworten
    ]);

    antworten.forEach(antwort => {

        const button = document.createElement("button");

        button.className = "answer";
        button.textContent = antwort.text;
        button.style.whiteSpace = "pre-line";

        button.addEventListener("click", () => {
            pruefen(button, antwort.richtig);
        });

        // Markierung für richtige Antwort
        button.dataset.richtig = String(antwort.richtig);

        antwortenElement.appendChild(button);
    });
}

// ===================================================
// ANTWORT PRÜFEN
// ===================================================

function pruefen(button, istRichtig) {

    if (antwortGesperrt) return;

    antwortGesperrt = true;

    const buttons = antwortenElement.querySelectorAll(".answer");

    buttons.forEach(b => {
        b.disabled = true;
    });

    if (istRichtig) {

        button.classList.add("correct");

        feedbackElement.textContent = "✓ Richtig!";
        feedbackElement.style.color = "#1f7a5a";

        punkte++;

    } else {

        button.classList.add("wrong");

        feedbackElement.textContent = "✗ Falsch!";
        feedbackElement.style.color = "#d64545";

        buttons.forEach(b => {
            if (b.dataset.richtig === "true") {
                b.classList.add("correct");
            }
        });
    }

    punkteElement.textContent = "Punkte: " + punkte;

    weiterTimer = setTimeout(() => {
        weiterTimer = null;
        naechsteFrage();
    }, 2200);
}

// ===================================================
// NÄCHSTE FRAGE
// ===================================================

function naechsteFrage() {

    aktuelleFrage++;

    if (aktuelleFrage >= quizMuskeln.length) {
        quizBeenden();
    } else {
        zeigeFrage();
    }
}

// ===================================================
// ABSCHLUSS
// ===================================================

function quizBeenden() {

    quiz.classList.add("hidden");
    ergebnis.classList.remove("hidden");

    const gesamt = quizMuskeln.length;

    const prozent = Math.round((punkte / gesamt) * 100);

    document.getElementById("endpunkte").textContent =
        punkte + " / " + gesamt;

    document.getElementById("ergebnis-text").textContent =
        prozent + "% richtig beantwortet – " +
        kategorienNamen[aktuelleKategorie];
}

// ===================================================
// ZURÜCK ZUM MENÜ
// ===================================================

function menueAnzeigen() {

    if (weiterTimer !== null) {
        clearTimeout(weiterTimer);
        weiterTimer = null;
    }

    quiz.classList.add("hidden");
    ergebnis.classList.add("hidden");
    hauptmenue.classList.remove("hidden");
}

document.getElementById("zurueck")
    .addEventListener("click", menueAnzeigen);

document.getElementById("zum-menue")
    .addEventListener("click", menueAnzeigen);

document.getElementById("neustart")
    .addEventListener("click", () => {
        quizStarten(aktuelleKategorie);
    });

// ===================================================
// APP LADEN
// ===================================================

laden();
