# Mano Pizza sito statico

Sito statico one-page per Mano Pizza, pizzeria al taglio da asporto a Bra.

## Struttura

- `index.html`: pagina principale con hero, manifesto, menu, gallery, orari, mappa e contatti.
- `styles.css`: stile responsive senza dipendenze esterne obbligatorie.
- `script.js`: menu mobile, stato header, animazioni leggere e stato aperto/chiuso.
- `404.html`: pagina errore coerente con il sito.
- `manifest.json`, `robots.txt`, `sitemap.xml`: supporto base per PWA, crawler e SEO.
- `assets/`: logo e foto reali del locale/prodotto, con asset WebP rinominati con estensione corretta.

## Orari configurati

Lunedì-venerdì 12:00-19:30. Sabato e domenica chiuso. Lo stato aperto/chiuso viene calcolato nel browser usando il fuso orario `Europe/Rome`.

## Pubblicazione

Il sito non richiede build: pubblicare il contenuto della cartella `output/` su hosting statico o GitHub Pages.

Prima della messa online sostituire `https://example.com/` in `index.html`, `robots.txt` e `sitemap.xml` con il dominio reale.
