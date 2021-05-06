import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

const PrivacyModal = ({ isOpen, toggle }: any) => (
  <Modal isOpen={isOpen} toggle={toggle} size="lg">
    <ModalHeader toggle={toggle}></ModalHeader>
    <ModalBody className="text-center">
      <h1 className="text-base font-weight-light text-gray">
        pagoPA - Informativa sulla privacy
      </h1>
      <h2 className="h3 text-uppercase">
        Informativa sul trattamento dei dati personali
      </h2>
      <span className="text-gray">
        ai sensi degli artt. 13-14 del Regolamento (UE) 2016/679
      </span>
      <p className="px-24 py-14 text-left">
        Questa informativa privacy descrive come vengono trattati i dati
        personali di coloro che approdano al sito wisp2.pagopa.gov.it/ (il
        &quot;Sito&quot;) per effettuare un pagamento tramite pagoPA. Il Sito ti
        permette (i) di essere avvisato per email in merito alle transazioni che
        effettuerai sul sistema pagoPA e, se deciderai di registrarti a pagoPA,
        (ii) di effettuare la registrazione a pagoPA, (iii) di memorizzare
        alcune modalità di pagamento, (iv) di visualizzare lo storico delle tue
        transazioni, nonche&apos; (v) di recuperare la password e/o codice
        segreto da te scelti al momento della registrazione (di seguito il
        &quot;Servizio&quot;).
        <br />
        <br />
        Questa invece NON descrive il trattamento dei dati personali relativi ai
        tuoi pagamenti effettuati tramite pagoPA, rispetto ai quali gli Enti
        Creditori (ossia la pubblica amministrazione a favore del quale effettui
        un pagamento) e/o i Prestatori di Servizi di Pagamento (ossia la banca o
        altro istituto che hai scelto per effettuare un determinato pagamento),
        restano titolari autonomi del trattamento. Dovrai quindi rivolgerti a
        quest&apos;ultimi per informazioni sul trattamento dei tuoi dati.
        <br />
        <br />
        Titolare del trattamento dei dati
        <br />
        PagoPA S.p.A.
        <br />
        <br />
        Indirizzo: Piazza Colonna 370 - 00187 Roma
        <br />
        <br />
        Indirizzo PEC: pagopa@pec.governo.it
        <br />
        <br />
        La PagoPA S.p.A. è responsabile della protezione dei dati e per ogni
        esigenza si prega di scrivere a dpo@pagopa.it
        <br />
        <br />
        Responsabile del trattamento dei dati
        <br />
        SIA S.P.A.
        <br />
        Indirizzo: Via F. Gonin 36 - 20147 Milano
        <br />
        <br />
        Indirizzo PEC: direzione_net@pec.sia.eu
        <br />
        <br />
        Autorità di controllo
        <br />
        Garante per la protezione dei dati personali
        <br />
        Indirizzo e-mail: garante@gpdp.it
        <br />
        <br />
        Indirizzo PEC: protocollo@pec.gpdp.it
        <br />
        <br />
        Sito web: https://www.garanteprivacy.it
        <br />
        <br />
        Dati personali trattati, finalità e base giuridica del trattamento
        <br />
        I dati personali da noi trattati sono:
        <br />
        A) per gli utenti del Sito non registrati a pagoPA: l&apos;indirizzo
        email da te fornito quando accedi al Sito, oppure nome, cognome,
        indirizzo email, codice fiscale e numero di telefono nel caso in cui
        accedi al Sito tramite SPID.
        <br />
        B) per gli utenti che decidono di registrarsi a pagoPA:
        <br />
        (i) i dati da te inseriti al momento della tua registrazione a pagoPA,
        ossia nome, cognome, codice fiscale (in caso di registrazione tramite
        SPID), numero di cellulare (per ricevere i codici di verifica che dovrai
        immettere al momento della registrazione e per autorizzare un pagamento
        mediante carta), i predetti codici di verifica, la password, e qualora
        decidi di salvare uno o più metodi di pagamento anche i dati relativi al
        metodo di pagamento stesso;
        <br />
        (ii) il codice segreto a te assegnato dal sistema al momento della
        registrazione, che ti servirà per recuperare la password se l&apos;hai
        dimenticata;
        <br />
        (iii) i metodi di pagamento da te di volta in volta utilizzati per
        pagare tramite pagoPA, qualora decidi di salvare tale metodo di
        pagamento, che potranno essere da te modificati accedendo al tuo
        profilo;
        <br />
        (iv) lo storico delle transazioni da te effettuate tramite pagoPA, che
        puoi consultare accedendo al tuo profilo.
        <br />
        <br />
        Questi dati vengono trattati al fine di fornirti il Servizio (come sopra
        definito). La base giuridica del trattamento è l&apos;esecuzione del
        Servizio da te richiesto.
        <br />
        <br />
        Trattiamo anche i log di erogazione del Sito, al fine di garantire la
        sicurezza del sistema e delle relative transazioni, nonche&apos; per
        l&apos;esecuzione di un compito di interesse pubblico e connesso
        all&apos;esercizio di pubblici poteri.
        <br />
        <br />
        Non è prevista alcuna forma di processo decisionale automatizzato che
        comporti effetti giuridici sull&apos;interessato.
        <br />
        <br />
        Categorie di dati personali non ottenuti presso l&apos;interessato
        <br />
        I dati personali non ottenuti mediante inserimento da parte
        dell&apos;interessato sono esclusivamente gli indirizzi IP contenuti nei
        log di accesso al Sito
        <br />
        <br />
        Categorie di destinatari dei dati
        <br />
        Il titolare tratta i dati personali unitamente alle seguenti categorie
        di destinatari:
        <br />
        <br />
        SIA S.p.A., in qualità fornitore di servizi tecnici, responsabile del
        trattamento;
        <br />
        ai Prestatori di Servizi di pagamento aderenti a pagoPA, in qualità di
        titolare autonomo, qualora tale comunicazione del dato sia necessaria
        per permetterti di effettuare un pagamento tramite quel determinato
        Prestatore;
        <br />
        altri soggetti pubblici e autorità giudiziarie ai sensi e nei limiti
        della normativa vigente.
        <br />
        Il Titolare non intende trasferire i dati personali a Paesi terzi o a
        organizzazioni internazionali.
        <br />
        <br />
        Tempi di conservazione dei dati
        <br />
        I dati personali relativi agli utenti non registrati sono cancellati non
        appena la transazione si è conclusa.
        <br />
        I dati personali relativi agli utenti registrati a pagoPA sono
        conservati fino a che l&apos;account dell&apos;utente pagatore risulti
        attivo sul sistema pagoPA, salvo i dati che siamo tenuti a conservare
        per ottemperare a obblighi di legge. I codici di verifica che vengono
        conservati unicamente per il tempo tecnico strettamente necessario alla
        verifica.
        <br />
        <br />
        I log di erogazione del Sito vengono conservati per il tempo necessario
        alle finalità di sicurezza del sistema e comunque non oltre 12 mesi.
        <br />
        <br />
        Ti segnaliamo che anche a seguito della cancellazione di cui sopra, i
        tuoi dati personali potrebbero essere conservati da noi, in qualità di
        responsabili del trattamento, per conto degli EC e SPS.
        <br />
        <br />
        Diritti degli interessati
        <br />
        Gli interessati hanno il diritto di ottenere, ai sensi e nei limiti
        della normativa vigente, dai contitolari l&apos;accesso ai propri dati
        personali, la rettifica o la cancellazione degli stessi, la limitazione
        del trattamento e il diritto di opporsi allo stesso nonche&apos; il
        diritto alla portabilità dei dati personali. Gli interessati hanno,
        inoltre, diritto di revocare la propria registrazione, senza che tale
        revoca pregiudichi la liceità del trattamento prima della revoca stessa.
        <br />
        Le richieste sono presentate ai contitolari contattando il responsabile
        della protezione dei dati agli indirizzi sopra indicati.
        <br />
        Gli interessati, che ritengano che il trattamento dei propri dati
        personali avvenga in violazione di quanto previsto nel Regolamento,
        hanno il diritto di proporre reclamo al Garante per la protezione dei
        dati personali o di adire le opportune sedi giudiziarie.
        <br />
        <br />
        Cookie policy
        <br />
        Il Sito utilizza cookie tecnici di navigazione o di sessione che
        garantiscono la normale navigazione e fruizione del Sito (essi vengono
        memorizzati sul terminale dell&apos;utente sino alla chiusura del
        browser). Detti cookies sono utilizzati nella misura strettamente
        necessaria per rendere il Servizio. Essi garantiscono un&apos;adeguata
        fruizione del Sito e consentono all&apos;utente di navigare e utilizzare
        servizi e opzioni. Il loro utilizzo esula da scopi ulteriori e tali
        cookie sono installati direttamente dal titolare e gestore del Sito
        (rientrano, dunque, nella categoria di cookie di prima parte o
        proprietari).
        <br />
        Per l&apos;installazione dei suddetti cookie non è richiesto il
        preventivo consenso degli utenti, mentre resta fermo l&apos;obbligo di
        dare l&apos;informativa ai sensi dell&apos;art. 13 del Regolamento e
        dell&apos;art. 122 del D. Lgs. 196/2003 e ss.mm.ii. (Codice Privacy).
        <br />
        I cookie tecnici possono essere disattivati attraverso le impostazioni
        del browser (come di seguito indicato).
        <br />
        Il Sito non presenta altri tipi di cookie.
        <br />
        <br />
        Come disabilitare i cookie sul Sito mediante configurazione del browser
        <br />
        E&apos; possibile gestire le preferenze relative ai cookie attraverso le
        opzioni fornite dal proprio browser. Di seguito vengono forniti link che
        informano l&apos;utente su come disabilitare i cookie per i browser più
        utilizzati:
        <br />
        Internet Explorer:
        <br />
        https://support.microsoft.com/it-it/help/17442/windows-internet-explorer-delete-manage-cookies
        <br />
        Google Chrome:
        <br />
        https://support.google.com/chrome/answer/95647?hl=it-IT&p=cpn_cookies
        <br />
        Mozilla Firefox:
        <br />
        https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie
        <br />
        Apple Safari:
        <br />
        https://support.apple.com/kb/ph19214?locale=it_IT
        <br />
        <br />
        è altresì possibile gestire o disattivare i cookie attraverso il portale
        http://www.youronlinechoices.com/it/le-tue-scelte
        <br />
        <br />
        [19.03.2019]
      </p>
    </ModalBody>
  </Modal>
);

export default PrivacyModal;
