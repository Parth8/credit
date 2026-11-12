// Guides: banking architecture. Schema: see CLAUDE.md ("Guide schema").
(() => {
const { R, pick, money } = DCC;
Object.assign(window.DCC_KB = window.DCC_KB || {}, {
'how-banks-work': {
  brief: ['A bank borrows short (your deposits) and lends long (mortgages, loans, cards), and earns the difference.', 'When a bank lends, it creates a new deposit. Lending creates money; it does not just pass savings along.', 'Capital and liquidity rules exist because that model can fail fast.'],
  sec: [
    ['The balance sheet', '<p>On one side, <strong>assets</strong>: loans, securities, reserves at the central bank, cash. On the other, <strong>liabilities</strong>: customer deposits, borrowing from other banks and markets. The difference is <strong>equity</strong>, the shareholders’ capital, which absorbs losses. Your deposit is the bank’s liability: it owes you that money.</p>'],
    ['Where the profit comes from', '<p><strong>Net interest income</strong>: interest earned on loans minus interest paid on deposits, usually the largest line. <strong>Fees</strong>: cards, accounts, payments, foreign exchange, wealth management. Minus operating costs and credit losses. Cards are attractive because they earn both interest and fees.</p>'],
    ['Lending creates deposits', '<p>When a bank approves a ' + money(R.a.big) + ' loan, it does not hand over someone else’s savings. It credits your account with a new ' + money(R.a.big) + ' deposit and books a matching loan. New money has been created. What limits this is not a stock of savings but capital rules, the cost of funding, demand from creditworthy borrowers and central bank policy.</p>'],
    ['Why banks fail', '<p><strong>Solvency</strong>: losses larger than capital. <strong>Liquidity</strong>: depositors want money back faster than assets can be sold. In 2023 Silicon Valley Bank lost a large share of its deposits in a day, made faster by mobile banking and social media. Basel III rules require capital ratios and liquidity buffers that cover a month of stressed outflows.</p>'],
    ['Deposit insurance', `<p>${pick({ in: 'DICGC insures deposits up to ₹5 lakh per depositor per bank.', us: 'The FDIC insures deposits up to $250,000 per depositor, per bank, per ownership category.', uk: 'The FSCS protects deposits up to £120,000 per person per banking licence, a limit raised in December 2025.', au: 'The Financial Claims Scheme guarantees deposits up to A$250,000 per account holder per authorised deposit-taking institution.' })} Money held with a payment app or e-money firm is usually <em>not</em> covered in the same way; it is protected by safeguarding instead.</p>`]
  ],
  facts: [['Main income', 'Net interest margin'], ['Your deposit', 'A liability of the bank'], ['New loan', 'Creates a new deposit'], ['Safety rules', 'Capital, liquidity, deposit insurance']],
  quiz: [['When a bank makes a new loan, what happens to deposits in the system?', ['They increase', 'They decrease', 'They stay the same'], ''], ['Which side of the bank’s balance sheet is your savings account on?', ['Liabilities', 'Assets', 'Equity'], '']],
  see: ['ledgers', 'central-bank-money', 'credit-risk', 'licences']
},
'ledgers': {
  brief: ['Every payment system, at bottom, is a ledger: a record of who owes whom.', 'Double-entry bookkeeping records every movement twice, once as a debit and once as a credit, so the books always balance.', 'Most payment bugs and fintech failures are ledger failures.'],
  flow: { nodes: [['🙂', 'Your account', 'liability'], ['🏦', 'Bank cash', 'asset'], ['🔁', 'Clearing account', 'in transit'], ['🏪', 'Shop’s account', 'liability']], steps: [
    [1, 0, '+100', 'res', 'You deposit 100', 'The bank debits its cash (an asset rises) and credits your account (a liability rises). Two entries, equal and opposite.'],
    [0, 2, '−100', 'req', 'You pay a shop that banks elsewhere', 'The bank debits your account (its liability to you falls) and credits a clearing account that represents money in transit.'],
    [2, 1, 'settle', 'money', 'Settlement', 'When the payment settles with the shop’s bank, the clearing account is debited and the bank’s reserves are credited (they fall). The clearing account returns to zero: if it does not, something is wrong.'],
    [2, 3, '+100', 'res', 'At the shop’s bank', 'The mirror image: its reserves rise, and the shop’s account is credited. Across both banks every entry has a partner.']] },
  sec: [
    ['Debit and credit are not good and bad', '<p>In accounting a debit increases an asset and decreases a liability; a credit does the opposite. Your bank statement is written from the bank’s point of view, where your balance is a liability, so money in is a credit and money out a debit. That is why the words feel backwards.</p>'],
    ['Balances you see', '<p><strong>Ledger balance</strong>: posted entries only. <strong>Available balance</strong>: ledger balance minus holds plus any overdraft. Card authorisations are recorded as memo entries that reduce available balance without touching the ledger until clearing.</p>'],
    ['General ledger and sub-ledgers', '<p>Each product system (cards, loans, deposits) keeps a detailed sub-ledger of accounts. Totals post to the bank’s general ledger. Reconciling the two daily is how a bank knows it has not lost money in between.</p>'],
    ['Rules for building one', '<p>Entries are immutable: mistakes are corrected with reversing entries, never edits. Every movement balances. Every request carries an idempotency key, so a retried message cannot post twice. Every balance can be rebuilt from its entries.</p>'],
    ['When it goes wrong', '<p>When a fintech’s own records of customer balances do not match the funds held at its partner bank, nobody can say who owns what. That is what happened when a banking-as-a-service middleware firm collapsed in 2024: tens of thousands of customers were locked out while the books were rebuilt.</p>']
  ],
  facts: [['Golden rule', 'Debits equal credits, always'], ['Corrections', 'Reversing entries, never edits'], ['Available balance', 'Ledger balance − holds (+ overdraft)'], ['Safety device', 'Idempotency keys']],
  quiz: [['Why does a bank statement call money coming in a credit?', ['From the bank’s view your balance is a liability, which a credit increases', 'Credits are good news', 'It is a historical mistake'], ''], ['How is a wrong ledger entry fixed?', ['With a reversing entry', 'By editing it', 'By deleting it'], '']],
  see: ['reconciliation', 'core-banking', 'baas', 'ch24']
},
'core-banking': {
  brief: ['A core banking system holds a bank’s customer accounts and the rules that run them.', 'Many large banks still run cores built decades ago, often on mainframes.', 'Replacing a core is among the riskiest projects in any industry, so banks increasingly build around it instead.'],
  sec: [
    ['What it does', '<p>Customer and account records, product definitions, interest calculation and accrual, fees, posting of transactions, end-of-day processing, statements and the feed to the general ledger. Payments, cards, lending origination and digital channels connect to it.</p>'],
    ['Batch and real time', '<p>Traditional cores do much of their work in an overnight batch: posting the day, accruing interest, producing reports. Customers increasingly expect real-time balances and instant payments at 3 a.m., which batch-era cores support with workarounds such as memo posting and shadow ledgers.</p>'],
    ['Who supplies them', '<p>Long-established vendors include Temenos, Oracle FLEXCUBE, Infosys Finacle and TCS BaNCS (both widely used in India), and FIS, Fiserv and Jack Henry in the US. Newer cloud-native cores include Thought Machine, Mambu and 10x. Some large banks still run their own.</p>'],
    ['Why migrations go wrong', '<p>Decades of products, exceptions and data quirks have to move without losing a balance or a day. In 2018 a UK bank’s migration left nearly two million customers with problems for weeks and cost it hundreds of millions of pounds. Most banks now prefer progressive modernisation: carve out products onto a new core one at a time, or put a modern layer of services and APIs in front of the old one.</p>'],
    ['Where BIAN fits', '<p>Breaking a core into components needs a shared map of what the components are. That is what BIAN provides.</p>']
  ],
  facts: [['Holds', 'Accounts, products, interest, postings'], ['Classic pattern', 'Daytime online, overnight batch'], ['Modern pattern', 'Real-time, API-first, cloud'], ['Typical strategy', 'Progressive, product-by-product migration']],
  quiz: [['Why do many banks avoid a “big bang” core replacement?', ['Moving all accounts at once risks outages and errors on a huge scale', 'It is illegal', 'Vendors do not allow it'], ''], ['What does a traditional core do in the overnight batch?', ['Posts transactions, accrues interest and produces reports', 'Approves card payments', 'Nothing'], '']],
  see: ['bian', 'ledgers', 'issuer-processor', 'baas']
},
'bian': {
  brief: ['BIAN, the Banking Industry Architecture Network, publishes a shared map of everything a bank does.', 'It breaks banking into a few hundred “service domains”, each a self-contained business capability with standard operations.', 'Banks and vendors use it to design systems, compare products and define APIs in a common language.'],
  flow: { nodes: [['🏪', 'Card Capture', 'acquiring side'], ['🔀', 'Card Transaction Switch', 'routing'], ['✅', 'Card Authorization', 'issuer decision'], ['🛡️', 'Fraud Evaluation', 'risk'], ['💳', 'Credit Card', 'the facility']], steps: [
    [0, 1, 'capture', 'req', 'A payment is captured', 'On the merchant side, the service domain that captures card transactions records the request and passes it on.'],
    [1, 2, 'route', 'req', 'It is routed to the issuer’s authorisation capability', 'BIAN models switching and authorisation as separate domains. In a real bank they might be different systems from different vendors.'],
    [2, 3, 'evaluate', 'req', 'Authorisation consults Fraud Evaluation', 'Each service domain owns its own data and exposes standard operations. Authorisation asks Fraud Evaluation to score the payment rather than doing it itself. A separate domain, Fraud Diagnosis, handles what happens after fraud is suspected.'],
    [3, 2, 'ok', 'res', 'Fraud check passes', ''],
    [2, 4, 'reserve', 'money', 'The credit card facility is updated', 'The Credit Card domain owns the account arrangement: the limit, balances and terms. Authorisation asks it to reserve funds.'],
    [2, 1, 'approved', 'res', 'Approved', 'The same flow in any BIAN-mapped bank uses the same names, which is the point: architects, vendors and regulators can talk about it without translating.']] },
  sec: [
    ['What it is', '<p>BIAN is a not-for-profit association of banks, software vendors and consultancies founded in 2008. Its main output, the <strong>Service Landscape</strong>, reached version 14 in February 2026. It is free to use and published openly.</p>'],
    ['Service domains', '<p>The landscape groups capabilities into business areas (such as Products, Operations and Execution, Risk and Compliance, Customers, Business Support) and then into a few hundred <strong>service domains</strong>, each responsible for one thing for its whole life cycle: Current Account, Credit Card, Card Authorization, Payment Order, Party Reference Data Directory, Fraud Evaluation, Card Case (disputes). Each domain owns a <strong>control record</strong> (the thing it manages) and offers standard <strong>service operations</strong>: initiate, update, execute, request, retrieve.</p>'],
    ['Why it is useful', '<p><strong>A common vocabulary</strong>: when a bank and a vendor both say “Card Authorization”, they mean the same scope. <strong>Componentisation</strong>: a core can be broken along domain boundaries and parts replaced one at a time. <strong>APIs</strong>: BIAN publishes semantic API definitions for each domain, and aligns its data model with ISO 20022. <strong>Gap analysis</strong>: map your systems to the landscape and see what is duplicated or missing.</p>'],
    ['What it is not', '<p>It is not software, a technical standard you must implement, or a regulation. It describes <em>what</em> a bank does, not <em>how</em> to build it. Two BIAN-aligned banks can have very different systems.</p>'],
    ['Where you meet it', '<p>In core banking replacement programmes, vendor selection, enterprise architecture teams, and API design at banks moving towards composable, “coreless” architectures.</p>']
  ],
  facts: [['Founded', '2008'], ['Latest landscape', 'Version 14 (February 2026)'], ['Unit', 'Service domain, with a control record and service operations'], ['Aligned with', 'ISO 20022 data model'], ['Cost', 'Free and open']],
  quiz: [['What is a BIAN service domain?', ['A self-contained business capability with its own data and standard operations', 'A software product', 'A banking licence'], ''], ['Does adopting BIAN mean buying specific software?', ['No, it describes what a bank does, not how to build it', 'Yes, from BIAN members', 'Only for cards'], '']],
  see: ['core-banking', 'iso20022', 'issuer-processor', 'open-banking']
},
'open-banking': {
  brief: ['Open banking lets you share your bank data with, or start payments from, a third party you choose, through secure APIs instead of giving out your password.', 'Some countries mandated it; others are leaving it to the market.', 'It powers budgeting apps, faster lending decisions, and payments that bypass cards.'],
  sec: [
    ['Two powers', '<p><strong>Account information</strong>: read-only access to balances and transactions, with your consent, for budgeting, lending decisions or accounting. <strong>Payment initiation</strong>: a third party starts a payment from your account, which you approve in your banking app. The second is how “Pay by Bank” works.</p>'],
    ['Consent at the centre', '<p>You choose what to share, with whom, for how long, and can revoke it. Before open banking, apps collected your banking password and scraped your screens. APIs replace that with tokens scoped to your consent.</p>'],
    ['Recurring payments', '<p>Variable recurring payments let you set a mandate with limits, such as a maximum per payment and per month, so a provider can pull payments from your bank account within them. They are positioned as a modern, more controllable direct debit.</p>'],
    ['Open finance', '<p>The next step extends the same idea to savings, pensions, insurance and investments, and sometimes to energy and telecoms. Progress varies widely by country.</p>']
  ],
  reg: { in: 'India built a different model: the Account Aggregator framework. Licensed account aggregators, a type of NBFC, carry encrypted data between financial institutions on the basis of a digital consent, without being able to read it. Lenders use it to underwrite loans in minutes from bank statements.', us: 'The CFPB’s 2024 open-banking rule under Section 1033 was challenged in court, is not being enforced, and is being rewritten; a new proposal went for review in August 2026. Meanwhile access runs through private agreements, and large banks have started charging aggregators for data.', uk: 'Mandated in 2018 for the nine largest banks, the UK has one of the most developed systems, with millions of users. Sweeping variable recurring payments are live; commercial ones are being rolled out. In the EU, the PSD3 package and the Payment Services Regulation, agreed in 2025 and being adopted in 2026, will strengthen access rules.', au: 'Australia’s Consumer Data Right started with banking in 2020 and extended to energy and non-bank lending. Take-up has been slower than hoped, and the government has scaled back some expansion plans. PayTo provides account-to-account mandates on the NPP.' },
  quiz: [['What is the main difference between open banking and screen scraping?', ['APIs with scoped consent instead of sharing your password', 'Open banking is free', 'Scraping is faster'], ''], ['How does India’s Account Aggregator move data?', ['Encrypted, on the basis of your digital consent, without the aggregator reading it', 'By email', 'Through the credit bureaus'], '']],
  see: ['payment-methods', 'instant-payments', 'direct-debit', 'baas']
},
'baas': {
  brief: ['Banking as a service lets a non-bank offer accounts, cards or loans using a licensed bank behind the scenes.', 'The fintech owns the customer and the app; the bank holds the licence, the money and the regulatory duty.', 'It works when both keep accurate records. Several failures showed what happens when they do not.'],
  sec: [
    ['The stack', '<p><strong>Sponsor bank</strong>: the regulated institution that holds deposits, issues cards on its BIN and is responsible to the regulator. <strong>Middleware or BaaS platform</strong>, sometimes: software connecting many fintechs to one or more banks. <strong>Fintech</strong>: brand, product, app and customer support. Plus a processor and compliance vendors.</p>'],
    ['Where the money sits', '<p>Customer money is usually held in a pooled account at the bank in the fintech’s name for the benefit of its customers. The bank knows the total; someone must know how much belongs to each person. If that “someone” is a middleware firm whose ledger does not reconcile with the bank’s, the protection customers thought they had evaporates.</p>'],
    ['What went wrong in 2024', '<p>A US middleware provider went bankrupt with its records not matching the funds at its partner banks. Customers of fintech apps built on it could not reach their money for months, and a shortfall of tens of millions of dollars emerged. Regulators issued orders against several sponsor banks over weak oversight of fintech partners.</p>'],
    ['Doing it properly', '<p>Daily reconciliation between the fintech’s ledger and the bank’s. The bank seeing account-level records, not only totals. Clear ownership of KYC, fraud, complaints and disputes. Contingency plans for either party failing.</p>']
  ],
  reg: { in: 'Indian regulation keeps fintechs at arm’s length from deposits: they partner with banks or obtain their own licences (payment aggregator, prepaid issuer, NBFC). The RBI has restricted several bank-fintech partnerships over KYC and data concerns.', us: 'Sponsor-bank BaaS is common. Deposits are insured only if the bank’s records identify each owner correctly, so record-keeping is the heart of the issue.', uk: 'Many fintechs hold an e-money licence themselves and safeguard funds at banks. The FCA tightened safeguarding rules in 2026, requiring more frequent reconciliation and resolution packs.', au: 'Fintechs typically partner with an authorised deposit-taking institution or hold a restricted licence while building up capital.' },
  quiz: [['In BaaS, who is responsible to the regulator for customer deposits?', ['The sponsor bank', 'The fintech app', 'The card network'], ''], ['What made the 2024 middleware collapse so damaging?', ['Its records of who owned what did not match the funds at the banks', 'The banks failed', 'Deposit insurance was cancelled'], '']],
  see: ['card-programmes', 'ledgers', 'licences', 'reconciliation']
},
'licences': {
  brief: ['What a payments company may do depends on its licence.', 'Only banks may take deposits and lend them out. Payment and e-money firms may hold customer money only to make payments, and must keep it separate.', 'Each country draws the lines differently.'],
  sec: [
    ['Banks', '<p>A full banking licence allows deposit-taking and lending, with deposit insurance, central bank access and the heaviest capital and supervisory requirements.</p>'],
    ['Payment and e-money firms', '<p>In many countries non-banks can be licensed to make payments, issue stored value or run wallets. They may not lend customers’ money and must safeguard it, either in segregated accounts or covered by insurance or a guarantee.</p>'],
    ['Lenders that are not banks', '<p>Consumer lenders, card issuers and pay-later firms can often lend from their own or borrowed funds without taking deposits, under a credit licence.</p>'],
    ['Why it matters to you', '<p>Your protection differs. Money in a bank is usually covered by deposit insurance. Money in an e-money account is safeguarded, which protects it from the firm’s creditors but is not insurance. A loan from an unlicensed lender may leave you without complaint rights.</p>']
  ],
  reg: { in: 'The RBI licenses commercial banks, small finance banks, payments banks (deposits up to ₹2 lakh, no lending), NBFCs (lending), payment aggregators and cross-border aggregators, prepaid payment instrument issuers, account aggregators and credit information companies. NPCI operates retail rails under RBI oversight.', us: 'Banks are chartered nationally (OCC) or by states, and supervised by the Fed, FDIC or OCC. Money transmitters need a licence in almost every state, though many states now use a common model law. Consumer lending is licensed state by state.', uk: 'The PRA and FCA authorise banks; the FCA authorises payment institutions and e-money institutions and regulates consumer credit. The EU has an equivalent passported regime, being updated by PSD3.', au: 'APRA licenses authorised deposit-taking institutions. ASIC issues financial services and credit licences. Payments licensing is being reformed to bring more non-bank providers under one framework.' },
  quiz: [['May an e-money institution lend out its customers’ balances?', ['No, it must safeguard them', 'Yes, like a bank', 'Only half of them'], ''], ['Which kind of firm can take deposits and lend them?', ['A bank', 'A payment institution', 'A money transmitter'], '']],
  see: ['baas', 'how-banks-work', 'prepaid-cards', 'kyc']
},
'central-bank-money': {
  brief: ['There are two kinds of money: central bank money (cash and banks’ reserves) and commercial bank money (your deposits).', 'Banks settle with each other in central bank money, because it carries no credit risk.', 'Who may hold an account at the central bank is a quiet but important question in payments.'],
  sec: [
    ['Two layers', '<p>The money in your account is a claim on your bank. The money banks use to pay each other is a claim on the central bank, held as <strong>reserves</strong> in their settlement accounts. Cash is the only form of central bank money the public can hold directly.</p>'],
    ['Why settle there', '<p>If banks settled in each other’s deposits, every payment would leave one bank exposed to another’s failure. Settling across the central bank’s books makes payment final and risk-free. Every rail in this library, cards included, eventually settles this way.</p>'],
    ['Settlement finality', '<p>Laws define the moment a payment is final and cannot be unwound, even if a participant becomes insolvent a minute later. Without that certainty no one would release goods or securities against a payment.</p>'],
    ['Access', `<p>Traditionally only banks held settlement accounts, so payment firms had to settle through a bank. That is changing: ${pick({ in: 'since 2021 the RBI has allowed non-bank payment system operators direct membership of RTGS and NEFT.', us: 'the Federal Reserve published tiered guidelines in 2022 for which institutions may get a master account, and the question of access for novel charters remains contested.', uk: 'since 2017 the Bank of England has allowed non-bank payment providers to hold settlement accounts.', au: 'the Reserve Bank has been reviewing access to settlement accounts for non-bank payment providers.' })} Direct access reduces dependence on competitors and is a precondition for some firms to compete with banks.</p>`],
    ['Digital versions', '<p>Wholesale tokenised central bank money and retail digital currencies are covered in the CBDC guide.</p>']
  ],
  facts: [['Central bank money', 'Cash and bank reserves'], ['Commercial bank money', 'Your deposits'], ['Interbank settlement', 'In central bank money'], ['Finality', 'Defined by law']],
  quiz: [['Why do banks settle in central bank money?', ['It carries no credit risk, so settlement is final', 'It earns more interest', 'It is faster to print'], ''], ['Which form of central bank money can you hold?', ['Cash', 'Reserves', 'Neither'], '']],
  see: ['wires-rtgs', 'ch25', 'cbdc', 'how-banks-work']
}
});
})();

