> ESA 1 · SED502 Frontend Development · FernFH · WS 2026/27

# Freigabe-Prüfstand

Eine kleine Webseite, die prüft, ob ein Auftrag an ein KI-Modell geschickt werden darf.
Man wählt aus, welche Einträge aus einer Wissensbasis im Auftrag stehen sollen und ob der Auftrag an ein
lokales oder an ein externes Modell geht. Die Seite zeigt sofort an, ob das erlaubt ist und welche
Einträge das Problem sind.

## Projektidee

**Beispiel:** Ein Pentest-Team hat den Auftrag, eine Webanwendung eines (erfundenen) Kunden zu testen.
Es will sich von einer KI helfen lassen, einen Testplan zu erstellen. In der Wissensbasis gibt es dazu
mehrere Einträge, zum Beispiel eine öffentliche Beschreibung einer Schwachstelle, die eigene Vorgehensweise
des Teams, den Testumfang oder die Ergebnisse eines Scans. Gerade bei Pentests kommen schnell sensible
Daten vor: Kundennamen, IP-Adressen, offene Ports oder gefundene Schwachstellen dürfen auf keinen Fall
in eine Cloud gelangen.

**Jeder Eintrag in der Wissensbasis hat:**
- eine **Stufe**:

  | Stufe | Was heißt das? |
  |---|---|
  | öffentlich | darf jeder wissen |
  | intern | Infos über die eigene Umgebung |
  | sensitiv | heikle Details, z. B. Kundendaten, IP-Adressen oder Scan-Ergebnisse |

- eine **Freigabe für extern** (ja/nein). Das ist eine eigene Entscheidung. Ein interner Eintrag kann
  zum Beispiel nach einer Prüfung trotzdem freigegeben sein.

**Ziel:** Der Auftrag geht entweder an ein **lokales** Modell (läuft bei uns) oder an ein **externes**
Modell (Cloud).

**Regel:**
- An ein lokales Modell darf alles gehen.
- An ein externes Modell darf ein Auftrag nur gehen, wenn **alle** ausgewählten Einträge für extern
  freigegeben sind.
- Im Zweifel wird gesperrt.

**Bedienung:** Einträge per Checkbox auswählen, Ziel per Radio-Button wählen. Das Ergebnis ändert sich
bei jeder Auswahl sofort. Stufe und Freigabe kommen aus der Wissensbasis und können auf der Seite nicht
geändert werden. Wer den Auftrag schreibt, soll die Einstufung nicht selbst festlegen können.

## Kontext: Masterarbeit

Die Seite hängt mit meiner geplanten Masterarbeit zusammen. Arbeitstitel:
*Konzeption, prototypische Umsetzung und Evaluation einer informationsflusskontrollierten
Wissensarchitektur mit einem LLM-Council aus lokalen und cloudbasierten Modellen.*

Kurz gesagt: Mehrere KI-Modelle sollen gemeinsam Wissen für Security-Teams aufbereiten und in einer
Wissensbasis ablegen. Einige Modelle laufen lokal, andere in der Cloud. Externe Modelle dürfen nur
Inhalte bekommen, die dafür freigegeben sind. Sensible Infos bleiben lokal. Abfragen auf die
Wissensbasis machen nur lokale Modelle.

Diese Seite zeigt den Schritt, der vor jedem externen Aufruf steht: **Was darf raus und was nicht?**

## Der LLM-Council

