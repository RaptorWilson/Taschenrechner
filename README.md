# Taschenrechner
 Ein Taschenrechner im Browser, erstellt mit HTML, CSS und JavaScript. Unterstützt Grundlegende sowie erweiterte mathematische Operationen.
## Funktionen: 
  - Grundrechenarten: +, −, ×, /
  - Klammern & Punkt-vor-Strich-Rechnung
  - Erweiterte Funktionen:
    + Trigonometrie: sin, cos, tan, arcsin, arccos, arctan
    + Fakultät x!
    + Potenzen x², xʸ
    + Wurzeln: Quadrat- und n-te Wurzel
    + Logarithmus ln
    + Konstante: e, π
  - Winkelmodus: Radiant/Grad umschaltbar
  - Speicherfunktion (Memory)
  - Eingabe auch über Tastatur möglich
  - Verketten von Funktionen funktioniert

## Technische Details:
  - Eigene Logik zum Auswerten des Inputs als Array
  - Richtige Klammer auswertung impliziert ein rekursives auflösen, zwar nicht durch function in function calling, aber iterativ mit einem Stack gelöst
  - keine externe Library wird verwendet um berechnungen zu vereinfachen