// ---- added Nov 2026: capital, ALM, trade, cash management, keys, engineering ----
(() => {
const { R, pick, money } = DCC;
Object.assign(window.DCC_KB, {
'basel-capital': {
  brief: ['Capital is the bank’s own money, mostly shareholders’ equity, that absorbs losses before depositors are hurt.', 'Rules set how much capital a bank must hold against its risk-weighted assets.', 'The international standard is Basel III, written by the Basel Committee and applied by each country.'],
  sec: [
    ['Why capital', '<p>A bank funded almost entirely by deposits can be wiped out by small losses. Capital is the buffer. The more of it, the safer the bank and the lower its return on equity, which is why banks and regulators argue about the right level.</p>'],
    ['Risk-weighted assets', '<p>Not all assets are equally risky, so each is given a risk weight: cash and government bonds near zero, mortgages lower, unsecured loans and credit card balances higher. Capital requirements are a percentage of the total, so a bank holding riskier assets needs more capital. Large banks may use their own models for the weights, within limits.</p>'],
    ['The ratios', '<p>The core measure is common equity tier 1 (CET1) capital as a share of risk-weighted assets, with a minimum of 4.5% plus buffers that take most large banks above 10%. A leverage ratio limits total assets to a multiple of capital regardless of risk weights, as a backstop against models that underestimate risk.</p>'],
    ['Liquidity rules', '<p>Basel III added liquidity standards after 2008: the liquidity coverage ratio requires enough high-quality liquid assets to survive 30 days of stressed outflows; the net stable funding ratio requires stable funding for long-term assets.</p>'],
    ['Where it stands', '<p>The final Basel III reforms, often called Basel 3.1 or the “endgame”, are being implemented at different speeds: the EU began in 2025, the UK set 2027, and US rules have been repeatedly revised. Smaller banks and non-banks face simpler regimes.</p>']
  ],
  facts: [['CET1 minimum', '4.5% of RWA, plus buffers'], ['Credit cards', 'Higher risk weight than mortgages'], ['Liquidity', 'LCR (30 days) and NSFR (one year)'], ['Standard setter', 'Basel Committee on Banking Supervision']],
  quiz: [['Why do credit card balances need more capital than the same value of mortgages?', ['They carry a higher risk weight because they are unsecured', 'They earn less interest', 'They are newer'], ''], ['What is the leverage ratio for?', ['A backstop limit that ignores risk weights', 'Setting interest rates', 'Measuring liquidity'], '']],
  see: ['how-banks-work', 'alm-treasury', 'credit-risk']
},
'alm-treasury': {
  brief: ['Asset-liability management is how a bank handles the mismatch between short-term deposits and long-term loans and investments.', 'The two big risks are interest rate risk and liquidity risk.', 'Silicon Valley Bank failed in 2023 when both struck at once.'],
  sec: [
    ['The mismatch', '<p>Deposits can leave tomorrow; mortgages and bonds last for years. That maturity transformation is what banks are for, and it is also what makes them fragile. The treasury function decides how much mismatch to run and how to hedge it.</p>'],
    ['Interest rate risk', '<p>If a bank holds long fixed-rate bonds or loans and rates rise, their market value falls, while the rate it must pay depositors to stay goes up. Measures include the change in economic value of equity and in net interest income under rate shocks. Banks hedge with interest rate swaps and by matching durations.</p>'],
    ['Liquidity risk', '<p>Can the bank meet outflows today and through a stress? Treasury holds a buffer of high-quality liquid assets, monitors deposit concentration and stability, and keeps access to central bank facilities ready, with collateral pre-positioned.</p>'],
    ['What happened at SVB', '<p>Silicon Valley Bank took in a flood of deposits from tech start-ups in 2020–21 and invested much of it in long-dated government bonds. When rates rose in 2022, those bonds lost value. Its depositors were concentrated, largely uninsured and connected to each other. When the bank announced a loss on selling bonds in March 2023, about $42 billion was withdrawn in a day, and it failed the next morning.</p>'],
    ['Deposit betas', '<p>When rates rise, banks pass only part of the increase to depositors; the share is the deposit beta. Mobile banking and money-market alternatives make deposits more rate-sensitive and faster to move than older models assumed.</p>']
  ],
  quiz: [['Why did rising rates hurt Silicon Valley Bank?', ['Its long-dated bonds lost value while depositors could leave instantly', 'Its loans defaulted', 'It was fined'], ''], ['What is a deposit beta?', ['The share of a rate rise passed on to depositors', 'A new account type', 'A capital ratio'], '']],
  see: ['how-banks-work', 'basel-capital', 'central-bank-money']
},
'trade-finance': {
  brief: ['Trade finance solves a problem of trust: an exporter wants to be paid before shipping, an importer wants the goods before paying.', 'Banks stand in the middle, using documents to control when money and goods change hands.', 'It finances a large share of world trade and is still surprisingly paper-based.'],
  sec: [
    ['Letters of credit', '<p>The importer’s bank promises to pay the exporter when the exporter presents specified documents: a bill of lading showing the goods were shipped, an invoice, an inspection certificate. Banks check the documents, not the goods. Rules are standardised internationally by the ICC’s UCP 600.</p>'],
    ['Documentary collections', '<p>A cheaper, weaker alternative: the exporter’s bank sends the shipping documents to the importer’s bank, which releases them only against payment or a promise to pay. The bank does not guarantee payment.</p>'],
    ['Open account and supply chain finance', '<p>Most trade between established partners is on open account: ship now, pay in 30 to 90 days. Supply chain finance lets a supplier be paid early by a bank, at a rate based on the large buyer’s credit, while the buyer pays on the due date.</p>'],
    ['Guarantees', '<p>Banks also issue guarantees and standby letters of credit that pay out if a party fails to perform, common in construction and commodity contracts.</p>'],
    ['Going digital', '<p>Bills of lading are documents of title, so for decades they had to be paper. Laws such as the UK Electronic Trade Documents Act 2023, following a UN model law, now let electronic versions carry the same legal weight.</p>']
  ],
  quiz: [['What does a bank check before paying under a letter of credit?', ['The documents', 'The goods', 'The buyer’s credit score'], ''], ['Why is supply chain finance cheaper for small suppliers?', ['It is priced on the large buyer’s credit', 'It is subsidised', 'It has no interest'], '']],
  see: ['cash-management', 'swift', 'sanctions']
},
'cash-management': {
  brief: ['Cash management is banking for a company’s treasurer: collecting money in, paying it out, and knowing where all of it is today.', 'Large companies run dozens of accounts across banks and countries.', 'Tools such as virtual accounts, sweeping and pooling make the money work as one balance.'],
  sec: [
    ['Collections', '<p>Receiving payments from customers by transfer, direct debit, card and cheque, and matching each to the right invoice. <strong>Virtual accounts</strong> give every customer a unique account number that routes into one real account, so incoming payments identify themselves.</p>'],
    ['Payables', '<p>Paying suppliers, salaries and taxes in bulk files, with approval workflows and controls against fraud such as changed supplier bank details.</p>'],
    ['Liquidity', '<p><strong>Sweeping</strong> moves balances automatically between accounts at the end of each day, for example zeroing subsidiaries into a central account. <strong>Notional pooling</strong> offsets balances for interest purposes without moving money. Both reduce idle cash and borrowing.</p>'],
    ['Visibility', '<p>Banks send end-of-day and intraday statements, increasingly in ISO 20022 formats and through APIs, into treasury management systems that show the group’s position in one place and forecast cash needs.</p>'],
    ['Why it matters', '<p>A company can be profitable and still fail for lack of cash on a particular day. Cash management is the plumbing that prevents that.</p>']
  ],
  quiz: [['What does a virtual account do?', ['Gives each payer a unique account number that routes into one real account', 'Holds a separate balance', 'Replaces a bank licence'], ''], ['What is a cash sweep?', ['An automatic transfer of balances between accounts', 'A cleaning fee', 'A type of loan'], '']],
  see: ['reconciliation', 'iso20022', 'payouts', 'commercial-cards']
},
'hsm-keys': {
  brief: ['Every card cryptogram, PIN check and token depends on secret keys, and those keys live in hardware security modules.', 'An HSM is a tamper-resistant computer that performs cryptography without ever revealing its keys.', 'Keys are arranged in layers, so the most valuable ones are almost never used directly.'],
  sec: [
    ['What an HSM does', '<p>It generates, stores and uses keys inside protected hardware. If someone tries to open it, it erases them. Applications send it requests, such as “verify this PIN” or “check this cryptogram”, and get back yes or no. The key itself never leaves.</p>'],
    ['A hierarchy of keys', '<p>At the top, a master key protects everything stored outside the HSM. Below it, <strong>zone keys</strong> are shared with partners such as the card network to protect PINs and keys in transit. Below those, <strong>working keys</strong> encrypt individual messages and are changed often. Card-specific keys are derived from issuer master keys, so each card has its own.</p>'],
    ['PINs in transit', '<p>Your PIN is encrypted in the terminal’s PIN pad into a PIN block. As it travels, each party that receives it translates it from one key to the next inside an HSM, so it is never in clear text on any computer. Many terminals use a scheme in which a new key is derived for every transaction.</p>'],
    ['Key ceremonies', '<p>Top-level keys are created and loaded in formal ceremonies, split into components held by different people, none of whom can reconstruct the key alone. Dual control and split knowledge are basic rules of the trade.</p>'],
    ['Standards', '<p>HSMs are certified to security standards, and the card industry’s PIN security requirements and PCI HSM standard govern how they are used. Cloud providers now offer HSMs as a service.</p>']
  ],
  quiz: [['Why is a top-level key split into components held by different people?', ['So no single person can reconstruct it', 'To make it longer', 'To share it with customers'], ''], ['Where is your PIN in clear text during a payment?', ['Nowhere outside secure hardware', 'On the merchant’s server', 'At the card network'], '']],
  see: ['emv', 'pci-dss', 'issuer-processor', 'ch28']
},
'payments-engineering': {
  brief: ['Payment systems must never lose money, never move it twice, and always be able to explain every movement.', 'Networks fail, messages arrive twice, and replies go missing. The design has to assume all three.', 'A handful of patterns make this possible: idempotency, state machines, reversals, and reconciliation.'],
  sec: [
    ['Idempotency', '<p>Every request that moves money carries a unique key. If the same key arrives again, the system returns the original result instead of acting twice. Lab XXXIV shows what happens without it.</p>'],
    ['Timeouts are not failures', '<p>If a request times out, you do not know whether it succeeded. The safe responses are to query the status, or to send a reversal that cancels it if it did happen. Card networks build this in: a missing authorisation response triggers an automatic reversal.</p>'],
    ['State machines', '<p>A payment moves through defined states: created, authorised, captured, settled, refunded, disputed. Only certain transitions are allowed. Modelling this explicitly prevents impossible combinations such as refunding a payment that was never captured.</p>'],
    ['Ledgers first', '<p>Balances are derived from an immutable ledger of entries, not stored as a number that gets overwritten. Every movement balances. Corrections are new entries.</p>'],
    ['Reconciliation as a feature', '<p>Every external record (network files, bank statements, partner reports) is matched to internal records daily, and breaks are worked until zero. Payment companies that treat reconciliation as an afterthought eventually cannot say whose money is whose.</p>'],
    ['Availability and change', '<p>Payment systems target very high availability, so changes roll out gradually, behind feature flags, with the ability to roll back. Peak days such as festivals and sales are rehearsed with load tests. And every incident is reviewed for its cause rather than its culprit.</p>']
  ],
  facts: [['Never', 'Lose money, or move it twice'], ['On timeout', 'Query or reverse, never blindly retry'], ['Source of truth', 'Immutable double-entry ledger'], ['Daily', 'Reconcile every external record']],
  quiz: [['A request to move money times out. What is the safe next step?', ['Query its status or send a reversal', 'Send it again with a new reference', 'Assume it failed'], ''], ['Why model a payment as a state machine?', ['To allow only valid transitions, such as no refund before capture', 'To make it faster', 'To save storage'], '']],
  see: ['ch34', 'ledgers', 'reconciliation', 'op-resilience']
}
});
})();
