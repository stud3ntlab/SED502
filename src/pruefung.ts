// Prüflogik: Darf der Auftrag so an das gewählte Ziel geschickt werden?
// Die Anzeige auf der Seite macht main.ts.

// "import type": Aus daten.ts werden nur Typen gebraucht, die Zeile fällt beim Übersetzen weg
import type { Eintrag, Stufe, Ziel } from './daten.ts'

// Interface für das Ergebnis der Prüfung
export interface Pruefergebnis {
  readonly erlaubt: boolean
  // true = nichts ausgewählt, dann ist "erlaubt" immer false
  readonly keineAuswahl: boolean
  // undefined, wenn nichts ausgewählt ist
  readonly hoechsteStufe: Stufe | undefined
  readonly blockierende: Eintrag[]
}

// Von der höchsten zur niedrigsten Stufe sortiert
const stufenAbsteigend: Stufe[] = ['sensitiv', 'intern', 'oeffentlich']

export function hoechsteStufe(auswahl: Eintrag[]): Stufe | undefined {
  // find nimmt die erste Stufe, für die some() einen Eintrag in der Auswahl findet.
  // Weil die Liste oben mit "sensitiv" beginnt, ist das die höchste Stufe.
  // Bei leerer Auswahl findet find nichts und gibt undefined zurück.
  return stufenAbsteigend.find((stufe) => auswahl.some((eintrag) => eintrag.stufe === stufe))
}

export function blockierendeEintraege(auswahl: Eintrag[], ziel: Ziel): Eintrag[] {
  // Lokal bleibt alles im eigenen Netz, also blockiert nichts
  if (ziel === 'lokal') {
    return []
  }
  // Extern: filter behält nur die Einträge, die nicht freigegeben sind
  return auswahl.filter((eintrag) => !eintrag.externFreigegeben)
}

export function pruefeAuftrag(auswahl: Eintrag[], ziel: Ziel): Pruefergebnis {
  const keineAuswahl = auswahl.length === 0
  const blockierende = blockierendeEintraege(auswahl, ziel)

  return {
    // Im Zweifel gesperrt: ohne Auswahl nie erlaubt
    erlaubt: !keineAuswahl && blockierende.length === 0,
    // Kurzschreibweise für "keineAuswahl: keineAuswahl"
    keineAuswahl,
    hoechsteStufe: hoechsteStufe(auswahl),
    blockierende,
  }
}