Die Idee für den Council kommt von Andrej Karpathys Projekt
[llm-council](https://github.com/karpathy/llm-council). Dort läuft eine Frage in drei Stufen ab:

1. **Erste Antworten:** Mehrere Modelle beantworten die Frage unabhängig voneinander.
2. **Gegenseitige Bewertung:** Jedes Modell bewertet die Antworten der anderen. Die Antworten sind dabei
   anonymisiert („Antwort A, B, C“), damit kein Modell ein bestimmtes Modell bevorzugt.
3. **Zusammenfassung:** Ein „Vorsitz“-Modell fasst Antworten und Bewertungen zu einem Ergebnis zusammen.

In meiner Masterarbeit soll ein ähnlicher Council Wissen anreichern. Der Unterschied: Bevor etwas an ein
externes Modell geht, muss es durch eine Freigabeprüfung. Das gilt für die Frage, aber auch für die
Bewertungen und die Zusammenfassung, weil darin wieder Inhalte stecken. Diese Seite zeigt diese
Prüfung in einfacher Form.

## Was diese Seite nicht macht

- Alle Daten sind erfunden (Kunde, Adressen, Scan-Ergebnisse). Es gibt keine echten Ziele.
- Die Seite ist nur eine Demo und schützt nichts wirklich.
- Es wird keine KI aufgerufen, auch kein Council.
- **Annahme:** Die Einträge sind bereits eingestuft. Wie und von wem eingestuft wird, ist Teil der
  Masterarbeit.

**Offene Punkte für die Masterarbeit** (hier nicht umgesetzt):
- Wer stuft Einträge ein? Zum Beispiel feste Regeln plus ein lokales Modell, das Vorschläge macht,
  die ein Mensch bestätigt.
- Welche Stufe bekommt neues Wissen, das der Council aus mehreren Einträgen erzeugt?
  Naheliegend: die höchste Stufe der Quellen.
- Kann schon das Thema eines Auftrags etwas Sensibles verraten?

## Ausblick

- **ESA 2:** React-Anwendung mit echtem Council (Cloud-Modelle), Freigabeprüfung davor und einer
  öffentlichen REST-API als Datenquelle.
- **ESA 3:** Responsive, barrierefrei und online gestellt.

## Technik

- HTML, CSS und TypeScript, kein Framework
- Vite als Build-Tool
- Semantisches HTML und ARIA, Lighthouse Accessibility: 100 (siehe [lighthouse.png](lighthouse.png))


## Technische Entscheidungen

Für eine einzelne Seite wollte ich kein Framework verwenden. Vite und TypeScript reichen völlig aus: Vite
startet den Entwicklungsserver und baut die Seite, und TypeScript läuft im `strict`-Modus, damit Fehler schon
beim Build auffallen.

Den Code habe ich auf drei Dateien aufgeteilt. In `daten.ts` stehen die Typen und die Beispieldaten, in
`pruefung.ts` nur die Prüflogik und in `main.ts` alles, was mit der Anzeige und den Eingaben zu tun hat.
Die Prüflogik greift nicht auf die Seite zu. Dadurch lässt sie sich getrennt testen und leichter erklären.

Die Einträge stehen bewusst nicht im HTML. `main.ts` baut die Checkboxen aus den Daten in `daten.ts`. So
gibt es Stufe und Freigabe nur an einer Stelle, und sie können nicht auseinanderlaufen. Für Stufe und Ziel
verwende ich Union-Typen, damit nur gültige Werte möglich sind. Die Felder eines Eintrags sind `readonly`,
weil Stufe und Freigabe auch im Code nicht nachträglich geändert werden sollen.

Bei der Prüfung gilt „im Zweifel gesperrt“. Ohne Auswahl ist nichts erlaubt, und als Ziel ist am Anfang
„extern“ ausgewählt, weil das der strengere Fall ist. Wird kein Ziel erkannt, rechnet die Seite ebenfalls
mit „extern“.

Statt an jede Checkbox einen eigenen Listener zu hängen, gibt es nur einen `change`-Listener am Formular
(Event Delegation). Bei jeder Änderung wird alles neu berechnet. Texte setze ich nur mit `textContent` und
nie mit `innerHTML`, damit nichts als HTML ausgeführt wird. Das passt auch zum Security-Thema der Seite.

Bei der Barrierefreiheit habe ich auf semantisches HTML geachtet: `fieldset` und `legend` für die Gruppen,
ein `label` um jedes Eingabefeld, `aria-label` an der Navigation, `aria-labelledby` an den Bereichen und
`aria-live` beim Ergebnis, damit Screenreader Änderungen vorlesen. Die Stufe steht immer als Text da und
nicht nur als Farbe. Alle Farben haben mindestens 4,5:1 Kontrast, und der Fokus ist bei Tastaturbedienung
deutlich sichtbar. Lighthouse Accessibility ergibt 100 Punkte ([lighthouse.png](lighthouse.png)).
