# 🎣 CATCH THE PHISH

**Vzdělávací hra o kybernetické bezpečnosti – nauč se poznat podvodné e-maily (phishing).**

Hra běží čistě v prohlížeči (HTML + CSS + JavaScript), nepotřebuje internet ani instalaci.
Stačí otevřít soubor `index.html`.

---

## 🎯 Záměr – co hra učí

Phishing je nejčastější způsob, jak podvodníci kradou hesla, peníze a osobní údaje. Nejde přitom o „hackování“,
ale o **oklamání člověka** (sociální inženýrství). Proti tomu nepomůže antivir – pomůže jen pozorný uživatel.

Hra je určená pro **běžné lidi**, ne pro IT odborníky. Učí 5 jednoduchých dovedností:

| Den (level) | Téma | Co se hráč naučí |
|---|---|---|
| 1. Kdo to píše? 👤 | Falešní odesílatelé | Poznat podvrženou adresu (`paypa1.com`, `netf1ix`, `.xyz`) |
| 2. Kam vede odkaz? 🔗 | Odkazy | Text odkazu může lhát, kontrolovat skutečnou adresu, triky se subdoménami a zkracovači (bit.ly) |
| 3. Nebezpečné přílohy 📎 | Přílohy | Dvojité přípony (`faktura.pdf.exe`), `.zip`, `.iso`, `.html`, makra v `.docm` |
| 4. Nátlak a lákadla ⏰ | Psychologie útoku | Spěch, strach, falešné výhry, dědictví, žádosti o kartu/heslo |
| 5. Velké finále 🏢 | Útoky na firmu | Falešný šéf (dárkové karty), změna čísla účtu, falešné IT, podobné domény |

Hra **neučí jen „všechno je podvod“** – v každém dni jsou i skutečné, bezpečné e-maily (od kolegů, e-shopů,
Googlu…). Hráč se tak učí rozlišovat, ne panikařit. Za označení bezpečného e-mailu jako phishing („falešný poplach“)
se body nedostávají.

## 🕹️ Jak se hraje

1. Vyber obtížnost **Normal** nebo **Hard** a level (den).
2. Do herní e-mailové schránky přicházejí zprávy jedna po druhé.
3. 🔍 **Detektivní lupa** – najetím myši (na mobilu klepnutím) na *odesílatele*, *odkaz* nebo *přílohu*
   zjistíš, co se za nimi doopravdy skrývá (skutečná adresa, skutečný cíl odkazu, celý název souboru).
4. Rozhodni: **✅ Bezpečný** nebo **🎣 Phishing**.
5. Hned dostaneš zpětnou vazbu – jestli máš pravdu a **čeho sis měl(a) všimnout**.
6. Na konci dne se zobrazí statistika, pravidlo dne a graf pokroku.

### Levely
- Na začátku je odemčený jen **Den 1**.
- Další level se odemkne, až ten předchozí **splníš**.
- Dokončené levely si pak můžeš **vybrat a hrát znovu kdykoliv** (např. pro lepší skóre).
- Každý režim (Normal / Hard) má svůj vlastní postup.

### Obtížnosti

| | 🙂 Normal | 😈 Hard |
|---|---|---|
| E-mailů za den | 6 | 8 (+2 zákeřnější) |
| Lupa | ukáže skutečnou adresu **a napoví** (✔ v pořádku / ⚠️ podezřelé / 🤔 ověř si) | ukáže jen skutečnou adresu – **posoudit musíš sám** |
| Časový limit | žádný | **30 s na e-mail** (zbylý čas = bonusové body) |
| Pro splnění levelu | aspoň 4 z 6 správně | aspoň 7 z 8 správně |

Hard mode obsahuje i chytáky typu: pravá adresa odesílatele, ale podvodný odkaz, nebo naopak dlouhá a divně
vypadající adresa, která je ve skutečnosti pravá (`accountprotection.microsoft.com`).

---

## 😄 Proč je to zábavné

