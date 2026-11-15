// ===================================================================
//  CATCH THE PHISH – herní data (levely a e-maily)
//  phish: true = podvodný e-mail, false = bezpečný
//  bad: 0 = v pořádku, 1 = podezřelé, 2 = pozor / ověř si
// ===================================================================

// Pomocná funkce pro odkaz, který jde prozkoumat lupou
function L(text, url, bad, hint) {
  return `<a class="lupa link" data-real="${url}" data-bad="${bad}" data-hint="${hint || ''}">${text}</a>`;
}

const LEVELS = [
  // ------------------------------------------------------------ LEVEL 1
  {
    icon: '👤',
    title: 'Kdo to píše?',
    subtitle: 'Falešní odesílatelé a podobné adresy',
    tip: 'Vždy zkontroluj celou adresu odesílatele. Podvodníci mění jedno písmenko: paypa1, netf1ix, rn místo m…',
    emails: [
      {
        name: 'Netflix', from: 'podpora@netf1ix-ucet.com', fromBad: 1,
        fromHint: 'Místo písmene „l“ je tu číslice „1“ – netf1ix. Netflix píše jen z domény netflix.com.',
        subject: 'Vaše platba byla zamítnuta ❗',
        body: `<p>Vážený zákazníku,</p>
<p>vaši poslední platbu se nepodařilo zpracovat. Pokud <b>do 24 hodin</b> neaktualizujete platební údaje, váš účet bude zrušen.</p>
<p>${L('Aktualizovat platbu', 'http://netf1ix-ucet.com/platba', 1, 'Odkaz vede na podvodnou doménu netf1ix-ucet.com, ne na netflix.com.')}</p>
<p>Tým Netflix</p>`,
        phish: true,
        explain: 'Adresa netf1ix-ucet.com má číslici 1 místo písmene l. K tomu oslovení „Vážený zákazníku“ (bez jména) a nátlak „do 24 hodin“ – klasické znaky phishingu.'
      },
      {
        name: 'Jana Nováková', from: 'jana.novakova@firma.cz', fromBad: 0,
        fromHint: 'Firemní adresa kolegyně – v pořádku.',
        subject: 'Oběd v pátek?',
        body: `<p>Ahoj,</p><p>nechceš jít v pátek na oběd do té nové pizzerie u nádraží? Kolem 12:00?</p><p>Jana</p>`,
        phish: false,
        explain: 'Obyčejná zpráva od kolegyně z firemní adresy. Žádný odkaz, příloha ani nátlak.'
      },
      {
        name: 'Česká pošta', from: 'info@ceska-posta-doruceni.xyz', fromBad: 1,
        fromHint: 'Česká pošta nepoužívá podivnou doménu .xyz. Pravé adresy končí na cpost.cz nebo postaonline.cz.',
        subject: 'Vaše zásilka nemohla být doručena 📦',
        body: `<p>Dobrý den,</p>
<p>vaše zásilka č. <b>CZ4471983</b> čeká na doplacení poplatku <b>29 Kč</b>. Bez zaplacení bude vrácena odesílateli.</p>
<p>${L('Zaplatit 29 Kč', 'http://ceska-posta-doruceni.xyz/platba', 1, 'Platba kartou na neznámé .xyz stránce = krádež údajů z karty.')}</p>`,
        phish: true,
        explain: 'Malý poplatek (29 Kč) je jen návnada – útočník chce číslo tvé karty. Doména .xyz s poštou nemá nic společného.'
      },
      {
        name: 'Alza.cz', from: 'objednavky@alza.cz', fromBad: 0,
        fromHint: 'Oficiální doména alza.cz.',
        subject: 'Potvrzení objednávky č. 2291847',
        body: `<p>Dobrý den,</p><p>děkujeme za objednávku: <b>Bezdrátová sluchátka JBL Tune 520BT</b>. Zboží vám pošleme do 2 pracovních dnů.</p>
<p>Stav objednávky můžete sledovat ${L('ve svém účtu', 'https://www.alza.cz/muj-ucet/objednavky', 0, 'Vede na oficiální web alza.cz.')}.</p><p>Tým Alza.cz</p>`,
        phish: false,
        explain: 'Pravá doména alza.cz, odkaz vede na alza.cz a e-mail po tobě nic nechce – jen informuje.'
      },
      {
        name: 'PayPal', from: 'service@paypa1-security.com', fromBad: 1,
        fromHint: 'paypa1 – na konci je číslice 1 místo písmene l! PayPal píše z paypal.com.',
        subject: 'Váš účet byl dočasně omezen',
        body: `<p>Vážený kliente,</p>
<p>zaznamenali jsme neobvyklou aktivitu na vašem účtu. Pro obnovení přístupu je nutné potvrdit vaši totožnost.</p>
<p>${L('Přihlásit se do PayPal', 'http://paypa1-security.com/verify', 1, 'Falešná přihlašovací stránka paypa1-security.com.')}</p>`,
        phish: true,
        explain: 'paypa1-security.com není PayPal. Strašení „účet omezen“ a výzva k přihlášení přes odkaz je nejčastější phishingový trik.'
      },
      {
        name: 'Google', from: 'no-reply@accounts.google.com', fromBad: 0,
        fromHint: 'accounts.google.com je oficiální adresa Googlu.',
        subject: 'Bezpečnostní upozornění: nové přihlášení',
        body: `<p>Do vašeho účtu bylo přihlášeno nové zařízení <b>Windows</b>.</p>
<p>Pokud jste to byli vy, nemusíte nic dělat. Pokud ne, ${L('zkontrolujte aktivitu', 'https://myaccount.google.com/notifications', 0, 'Oficiální stránka Googlu (myaccount.google.com).')}.</p>`,
        phish: false,
        explain: 'Pravá doména google.com, odkaz vede na google.com a nikdo nechce tvé heslo. „Pokud jste to byli vy, nic nedělejte“ – takhle píší skutečné služby.'
      }
    ],
    hard: [
      {
        name: 'Microsoft 365', from: 'no-reply@microsoft-365.support', fromBad: 1,
        fromHint: 'microsoft-365.support není doména Microsoftu. Ta končí na microsoft.com.',
        subject: 'Vaše schránka je plná (99 %)',
        body: `<p>Nové e-maily vám nebudou doručeny. Uvolněte místo zdarma kliknutím níže.</p>
<p>${L('Navýšit úložiště', 'https://microsoft-365.support/storage', 1, 'Vede na microsoft-365.support – cizí doména, i když má https.')}</p>`,
        phish: true,
        explain: 'Doména microsoft-365.support jen vypadá oficiálně. Zámeček (https) neznamená, že je stránka bezpečná – jen že je spojení šifrované.'
      },
      {
        name: 'ČEZ', from: 'info@cez.cz', fromBad: 0,
        fromHint: 'Oficiální doména cez.cz.',
        subject: 'Vyúčtování elektřiny je připraveno',
        body: `<p>Dobrý den,</p><p>vaše roční vyúčtování je k dispozici v zákaznickém portálu ${L('ČEZ ON-LINE', 'https://www.cez.cz/cez-online', 0, 'Oficiální stránka cez.cz.')}.</p>
<p><i>Upozorňujeme, že nikdy nežádáme hesla ani čísla karet e-mailem.</i></p>`,
        phish: false,
        explain: 'Pravá doména, odkaz na cez.cz, žádný nátlak ani žádost o údaje.'
      }
    ]
  },

  // ------------------------------------------------------------ LEVEL 2
  {
    icon: '🔗',
    title: 'Kam vede odkaz?',
    subtitle: 'Text odkazu vs. skutečná adresa',
    tip: 'Text odkazu může lhát! Vždy najeď myší na odkaz a podívej se, kam opravdu vede. Rozhoduje část těsně před prvním lomítkem „/“.',
    emails: [
      {
        name: 'Komerční banka', from: 'info@kb.cz', fromBad: 2,
        fromHint: 'Adresa vypadá pravá – ale odesílatele jde podvrhnout! Zkontroluj i odkaz.',
        subject: 'Nutné ověření účtu',
        body: `<p>Vážený kliente,</p><p>z bezpečnostních důvodů je nutné ověřit váš účet. Klikněte na odkaz:</p>
<p>${L('www.kb.cz/overeni', 'http://kb-cz-overeni.ru/login', 1, 'Text říká kb.cz, ale odkaz ve skutečnosti vede na kb-cz-overeni.ru (ruská doména)!')}</p>`,
        phish: true,
        explain: 'Text odkazu ukazuje www.kb.cz, ale skutečná adresa je kb-cz-overeni.ru. Banka tě nikdy nepožádá o „ověření účtu“ přes odkaz v e-mailu.'
      },
      {
        name: 'Spotify', from: 'no-reply@spotify.com', fromBad: 0,
        fromHint: 'Oficiální doména spotify.com.',
        subject: 'Tvůj podzimní mix je tady 🎧',
        body: `<p>Připravili jsme pro tebe nový playlist podle toho, co posloucháš.</p><p>${L('Poslechnout', 'https://open.spotify.com/playlist/podzimni-mix', 0, 'Vede na open.spotify.com – v pořádku.')}</p>`,
        phish: false,
        explain: 'Běžný newsletter. Odkaz vede na spotify.com a nikdo nic nechce.'
      },
      {
        name: 'Instagram', from: 'security@instagram-help.com', fromBad: 1,
        fromHint: 'instagram-help.com není Instagram. Pravý píše z instagram.com nebo mail.instagram.com.',
        subject: 'Někdo se pokusil přihlásit k vašemu účtu',
        body: `<p>Zaznamenali jsme pokus o přihlášení z Ruska. Pokud jste to nebyli vy, okamžitě zabezpečte účet.</p>
<p>${L('Zabezpečit účet', 'http://instagram.com.login-check.co/secure', 1, 'Skutečná doména je login-check.co! „instagram.com“ na začátku je jen maska.')}</p>`,
        phish: true,
        explain: 'Odkaz instagram.com.login-check.co patří doméně login-check.co. Rozhoduje konec adresy těsně před prvním lomítkem, ne začátek.'
      },
      {
        name: 'IT oddělení', from: 'it@firma.cz', fromBad: 0,
        fromHint: 'Firemní adresa IT oddělení.',
        subject: 'Plánovaná odstávka v sobotu',
        body: `<p>Dobrý den,</p><p>v sobotu od 8:00 do 12:00 proběhne údržba serverů. E-mail a sdílené disky nebudou dostupné.</p><p>Nemusíte nic dělat.</p><p>IT oddělení</p>`,
        phish: false,
        explain: 'Informační zpráva z firemní adresy bez odkazů a bez jakéhokoli požadavku.'
      },
      {
        name: 'Martin K.', from: 'martin.k1982@gmail.com', fromBad: 2,
        fromHint: 'Neznámá soukromá adresa. Znáš tohoto člověka?',
        subject: 'Jsi na těch fotkách ty?? 😂',
        body: `<p>Hele, tohle koluje po internetu, nejsi to náhodou ty??</p><p>${L('bit.ly/fotky-party', 'bit.ly → http://free-photo-view.click/facebook-login', 1, 'Zkrácený odkaz skrývá cíl. Vede na falešné přihlášení do Facebooku.')}</p>`,
        phish: true,
        explain: 'Neznámý odesílatel hraje na zvědavost a zkrácený odkaz (bit.ly) skrývá, kam doopravdy vede – na falešnou stránku, která krade hesla.'
      },
      {
        name: 'Booking.com', from: 'noreply@booking.com', fromBad: 0,
        fromHint: 'Oficiální doména booking.com.',
        subject: 'Rezervace potvrzena – Hotel Praha',
        body: `<p>Vaše rezervace je potvrzena: <b>Hotel Praha, 3 noci</b>.</p><p>${L('Spravovat rezervaci', 'https://secure.booking.com/myreservations.html', 0, 'secure.booking.com je oficiální subdoména booking.com.')}</p>`,
        phish: false,
        explain: 'Odkaz vede na secure.booking.com – doména je booking.com, „secure.“ je jen její část. V pořádku.'
      }
    ],
    hard: [
      {
        name: 'Apple', from: 'noreply@apple.com', fromBad: 2,
        fromHint: 'Adresa vypadá pravá, ale odesílatele jde podvrhnout. Ověř odkaz.',
        subject: 'Vaše Apple ID bylo uzamčeno',
        body: `<p>Vaše Apple ID bylo z bezpečnostních důvodů uzamčeno. Odemkněte jej zde:</p>
<p>${L('https://appleid.apple.com', 'https://appleid.apple.com.verify-id.info/unlock', 1, 'Skutečná doména je verify-id.info, ne apple.com!')}</p>`,
        phish: true,
        explain: 'I text odkazu může vypadat jako adresa. Skutečný cíl je appleid.apple.com.verify-id.info → doména verify-id.info.'
      },
      {
        name: 'Microsoft Teams', from: 'noreply@email.teams.microsoft.com', fromBad: 0,
        fromHint: 'email.teams.microsoft.com patří Microsoftu.',
        subject: 'Jana Nováková vás pozvala na schůzku',
        body: `<p><b>Porada týmu</b> – úterý 10:00–10:30</p><p>${L('Připojit se ke schůzce', 'https://teams.microsoft.com/l/meetup-join/porada-tymu', 0, 'Oficiální adresa teams.microsoft.com.')}</p>`,
        phish: false,
        explain: 'Pozvánka od kolegyně, odkaz vede na teams.microsoft.com. Vše sedí.'
      }
    ]
  },

  // ------------------------------------------------------------ LEVEL 3
  {
    icon: '📎',
    title: 'Nebezpečné přílohy',
    subtitle: 'Viry schované v souborech',
    tip: 'Pozor na přílohy .exe, .zip, .iso, .html, .docm a dvojité přípony (faktura.pdf.exe). Nikdy nepovoluj „makra“ ani „obsah“ v dokumentech od neznámých lidí.',
    emails: [
      {
        name: 'Fakturace', from: 'fakturace@dodavatel-cz.com', fromBad: 2,
        fromHint: 'Neznámý dodavatel. Čekáš od něj nějakou fakturu?',
        subject: 'Faktura č. 2024-1187 – UHRAĎTE IHNED',
        body: `<p>V příloze zasíláme fakturu po splatnosti. Pokud ji neuhradíte do zítřka, předáme věc exekutorovi.</p>`,
        att: [{ show: 'Faktura_2024-1187.pdf', real: 'Faktura_2024-1187.pdf.exe', bad: 1, hint: 'Dvojitá přípona! Ve skutečnosti je to .exe – program, ne PDF.' }],
        phish: true,
        explain: 'Soubor „Faktura.pdf“ je ve skutečnosti „Faktura.pdf.exe“ – spustitelný program (virus). Výhrůžka exekutorem má vyvolat paniku.'
      },
      {
        name: 'Petr Svoboda', from: 'petr.svoboda@firma.cz', fromBad: 0,
        fromHint: 'Firemní adresa kolegy.',
        subject: 'Prezentace z porady',
        body: `<p>Ahoj,</p><p>jak jsme se dneska domlouvali na poradě, posílám prezentaci. Mrkni hlavně na slide 5.</p><p>Díky, Petr</p>`,
        att: [{ show: 'prezentace_Q3.pptx', bad: 0, hint: 'Běžný soubor PowerPointu, který jsi od kolegy čekal.' }],
        phish: false,
        explain: 'Kolega z firemní adresy posílá soubor, o kterém jste mluvili. Běžná přípona .pptx.'
      },
      {
        name: 'DHL Express', from: 'dhl@dhl-tracking-info.net', fromBad: 1,
        fromHint: 'DHL píše z domény dhl.com, ne dhl-tracking-info.net.',
        subject: 'Oznámení o nedoručení zásilky',
        body: `<p>Kurýr vás dnes nezastihl. Informace o novém termínu doručení najdete v příloze.</p>`,
        att: [{ show: 'DHL_zasilka.zip', bad: 1, hint: 'ZIP archiv od falešného kurýra – často v sobě schovává virus.' }],
        phish: true,
        explain: 'Falešná doména a .zip příloha. Skuteční přepravci posílají číslo zásilky a odkaz na svůj web, ne archivy.'
      },
      {
        name: 'Lucie Malá', from: 'lucie.mala.cv@email.cz', fromBad: 2,
        fromHint: 'Neznámá adresa – uchazečka o práci?',
        subject: 'Reakce na inzerát – životopis',
        body: `<p>Dobrý den,</p><p>posílám svůj životopis. Pro správné zobrazení prosím klikněte nahoře na <b>„Povolit úpravy“</b> a <b>„Povolit obsah“</b>.</p>`,
        att: [{ show: 'CV_Lucie_Mala.docm', bad: 1, hint: '.docm = Word dokument s makry. „Povolit obsah“ spustí škodlivý kód.' }],
        phish: true,
        explain: 'Přípona .docm obsahuje makra a výzva „Povolit obsah“ je přesně to, co útočník potřebuje ke spuštění viru. Normální životopis je .pdf nebo .docx.'
      },
      {
        name: 'Máma', from: 'jirina.dvorakova@seznam.cz', fromBad: 0,
        fromHint: 'Známá adresa – tvoje máma.',
        subject: 'Fotky z Chorvatska ☀️',
        body: `<p>Ahoj zlatíčko,</p><p>posílám fotku z dovolené, moře bylo krásné! Zavolej mi večer.</p><p>Máma</p>`,
        att: [{ show: 'chorvatsko_plaz.jpg', bad: 0, hint: 'Obyčejný obrázek .jpg od známé osoby.' }],
        phish: false,
        explain: 'Známý odesílatel, osobní tón, obyčejný obrázek .jpg. V pořádku.'
      },
      {
        name: 'DocuSign', from: 'dse@docusign-sign.net', fromBad: 1,
        fromHint: 'Pravý DocuSign píše z docusign.net, ne docusign-sign.net.',
        subject: 'Máte dokument k podpisu',
        body: `<p>Byl vám zaslán dokument k elektronickému podpisu. Otevřete přílohu a přihlaste se svým e-mailem a heslem.</p>`,
        att: [{ show: 'Dokument_k_podpisu.html', bad: 1, hint: 'Příloha .html se otevře jako falešná přihlašovací stránka.' }],
        phish: true,
        explain: 'Příloha .html je falešná přihlašovací stránka, která ukradne heslo. Navíc falešná doména docusign-sign.net.'
      }
    ],
    hard: [
      {
        name: 'Skener – 3. patro', from: 'scanner@firma-cz.com', fromBad: 1,
        fromHint: 'firma-cz.com ≠ firma.cz! Útočník si koupil podobnou doménu.',
        subject: 'Naskenovaný dokument',
        body: `<p>Naskenováno zařízením RICOH MP 3055.<br>Počet stran: 2</p>`,
        att: [{ show: 'Scan_00127.iso', bad: 1, hint: '.iso je obraz disku – skener nikdy neposílá .iso. Uvnitř bývá program.' }],
        phish: true,
        explain: 'Doména firma-cz.com jen napodobuje naši firma.cz a skener nikdy neposílá soubory .iso.'
      },
      {
        name: 'O2', from: 'vyuctovani@o2.cz', fromBad: 0,
        fromHint: 'Oficiální doména o2.cz.',
        subject: 'Vyúčtování služeb za říjen',
        body: `<p>Dobrý den,</p><p>vyúčtování ve výši <b>499 Kč</b> bude strženo inkasem 20. 11. Nemusíte nic dělat.</p>`,
        att: [{ show: 'Vyuctovani_rijen.pdf', bad: 0, hint: 'Skutečné PDF, žádná dvojitá přípona.' }],
        phish: false,
        explain: 'Pravá doména, běžné PDF a žádný požadavek – jen informace.'
      }
    ]
  },

  // ------------------------------------------------------------ LEVEL 4
  {
    icon: '⏰',
    title: 'Nátlak a lákadla',
    subtitle: 'Výhry, výhrůžky a spěch',
    tip: 'Spěch, strach nebo nečekaná výhra = červená vlajka. Úřady, banky ani firmy nikdy nechtějí heslo nebo číslo karty e-mailem.',
    emails: [
      {
        name: 'Odměny pro zákazníky', from: 'winner@lucky-prize.top', fromBad: 1,
        fromHint: 'Neznámá doména .top – žádná skutečná firma.',
        subject: 'Gratulujeme! Vyhrál(a) jste iPhone 17 🎉',
        body: `<p>Byl(a) jste vybrán(a) jako <b>1 000 000. návštěvník</b>! Stačí zaplatit poštovné 1 Kč.</p><p><b>Nabídka platí jen 10 minut!</b></p>
<p>${L('Vyzvednout výhru', 'http://lucky-prize.top/claim', 1, 'Podvodná stránka – „výhra“ jen láká číslo karty.')}</p>`,
        phish: true,
        explain: 'Nikdy jsi nic nesoutěžil(a), výhra je až moc dobrá a „10 minut“ tě má donutit jednat bez přemýšlení.'
      },
      {
        name: 'Seznam.cz', from: 'podpora@seznam-ucet.cz', fromBad: 1,
        fromHint: 'Seznam píše z domény seznam.cz, ne seznam-ucet.cz.',
        subject: 'POSLEDNÍ VAROVÁNÍ: účet bude smazán',
        body: `<p>Váš e-mailový účet bude <b>do 24 hodin trvale smazán</b> kvůli porušení podmínek. Abyste tomu zabránili, potvrďte své heslo:</p>
<p>${L('Potvrdit heslo', 'http://seznam-ucet.cz/heslo', 1, 'Falešná stránka seznam-ucet.cz.')}</p>`,
        phish: true,
        explain: 'Velká písmena, výhrůžka smazáním a žádost o heslo. Žádná služba po tobě heslo e-mailem nechce.'
      },
      {
        name: 'Lidl', from: 'newsletter@lidl.cz', fromBad: 0,
        fromHint: 'Oficiální doména lidl.cz.',
        subject: 'Tento týden: jahody za 39,90 Kč 🍓',
        body: `<p>Čerstvé akce na celý týden!</p><p>${L('Prohlédnout leták', 'https://www.lidl.cz/c/letak', 0, 'Oficiální web lidl.cz.')}</p>`,
        phish: false,
        explain: 'Obyčejná reklama. Může být otravná, ale není nebezpečná – po tobě nic nechce.'
      },
      {
        name: 'Advokát James Wilson', from: 'j.wilson.law@outlook.com', fromBad: 2,
        fromHint: 'Advokát z bezplatné adresy outlook.com? Divné.',
        subject: 'Dědictví 4 500 000 USD',
        body: `<p>Drahý příteli,</p><p>jsem advokát zesnulý klient, který mít stejné příjmení jako vy. Zanechal <b>4 500 000 USD</b>. Pošlete mi vaše celé jméno, číslo účtu a kopie občanský průkaz a podělíme se.</p>`,
        phish: true,
        explain: 'Klasický „nigerijský“ podvod: nečekané miliony, rozbitá čeština a žádost o osobní údaje a doklady.'
      },
      {
        name: 'Finanční správa ČR', from: 'vratky@financni-sprava-cz.com', fromBad: 1,
        fromHint: 'Pravá Finanční správa používá financnisprava.cz.',
        subject: 'Máte nárok na vrácení přeplatku 3 240 Kč',
        body: `<p>Pro vyplacení přeplatku zadejte číslo své platební karty včetně CVV kódu:</p><p>${L('Získat přeplatek', 'http://financni-sprava-cz.com/vratka', 1, 'Falešná stránka – úřad nikdy nechce číslo karty.')}</p>`,
        phish: true,
        explain: 'Úřady nikdy nežádají číslo karty ani CVV kód e-mailem. Na vrácení peněz stačí číslo účtu, ne karta.'
      },
      {
        name: 'Tomáš Horák', from: 'tomas.horak@gmail.com', fromBad: 0,
        fromHint: 'Kamarádova obvyklá adresa.',
        subject: 'Lístky na sobotní koncert',
        body: `<p>Čau,</p><p>koupil jsem ty lístky, jak jsme se bavili. Tady je odkaz: ${L('Moje vstupenky', 'https://www.ticketportal.cz/moje-vstupenky', 0, 'Oficiální stránka ticketportal.cz.')}</p><p>Uvidíme se v sobotu!</p>`,
        phish: false,
        explain: 'Zpráva od známého, o které jste se domlouvali. Odkaz vede na skutečný ticketportal.cz.'
      }
    ],
    hard: [
      {
        name: 'Vodafone', from: 'zakaznik@vodafone.cz', fromBad: 2,
        fromHint: 'Adresa vypadá pravá – ale dá se podvrhnout. Zkontroluj odkaz.',
        subject: 'Věrnostní odměna 2 000 Kč pro vás',
        body: `<p>Jako poděkování za věrnost vám připíšeme 2 000 Kč. Pro připsání ověřte svou kartu:</p>
<p>${L('www.vodafone.cz/odmena', 'https://vodafone-odmeny.com/karta', 1, 'Skutečně vede na vodafone-odmeny.com – cizí doména.')}</p>`,
        phish: true,
        explain: 'Odesílatel vypadal pravě, ale odkaz vede na vodafone-odmeny.com a chce kartu. Kontroluj vždy odkaz, ne jen odesílatele.'
      },
      {
        name: 'Microsoft', from: 'account-security-noreply@accountprotection.microsoft.com', fromBad: 0,
        fromHint: 'Dlouhá, ale pravá adresa – končí na microsoft.com.',
        subject: 'Kód zabezpečení účtu Microsoft',
        body: `<p>Váš bezpečnostní kód je: <b>482913</b></p><p>Pokud jste o kód nežádali, můžete tento e-mail ignorovat. <b>Kód nikomu nesdělujte.</b></p>`,
        phish: false,
        explain: 'Adresa je dlouhá, ale končí na microsoft.com. E-mail nemá odkaz a sám radí kód nikomu nesdělovat.'
      }
    ]
  },

  // ------------------------------------------------------------ LEVEL 5
  {
    icon: '🏢',
    title: 'Velké finále',
    subtitle: 'Falešný šéf a útoky na firmu',
    tip: 'Když „šéf“ nebo „účtárna“ chce něco neobvyklého (dárkové karty, změnu účtu, heslo), ověř to telefonem nebo osobně.',
    emails: [
      {
        name: 'Karel Veselý (ředitel)', from: 'karel.vesely.ceo@gmail.com', fromBad: 1,
        fromHint: 'Ředitel píše z firemní adresy karel.vesely@firma.cz, ne z Gmailu!',
        subject: 'Potřebuju laskavost – urgentní',
        body: `<p>Ahoj,</p><p>jsem teď na jednání a nemůžu telefonovat. Potřebuju, abys <b>hned koupil(a) 5 dárkových karet Google Play</b> po 2 000 Kč a poslal(a) mi kódy. Je to překvapení pro klienty, <b>nikomu to neříkej</b>.</p><p>Díky, Karel</p>`,
        phish: true,
        explain: 'Falešný šéf z Gmailu, spěch, utajení a dárkové karty. Skutečný ředitel tohle nikdy nechce – vždy si to ověř telefonem.'
      },
      {
        name: 'Karel Veselý', from: 'karel.vesely@firma.cz', fromBad: 0,
        fromHint: 'Pravá firemní adresa ředitele.',
        subject: 'Vánoční večírek 12. 12. 🎄',
        body: `<p>Milí kolegové,</p><p>letošní vánoční večírek bude v pátek 12. 12. od 18:00 v restauraci U Zlatého lva. Těším se na vás!</p><p>Karel Veselý, ředitel</p>`,
        phish: false,
        explain: 'Pravá firemní adresa, běžná informace pro všechny, nic po tobě nechce.'
      },
      {
        name: 'Účtárna', from: 'ucetni@firma-cz.com', fromBad: 1,
        fromHint: 'firma-cz.com není naše doména firma.cz!',
        subject: 'Změna čísla účtu dodavatele',
        body: `<p>Dobrý den,</p><p>náš dodavatel ABC s.r.o. změnil bankovní účet. Všechny platby od dneška posílejte na účet <b>2801937465/2010</b>.</p><p>Vyřiďte prosím co nejdříve, dnes je splatnost.</p>`,
        phish: true,
        explain: 'Podobná doména firma-cz.com a změna čísla účtu – útočník chce, aby peníze šly jemu. Změnu účtu vždy ověř telefonicky.'
      },
      {
        name: 'IT podpora', from: 'it-podpora@firma.cz.helpdesk-reset.com', fromBad: 1,
        fromHint: 'Doména je helpdesk-reset.com – „firma.cz“ je jen začátek adresy, past!',
        subject: 'Vaše heslo dnes vyprší',
        body: `<p>Platnost vašeho hesla dnes vyprší. Pro zachování stávajícího hesla jej zadejte zde:</p><p>${L('Zachovat heslo', 'http://firma.cz.helpdesk-reset.com/keep', 1, 'Vede na helpdesk-reset.com, ne na firma.cz.')}</p>`,
        phish: true,
        explain: 'Skutečná doména je helpdesk-reset.com. IT oddělení se nikdy neptá na tvoje heslo.'
      },
      {
        name: 'LinkedIn', from: 'messages-noreply@linkedin.com', fromBad: 0,
        fromHint: 'Oficiální doména linkedin.com.',
        subject: 'Máte 1 novou zprávu',
        body: `<p><b>Petra Králová</b> vám poslala zprávu: „Dobrý den, děkuji za spojení…“</p><p>${L('Zobrazit zprávu', 'https://www.linkedin.com/messaging/', 0, 'Oficiální linkedin.com.')}</p>`,
        phish: false,
        explain: 'Běžné upozornění. Doména i odkaz patří LinkedInu.'
      },
      {
        name: 'Dropbox', from: 'no-reply@dropbox.com', fromBad: 0,
        fromHint: 'Oficiální doména dropbox.com.',
        subject: 'Jana Nováková s vámi sdílí „Rozpočet 2026.xlsx“',
        body: `<p>Jana Nováková (jana.novakova@firma.cz) s vámi sdílí soubor.</p><p>${L('Otevřít v Dropboxu', 'https://www.dropbox.com/scl/fi/rozpocet-2026.xlsx', 0, 'Pravá adresa dropbox.com.')}</p>`,
        phish: false,
        explain: 'Sdílení od známé kolegyně, odkaz vede na dropbox.com. V pořádku.'
      }
    ],
    hard: [
      {
        name: 'Microsoft Teams', from: 'noreply@teams-microsoft.online', fromBad: 1,
        fromHint: 'teams-microsoft.online není Microsoft (ten končí na microsoft.com).',
        subject: 'Máte 3 zmeškané zprávy od: Karel Veselý',
        body: `<p>Karel Veselý se vás snaží kontaktovat.</p><p>${L('Zobrazit v Teams', 'http://teams-microsoft.online/chat', 1, 'Falešná doména teams-microsoft.online.')}</p>`,
        phish: true,
        explain: 'Doména teams-microsoft.online jen napodobuje Microsoft. Jméno šéfa má vzbudit důvěru a spěch.'
      },
      {
        name: 'Rohlík.cz', from: 'info@rohlik.cz', fromBad: 0,
        fromHint: 'Oficiální doména rohlik.cz.',
        subject: 'Váš nákup dorazí dnes mezi 17:00–18:00',
        body: `<p>Kurýr je na cestě! Detail objednávky najdete ${L('ve svém účtu', 'https://www.rohlik.cz/objednavky', 0, 'Oficiální rohlik.cz.')}.</p>`,
        phish: false,
        explain: 'Pravá doména, odkaz na rohlik.cz, žádný požadavek na platbu ani údaje.'
      }
    ]
  }
];
