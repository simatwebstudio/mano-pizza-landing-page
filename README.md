# Mano Pizza sito statico

Sito statico one-page per Mano Pizza, pizzeria al taglio da asporto a Bra.

## Struttura

- `index.html`: pagina principale con hero, manifesto, menu, gallery, orari, foto del locale e contatti.
- `privacy.html`: informativa privacy bilingue IT/EN per sito statico cookie-free, con dati legali del titolare.
- `styles.css`: stile responsive senza dipendenze esterne obbligatorie.
- `script.js`: menu mobile, stato header, animazioni leggere e stato aperto/chiuso.
- `404.html`: pagina errore coerente con il sito.
- `manifest.json`, `robots.txt`, `sitemap.xml`, `CNAME`: supporto base per PWA, crawler, SEO e dominio custom su GitHub Pages.
- `_headers.example`: riferimento per hosting statici che supportano header custom. GitHub Pages non applica questo file.
- `assets/`: logo e foto reali del locale/prodotto, con asset WebP rinominati con estensione corretta.
- `assets/fonts/`: cartella predisposta per font self-hosted.

## Orari configurati

Martedì-sabato 17:00-23:00. Domenica e lunedì chiuso. Lo stato aperto/chiuso viene calcolato nel browser usando il fuso orario `Europe/Rome`.

## Pubblicazione

Il sito non richiede build: pubblicare il contenuto della cartella `output/` su GitHub Pages.

Dominio finale configurato nei canonical, metadati social, dati strutturati, `robots.txt` e `sitemap.xml`:

```text
https://manopizza.it
```

## Privacy e servizi esterni

Il sito e' impostato per restare cookie-free: non usa form, analytics, pixel, iframe, storage persistente nel browser o script esterni. Instagram e Google Maps sono semplici link esterni attivati solo dopo click dell'utente.

Per la pubblicazione sono indicati in privacy policy:

- GitHub Pages / GitHub, Inc. come hosting statico;
- Fastly, Inc. come CDN/content delivery usata da GitHub Pages;
- log tecnici di navigazione, incluso l'indirizzo IP, trattati dai fornitori tecnici per erogazione, sicurezza e diagnostica.

La mappa incorporata e' stata sostituita con l'immagine locale `assets/MappaStatica.png`, cliccabile insieme al bottone per aprire le indicazioni su Google Maps.

## Font

Il sito e' predisposto per self-hostare Anton, usato come font display per titoli, brand, bottoni, prezzi e label forti. Il corpo testo resta su font di sistema per leggibilita'.

Il file e' gia' presente nel repository. Fonte originale:

```text
https://fonts.gstatic.com/s/anton/v27/1Ptgg87LROyAm3Kz-C8.woff2
```

Percorso locale:

```text
assets/fonts/Anton-Regular.woff2
```

Fonte: Google Fonts / repository `google/fonts`, licenza SIL Open Font License 1.1.
