// Guides: acquiring and merchants. Schema: see CLAUDE.md ("Guide schema").
(() => {
const { R, pick } = DCC;
Object.assign(window.DCC_KB = window.DCC_KB || {}, {
'terminals': {
  brief: ['A payment terminal reads the card, runs the EMV conversation, collects a PIN if needed and sends the request to the acquirer.', 'Terminals range from countertop devices to ordinary phones that accept taps.', 'Every terminal’s software must be certified for every network it supports.'],
  sec: [
    ['Kinds of terminal', '<p><strong>Countertop</strong> devices wired to a till. <strong>Portable</strong> ones for restaurants and deliveries. <strong>Integrated</strong> PIN pads driven by a retailer’s own point-of-sale software. <strong>Unattended</strong> readers in kiosks, fuel pumps, vending machines, car parks and EV chargers. <strong>Soft POS</strong>: an app that turns an ordinary phone into a contactless terminal, with PIN entry on the screen.</p>'],
    ['What is inside', '<p>Card readers for chip, contactless and stripe; a secure PIN pad that encrypts the PIN the instant it is typed; EMV kernels for each network; keys for encrypting card data (point-to-point encryption, so the merchant’s own systems never see it); and a connection to the acquirer or gateway.</p>'],
    ['Certification', '<p>Terminals pass three levels of testing: Level 1 for the hardware reader, Level 2 for the EMV kernel software, and Level 3 for the complete set-up with a specific acquirer and network. Any change in software can mean recertifying, which is why terminal fleets update slowly.</p>'],
    ['Managing a fleet', '<p>A large retailer runs thousands of terminals. Remote management pushes software and key updates, monitors failures, and swaps faulty units. Key injection, the loading of encryption keys, is done in secure facilities.</p>'],
    ['Beyond cards', `<p>${pick({ in: 'In India the most common acceptance device is not a terminal but a printed QR code and a small speaker, the “soundbox”, that announces each UPI payment aloud. Card terminals increasingly accept UPI QR as well.', us: 'In the US, terminals also handle EBT benefits, gift cards and loyalty, and increasingly display QR codes for pay-by-bank or wallet payments.', uk: 'In the UK most terminals accept contactless up to £100 and phone payments without a limit; Soft POS is common among small traders.', au: 'Australian terminals route co-badged debit cards to eftpos or the international network under least-cost routing.' })}</p>`]
  ],
  facts: [['Certification', 'L1 hardware, L2 kernel, L3 end to end'], ['PIN security', 'Encrypted in the PIN pad, never in clear'], ['Card data', 'Point-to-point encryption to the processor'], ['Soft POS', 'Phones as terminals, contactless only']],
  quiz: [['Why do terminal software updates roll out slowly?', ['Every change may need recertification for each network', 'Merchants refuse updates', 'Networks forbid updates'], ''], ['What does point-to-point encryption protect?', ['Card data between the terminal and the processor, so the merchant’s systems never see it', 'The receipt', 'The PIN only'], '']],
  see: ['emv', 'ch27', 'pci-dss', 'payment-methods']
},
'gateways': {
  brief: ['A payment gateway is the online equivalent of a terminal: it captures card details at checkout and sends them to a processor.', 'Large merchants add an orchestration layer that chooses, payment by payment, which processor to use.', 'Smart routing and retries can lift approval rates by several points.'],
  sec: [
    ['What a gateway does', '<p>It hosts or embeds the card form, tokenises the card, runs fraud checks and 3-D Secure, formats the request for the processor, and returns the result to the checkout. It also handles refunds, captures and voids, and stores cards for repeat customers as tokens.</p>'],
    ['Orchestration', '<p>A merchant connected to several processors can route each payment by cost, by country (local acquiring), by card type, or by which processor is currently approving most. If a payment is declined for a soft reason, it can retry on another route. The merchant keeps its stored cards in a vault it controls, so it can switch processors without asking customers to re-enter details.</p>'],
    ['Retries, and their limits', '<p>Retrying soft declines works; retrying hard declines does not and annoys the networks. Both Visa and Mastercard charge for excessive retries on the same card. Good retry logic reads the response code, waits, and tries a different route or a token instead of the card number.</p>'],
    ['Measuring it', '<p>The figures that matter: <strong>authorisation rate</strong> (approved ÷ attempted), <strong>checkout conversion</strong>, the <strong>cost per successful payment</strong>, and <strong>false declines</strong>, good customers turned away. A one-point rise in approval rate on a large online business is worth more than most fee negotiations.</p>']
  ],
  facts: [['Gateway', 'Captures, tokenises, routes, returns result'], ['Orchestration', 'Routing across several processors'], ['Main metric', 'Authorisation rate'], ['Retry rule', 'Soft declines only']],
  quiz: [['Why would a merchant keep its own card vault?', ['To switch or add processors without asking customers for their cards again', 'Because the law requires it', 'To avoid PCI DSS completely'], 'Holding card data brings PCI scope, so many use a third-party vault they control.'], ['Which declines are worth retrying?', ['Soft declines such as insufficient funds or issuer unavailable', 'Lost or stolen card', 'Invalid card number'], '']],
  see: ['ch27', 'ch23', 'cross-border', 'stored-credentials']
},
'mcc': {
  brief: ['A merchant category code is a four-digit number that says what kind of business a merchant is.', 'It decides the merchant’s interchange rate, your reward category, and many fraud and compliance rules.', 'The acquirer assigns it when the merchant signs up.'],
  sec: [
    ['Examples', '<p>5411 supermarkets. 5812 restaurants. 5814 fast food. 5541 fuel stations. 4111 commuter transport. 4511 airlines. 7011 hotels. 5732 electronics. 6011 ATM cash. 6051 quasi-cash, including some crypto purchases. 7995 gambling. 8398 charities. The list is based on an ISO standard and extended by each network.</p>'],
    ['What it controls', '<p><strong>Pricing</strong>: supermarkets, fuel and charities often get lower interchange. <strong>Rewards</strong>: “5% on dining” means 5% on dining MCCs, whatever the shop calls itself. <strong>Restrictions</strong>: some cards block gambling or cash-like MCCs; corporate purchasing cards are limited to approved categories. <strong>Risk</strong>: some MCCs are classed high-risk, with stricter monitoring.</p>'],
    ['When it surprises you', '<p>A café inside a bookshop codes as a bookshop, so no dining bonus. A wholesale club may not code as a supermarket. A hotel restaurant codes as a hotel. Your rewards follow the code, not the reality.</p>'],
    ['Miscoding', '<p>Deliberately using the wrong MCC, for example to disguise gambling or to qualify for lower interchange, breaches network rules and is a form of transaction laundering. Acquirers must review MCCs at onboarding and when a merchant’s business changes.</p>']
  ],
  facts: [['Length', '4 digits'], ['Assigned by', 'The acquirer'], ['Controls', 'Interchange, rewards, restrictions, risk rules'], ['Where it travels', 'ISO 8583 field 18']],
  quiz: [['Your “5% on dining” card earns 1% at a hotel restaurant. Why?', ['The merchant codes as a hotel, not a restaurant', 'The bank made an error', 'Dining excludes dinner'], ''], ['Who assigns a merchant’s MCC?', ['The acquirer', 'The cardholder', 'The government'], '']],
  see: ['ch9', 'ch26', 'ch23', 'scheme-rules']
},
'stored-credentials': {
  brief: ['When a merchant saves your card to charge later, network rules call it a stored credential.', 'Payments you start are customer-initiated; payments the merchant starts on its own (subscriptions, top-ups, delayed charges) are merchant-initiated.', 'Account updater services and network tokens keep stored cards working after a card is reissued.'],
  sec: [
    ['Two kinds of payment', '<p>A <strong>customer-initiated transaction</strong> (CIT) is one you start: checking out with a saved card. A <strong>merchant-initiated transaction</strong> (MIT) is one the merchant starts under an agreement you made earlier: a monthly subscription, an instalment, a hotel no-show charge, an automatic top-up. The first payment of an agreement must be a CIT, and later MITs carry a reference to it.</p>'],
    ['Why the labels matter', '<p>Issuers score the two differently and authentication rules treat them differently: MITs are generally outside strong-authentication requirements because you are not present. Mislabelling either way leads to declines or to disputes the merchant cannot win.</p>'],
    ['Keeping cards alive', '<p>Cards are reissued for expiry, loss and fraud. <strong>Account updater</strong> services let merchants fetch new card details from the network. <strong>Network tokens</strong> go further: the token stays the same and the network maps it to the new card automatically. Both cut involuntary churn, subscriptions failing for no reason the customer chose.</p>'],
    ['Free trials and cancellations', '<p>Network rules require merchants offering free trials that convert to paid subscriptions to remind customers before the first charge and make cancellation easy, and several countries’ laws add “click to cancel” requirements. A charge after a valid cancellation is a strong basis for a dispute.</p>']
  ],
  reg: { in: 'Indian rules require authentication when a recurring card mandate is set up, a notification at least 24 hours before each debit, and an easy way to cancel. Debits up to ₹15,000 can run without fresh authentication, and up to ₹1 lakh for insurance, mutual funds and card bill payments. Since 2022 merchants cannot store card numbers, only tokens.', us: 'Subscriptions are governed by network rules and state auto-renewal laws; the federal “click to cancel” rule was struck down in 2025, but many states require simple online cancellation.', uk: 'You can cancel a continuous payment authority directly with your card issuer, and the issuer must stop the payments. Merchant-initiated payments are outside strong customer authentication.', au: 'You can ask your bank to cancel a recurring card payment, and it must do so promptly; PayTo offers a bank-account alternative with mandates you control in your app.' },
  quiz: [['Your gym charges your saved card monthly. What kind of transaction is that?', ['Merchant-initiated', 'Customer-initiated', 'Card-present'], ''], ['Why do some subscriptions keep working after your card is replaced?', ['Account updater or network tokens supplied the new details', 'The old card still works', 'The merchant guessed'], '']],
  see: ['direct-debit', 'ch28', 'ch12', 'gateways']
},
'reconciliation': {
  brief: ['Reconciliation is proving that every sale became money in the bank, less exactly the fees you agreed.', 'It matches three records: the sale, the processor’s settlement report and the bank credit.', 'Most payment operations work is explaining the differences.'],
  sec: [
    ['The three-way match', '<p><strong>Sales</strong> from the till or order system. The acquirer’s <strong>settlement report</strong>, listing each transaction, its fees and the payout it belongs to. The <strong>bank statement</strong> credit. One payout usually covers many transactions across several days, net of refunds, chargebacks and fees, so the match is many-to-one.</p>'],
    ['Why they differ', '<p>Timing (a sale on Sunday paid on Tuesday). Fees deducted at source. Refunds and chargebacks netted from payouts. Reserves held back. Currency conversion. Authorisations never captured. Captures for a different amount than authorised (tips, partial shipments). Each needs its own explanation.</p>'],
    ['Fees under the microscope', '<p>On interchange-plus pricing, every transaction’s interchange category is visible. Transactions that “downgrade” to a more expensive category because of missing data or late settlement are a common, recoverable leak.</p>'],
    ['On the issuer side', '<p>Issuers reconcile too: authorisations against clearing records, clearing against network settlement, and the card ledger against the bank’s general ledger. Unmatched items go to suspense accounts and are worked daily.</p>'],
    ['Why it matters', '<p>Unreconciled money is money you cannot account for, to an auditor, a regulator or yourself. Fintechs that failed to reconcile customer balances with the funds actually held at their bank have ended up unable to say who owned what.</p>']
  ],
  facts: [['Three records', 'Sale, settlement report, bank credit'], ['Common differences', 'Timing, fees, refunds, chargebacks, reserves, FX'], ['Leak to check', 'Interchange downgrades'], ['Unmatched items', 'Suspense accounts']],
  quiz: [['Why can’t one sale usually be matched to one bank credit?', ['Payouts are net batches of many transactions, fees, refunds and chargebacks', 'Banks round amounts', 'Sales are paid twice'], ''], ['What is an interchange downgrade?', ['A transaction priced at a more expensive category, often for missing data', 'A refund', 'A lower fee'], '']],
  see: ['ch25', 'ledgers', 'ch26', 'baas']
},
'payment-methods': {
  brief: ['Cards are one option at the checkout. Wallets, bank payments, pay-later and local methods compete with them.', 'Which methods win varies enormously by country.', 'Offering the methods customers expect is one of the easiest ways to raise sales.'],
  sec: [
    ['Wallets that wrap cards', '<p>Apple Pay, Google Pay and Samsung Pay store tokenised cards. To the merchant’s acquirer they are card payments with better data and authentication.</p>'],
    ['Wallets that hold money', '<p>PayPal, Alipay, WeChat Pay and Paytm can hold a balance or pull from a bank account. They act as the merchant’s counterparty, with their own fees and buyer protection.</p>'],
    ['Bank payments', `<p>Account-to-account payments: UPI in India, Pix in Brazil, iDEAL and Wero in Europe, Pay by Bank through open banking in the UK, PayTo in Australia, and pay-by-bank in the US over ACH or instant rails. They cost merchants less and confirm instantly, but offer weaker buyer protection. ${pick({ in: 'In India UPI is the default for most online and in-store payments.', us: 'In the US cards still dominate online.', uk: 'In the UK Pay by Bank is growing for bills and larger payments.', au: 'In Australia PayTo is replacing direct debits for recurring payments.' })}</p>`],
    ['Local favourites', '<p>Cash vouchers paid at a shop (Boleto in Brazil, OXXO in Mexico), cash on delivery (still significant in India and parts of Asia), domestic card schemes, and instalment cards in Latin America. A checkout built only for international cards loses these customers.</p>'],
    ['Choosing what to offer', '<p>Look at where customers are, the average basket, the risk of fraud and refunds, and settlement speed. Each method also brings its own disputes process and reconciliation work.</p>']
  ],
  quiz: [['To the acquirer, an Apple Pay payment is…', ['A tokenised card payment', 'A bank transfer', 'A wallet balance transfer'], ''], ['What do bank payments give up compared with cards?', ['Chargeback-style buyer protection', 'Speed', 'Low cost'], '']],
  see: ['ch17', 'instant-payments', 'open-banking', 'bnpl']
}
});
})();