- **Role detektiva** – hráč nečte poučky, ale sám pátrá po stopách pomocí lupy. Odhalení podvodu je malý „aha moment“.
- **Realistická e-mailová schránka** – vypadá jako skutečný e-mailový klient, takže se naučené přenáší do reálného života.
- **Okamžitá zpětná vazba** – po každém rozhodnutí hráč hned ví, jestli měl pravdu a proč. Chyba se tak mění v poučení.
- **Postup a odemykání levelů** – motivace „ještě jeden den“.
- **Body a časový tlak v Hard módu** – výzva pro ty, kterým Normal přijde snadný. Časový limit navíc simuluje reálný
  stres, na který útočníci spoléhají.
- **Humor a známé situace** – výhra iPhonu, „dědictví po vzdáleném příbuzném“, šéf, který chce dárkové karty…
- **Krátké kolo** – jeden den trvá 2–4 minuty, hodí se i do výuky.

## 📈 Měřitelnost pokroku

Hra měří pokrok na třech úrovních:

**1. Po každém e-mailu** – správně / špatně + vysvětlení.

**2. Na konci každého dne (statistika):**
- 🎯 **Přesnost** – kolik procent e-mailů hráč zařadil správně
- 🎣 **Zachycené útoky** – kolik phishingů odhalil (např. 4/4)
- ✅ **Správně propuštěné** – kolik bezpečných e-mailů nechal projít
- 😱 **Nachytal(a) ses** – počet phishingů, na které skočil, **s vysvětlením, čeho si měl všimnout**
- 🚨 **Falešné poplachy** – bezpečné e-maily označené jako podvod
- 🔍 **Prozkoumáno lupou** – kolikrát hráč aktivně zkoumal stopy (ukazuje, jestli si osvojuje návyk „nejdřív zkontroluj“)
- ⭐ **Body**

**3. Dlouhodobě – Index bezpečnostní gramotnosti (0–100):**
- Počítá se z **nejlepšího výsledku** v každém levelu:
  - Normal levely dohromady = max **60 bodů** (každý level 12 b × přesnost)
  - Hard levely dohromady = max **40 bodů** (každý level 8 b × přesnost)
- Protože se počítá z nejlepších výsledků, **index nikdy neklesá** – s každým lepším kolem roste.
- Vývoj indexu se zobrazuje jako **graf** v menu i na konci každého dne.
- 100/100 = všechny levely v obou režimech bez chyby.

Postup se ukládá do prohlížeče (`localStorage`), takže zůstane i po zavření stránky.
V menu jde postup smazat tlačítkem „Smazat postup“.

---

## 📁 Struktura projektu

```
catch-the-phish/
├── index.html   – obrazovky hry (menu, schránka, výsledky, nápověda)
├── style.css    – vzhled
├── emails.js    – obsah: levely a e-maily (snadno se přidávají nové)
├── game.js      – herní logika, lupa, vyhodnocení, graf, ukládání
└── README.md    – tento popis
```

### Jak přidat nový e-mail
V `emails.js` stačí do pole `emails` (Normal) nebo `hard` (jen Hard) přidat objekt:

```js
{
  name: 'Banka', from: 'info@banka-overeni.com', fromBad: 1,
  fromHint: 'Proč je to podezřelé…',
  subject: 'Předmět',
  body: `<p>Text… ${L('text odkazu', 'skutečná-url', 1, 'nápověda')}</p>`,
  att: [{ show: 'soubor.pdf', real: 'soubor.pdf.exe', bad: 1, hint: 'nápověda' }],
  phish: true,
  explain: 'Vysvětlení, čeho si všimnout.'
}
```

## ▶️ Spuštění
Otevři `index.html` v libovolném moderním prohlížeči (Chrome, Edge, Firefox). Hotovo. 🎣

> Všechny e-maily, jména a firmy ve hře jsou smyšlené a slouží jen pro výuku. Odkazy ve hře nikam nevedou.
