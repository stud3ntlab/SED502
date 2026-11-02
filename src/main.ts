// Einstiegspunkt der Seite. Diese Datei wird in index.html geladen.

// Styles laden. Vite baut die CSS-Datei beim Build automatisch mit ein.
import './style.css'
import { eintraege } from './daten.ts'
import type { Eintrag, Stufe, Ziel } from './daten.ts'
import { pruefeAuftrag } from './pruefung.ts'
import type { Pruefergebnis } from './pruefung.ts'

// Holt ein Element per Selektor. T ist der Elementtyp, z. B. HTMLFormElement.
// Null-Prüfung: Fehlt das Element, gibt es sofort eine klare Fehlermeldung statt später "null".
function holeElement<T extends HTMLElement>(selektor: string): T {
  const element = document.querySelector<T>(selektor)
  if (element === null) {
    throw new Error(`Element ${selektor} nicht gefunden`)
  }
  return element
}

const formular = holeElement<HTMLFormElement>('#auftrag-form')
const eintragListe = holeElement<HTMLUListElement>('#eintrag-liste')
const entscheidungAnzeige = holeElement<HTMLParagraphElement>('#entscheidung')
const stufeAnzeige = holeElement<HTMLElement>('#hoechste-stufe')
const blockierendeAnzeige = holeElement<HTMLUListElement>('#blockierende-liste')

// Anzeigetext je Stufe. Record<Stufe, string> erzwingt, dass jede Stufe einen Text hat.
const stufenText: Record<Stufe, string> = {
  oeffentlich: 'öffentlich',
  intern: 'intern',
  sensitiv: 'sensitiv',
}

function listenpunkt(text: string): HTMLLIElement {
  const li = document.createElement('li')
  li.textContent = text
  return li
}

// Baut für jeden Eintrag eine Checkbox. Nur textContent und append, kein innerHTML.
function zeigeEintraege(liste: Eintrag[]): void {
  liste.forEach((eintrag) => {
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.name = 'eintrag'
    checkbox.value = eintrag.id

    const details = document.createElement('small')
    const freigabe = eintrag.externFreigegeben ? 'ja' : 'nein'
    details.textContent = `Stufe: ${stufenText[eintrag.stufe]} · extern freigegeben: ${freigabe}`

    // Das label umschließt alles, so liest ein Screenreader Titel und Stufe mit vor
    const label = document.createElement('label')
    label.append(checkbox, ` ${eintrag.titel} `, details)

    const li = document.createElement('li')
    li.append(label)
    eintragListe.append(li)
  })
}

function leseAuswahl(): Eintrag[] {
  const angehakt = formular.querySelectorAll<HTMLInputElement>('input[name="eintrag"]:checked')
  // Array.from macht aus der NodeList ein Array, damit map funktioniert
  const ids = Array.from(angehakt).map((checkbox) => checkbox.value)
  return eintraege.filter((eintrag) => ids.includes(eintrag.id))
}

// Im Zweifel "extern", weil das der strengere Fall ist.
// ?. gibt undefined statt eines Fehlers, falls kein Radio gewählt ist.
function leseZiel(): Ziel {
  const gewaehlt = formular.querySelector<HTMLInputElement>('input[name="ziel"]:checked')
  return gewaehlt?.value === 'lokal' ? 'lokal' : 'extern'
}

function zeigeErgebnis(ergebnis: Pruefergebnis, ziel: Ziel): void {
  if (ergebnis.keineAuswahl) {
    entscheidungAnzeige.textContent = 'Gesperrt: Kein Eintrag ausgewählt.'
  } else if (ergebnis.erlaubt && ziel === 'lokal') {
    entscheidungAnzeige.textContent = 'Erlaubt: Lokal dürfen alle Einträge verwendet werden.'
  } else if (ergebnis.erlaubt) {
    entscheidungAnzeige.textContent = 'Erlaubt: Alle ausgewählten Einträge sind extern freigegeben.'
  } else {
    entscheidungAnzeige.textContent = 'Gesperrt: Nicht alle Einträge sind extern freigegeben.'
  }
  // toggle(klasse, bedingung) setzt die Klasse bei true und entfernt sie bei false (Farbe kommt per CSS)
  entscheidungAnzeige.classList.toggle('erlaubt', ergebnis.erlaubt)
  entscheidungAnzeige.classList.toggle('gesperrt', !ergebnis.erlaubt)

  stufeAnzeige.textContent = ergebnis.hoechsteStufe ? stufenText[ergebnis.hoechsteStufe] : '–'

  // map macht aus jedem blockierenden Eintrag ein li, replaceChildren ersetzt die alte Liste
  const punkte = ergebnis.blockierende.map((eintrag) => listenpunkt(eintrag.titel))
  blockierendeAnzeige.replaceChildren(...(punkte.length > 0 ? punkte : [listenpunkt('keine')]))
}

function aktualisiere(): void {
  const ziel = leseZiel()
  zeigeErgebnis(pruefeAuftrag(leseAuswahl(), ziel), ziel)
}

zeigeEintraege(eintraege)
// Event Delegation: Ein Listener am Formular reicht, weil change-Events der Radios
// und Checkboxen bis zum form hochsteigen (Bubbling).
formular.addEventListener('change', aktualisiere)
// Einmal direkt ausführen, falls der Browser nach einem Reload das Ziel wiederherstellt
aktualisiere()
