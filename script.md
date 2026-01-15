Manuskript – Projekt Lexi
Översikt
https://github.com/nazirlouis/ada_v2
Lexi är en personlig, installerbar AI-assistent för desktop som kombinerar röst, text, kamera och intelligenta moduler för att faktiskt utföra arbete, inte bara prata.

Lexi bygger på en fork av projektet ada_v2, men hela identiteten, namnsättningen och upplevelsen ändras.
Allt som idag heter ADA byts konsekvent till Lexi – i kod, UI, dokumentation och kommunikation.

Projektet ska forkas och vidareutvecklas av Google Antigravity.

Grundprinciper för Lexi

Lexi är ett riktigt program

Installerbar desktop-app (macOS)
Kör lokalt backend + UI

Ingen webbdemo, ingen prototypkänsla

Lexi är modulär (toolbox-arkitektur)

Alla funktioner är utbytbara moduler (“skills”)

Nya moduler kan läggas till utan refactor

Onödiga moduler tas bort helt (CAD, 3D-print m.m.)

Lexi har personlighet och kontinuitet

Samma röst, samma ton, samma sätt att resonera

Minns användarens preferenser och arbetssätt

Upplevs som “min assistent”, inte ett verktyg

Språk- och kommunikationspolicy (viktig)

All skriven kommunikation: svenska

UI

texter

dokument

sammanställningar

Allt tal (voice output): engelska

Input (röst): svenska

Lexi ska alltså:

förstå svenska när användaren pratar

svara med engelskt tal

samtidigt skriva svenska svar i gränssnittet

Om native speech-API inte tillåter full kontroll:

fallback:

svensk textgenerering

separat engelsk TTS

Detta är ett hårt krav.

Vad Lexi ska kunna göra (funktionellt)
Kärnfunktioner (behålls från ada_v2)

Realtime röstinteraktion

Kameraåtkomst

Objektidentifiering (computer vision)

Hand/gesture-tracking (valbart, men kvar i arkitekturen)

Context / session-hantering

Modul-dispatcher (intent → rätt skill)

Nya primära arbetsmoduler (Lexi Core Skills)

PowerPoint-skapare

Input: ämne, målgrupp, längd, ton

Lexi:

skapar disposition

genererar slides

exporterar .pptx

Filen sparas lokalt och kan öppnas direkt

Rapport-sammanställare

Input:

dokument

anteckningar

länkar

röstinspelningar

Lexi:

normaliserar innehåll

sammanställer rapport på svenska

skapar sammanfattning + rekommendationer

LinkedIn-assistent

Anpassad tonalitet

Svenskt skriftspråk

Struktur:

hook

kärnbudskap

avslut

hashtags

Lexi minns hur användaren brukar skriva

Vad som ska tas bort helt

Följande delar från ada_v2 ska rensas bort, inte bara döljas:

CAD / build123d

STL-generering

Slicer-pipeline

3D-print (Orca, Moonraker, OctoPrint)

All UI kopplad till dessa funktioner

Lexi ska kännas fokuserad, inte som ett labb.

LLM-strategi (mycket viktigt)

ChatGPT 5.2 används som:

logik

resonemang

språk

personlighet

Lexi skickar:

sammanfattat användarminne

aktuell kontext

tillgängliga moduler

Modeller ska inte:

lagra rådata permanent

agera filsystem

vara “source of truth”

Lexi = hjärna + personlighet
Systemet = sanning + handling

Minne och relation

Lexi ska ha ett kontrollerat User Memory-lager:

språkpreferenser

tonalitet

arbetsstil

vad användaren ofta gör (presentationer, rapporter, sociala inlägg)

Minnet:

sammanfattas

versioneras

är redigerbart

aldrig rå dialogdump

Detta är avgörande för att bygga emotionell kontinuitet.

Namn, identitet och upplevelse

Namn: Lexi

Könsneutral, varm, professionell

Inte “AI-jargong”

Inte för teknisk i sitt språk

Uppträder som:

“en extremt kompetent personlig assistent”

Uppdrag till Google Antigravity (tydligt formulerat)

Forka ada_v2

Byt namn till Lexi överallt

Rensa bort CAD/3D-funktioner

Implementera modulär “Skills”-arkitektur

Lägg till tre core skills:

PowerPoint

Rapport

LinkedIn

Implementera språkpolicyn:

text = svenska

tal = engelska

Säkerställ installerbar desktop-app

Bibehåll kamera + objektidentifiering

Leverera ett stabilt fundament, inte en demo

Avslutande vision (kort)

Lexi är inte “ännu en chatbot”.
Lexi är den där assistenten man faktiskt börjar förlita sig på.

Hon:

skriver

sammanställer

förstår

minns

och gör jobbet klart