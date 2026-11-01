// Erfundene Beispieldaten. Adressen nur aus reservierten Bereichen (example.com, 192.0.2.0/24).

// Union-Typ: Nur diese Werte sind erlaubt, Tippfehler fallen schon beim Build auf
export type Stufe = 'oeffentlich' | 'intern' | 'sensitiv'
// Ziel des Auftrags, passt zu den beiden Radios im Formular
export type Ziel = 'lokal' | 'extern'

// Interface: beschreibt den Aufbau eines Eintrags.
// readonly: Stufe und Freigabe sollen nachträglich nicht änderbar sein
export interface Eintrag {
  readonly id: string
  readonly titel: string
  readonly stufe: Stufe
  readonly externFreigegeben: boolean
}

// Die Wissensbasis. "export" macht sie in anderen Dateien wie main.ts verfügbar.
export const eintraege: Eintrag[] = [
  {
    id: 'aufgabe',
    titel: 'Aufgabe: Testplan für eine Webanwendung erstellen',
    stufe: 'oeffentlich',
    externFreigegeben: true,
  },
  {
    id: 'cve',
    titel: 'Öffentliche Beschreibung einer bekannten Schwachstelle (CVE)',
    stufe: 'oeffentlich',
    externFreigegeben: true,
  },
  {
    id: 'vorgehen',
    titel: 'Vorgehensweise des Teams (Phasen, Checkliste)',
    stufe: 'intern',
    // intern, aber nach Prüfung freigegeben
    externFreigegeben: true,
  },
  {
    id: 'umfang',
    titel: 'Testumfang laut Auftrag (Systeme, Zeitraum)',
    stufe: 'intern',
    externFreigegeben: false,
  },
  {
    id: 'kunde',
    titel: 'Kunde und Zieladressen (shop.example.com, 192.0.2.10)',
    stufe: 'sensitiv',
    externFreigegeben: false,
  },
  {
    id: 'scan',
    titel: 'Scan-Ergebnis: offene Ports und Softwareversionen',
    stufe: 'sensitiv',
    externFreigegeben: false,
  },
]
