// Guides: issuing. Schema: see CLAUDE.md ("Guide schema").
(() => {
const { R, pick } = DCC;
Object.assign(window.DCC_KB = window.DCC_KB || {}, {
'issuer-processor': {
  brief: ['The issuer processor is the system of record for every card a bank issues.', 'It answers authorisations in milliseconds, keeps every balance, calculates interest and fees, and produces the statement.', 'Most banks rent one rather than build it, so a handful of companies run a large share of the world’s cards.'],
  flow: { nodes: [['🌐', R.network, 'network'], ['🔌', 'Network interface', 'ISO 8583'], ['⚡', 'Authorisation engine', 'real time'], ['🧠', 'Fraud scoring', ''], ['📒', 'Card ledger', 'balances']], steps: [
    [0, 1, '0100', 'req', 'A request arrives', 'The network delivers an authorisation request. The processor decodes it and identifies the card account.'],
    [1, 2, 'card + amount', 'req', 'Card checks', 'Status (active, blocked, lost), expiry, cryptogram and PIN verification, and the controls you set in the app: international off, contactless limit, merchant blocks.'],
    [2, 3, 'score?', 'req', 'Fraud score', 'The transaction is scored against your pattern. The engine adds rules, such as velocity limits.'],
    [3, 2, '12 / 100', 'res', 'Low risk', ''],
    [2, 4, 'reserve', 'money', 'Funds check and hold', 'The open-to-buy (limit minus balance minus holds) is checked and the amount reserved as a memo post.'],
    [2, 0, '0110 · 00', 'res', 'Approved', 'The whole path must complete in well under a second. If the issuer cannot answer in time, the network’s stand-in rules decide.']] },
  sec: [
    ['What it does', '<p><strong>Real time</strong>: authorisations, card controls, notifications, tokenisation requests from wallets. <strong>Batch</strong>: posting cleared transactions, calculating interest and fees each night, cycling accounts on their statement date, generating statements and minimum payments, sending bureau reports, managing delinquency stages. <strong>Card management</strong>: issuing, renewing, replacing, PIN management.</p>'],
    ['Product configuration', '<p>A card product is mostly configuration in the processor: interest rates per balance type, grace rules, fee schedules, minimum-payment formula, payment hierarchy, statement cycle, reward earn rules, credit limit policies. A new product is often a new set of parameters rather than new code, which is why processors compete on how flexible that configuration is.</p>'],
    ['Old and new processors', '<p>Long-established processors run mainframe-era platforms with enormous scale and decades of edge cases handled. A newer generation offers cloud platforms with APIs, real-time ledgers and quick product launches, often favoured by fintechs and by banks launching new programmes. Large banks frequently run both.</p>'],
    ['Why switching is rare', '<p>Moving millions of card accounts with their history, balances, interest states and in-flight disputes from one processor to another is risky and slow. Contracts are long and migrations take years.</p>']
  ],
  facts: [['Real time', 'Authorisation, controls, tokens, alerts'], ['Batch', 'Posting, interest, cycling, statements, bureau reporting'], ['Also called', 'Card management system, credit card processing platform'], ['Typical buyers', 'Banks, fintechs, card programme managers']],
  quiz: [['What is “open to buy”?', ['The credit limit minus the balance and pending holds', 'The minimum payment', 'The interest-free period'], ''], ['Launching a new card product on a modern processor is mainly…', ['Configuring parameters such as rates, fees and rules', 'Writing a new system', 'Issuing a new network licence'], '']],
  see: ['ch23', 'ch31', 'card-programmes', 'core-banking']
},
'card-lifecycle': {
  brief: ['A card goes from a number range to a piece of plastic, or a token, to a closed account through a dozen managed stages.', 'Most of the steps are invisible to the cardholder and handled by specialist firms.', 'Each step is also a point where fraud can get in.'],
  sec: [
    ['Number and product', '<p>The issuer allocates a card number from one of its BIN ranges, ties it to an account and a product configuration, and generates the cryptographic keys and security code values for the card.</p>'],
    ['Making the card', '<p>A bureau embeds the chip in plastic or metal, writes the keys and data into it (<strong>personalisation</strong>), prints or engraves the details, and mails it. The PIN is sent separately or set in the app. Many issuers now issue a <strong>digital card first</strong>, usable in a phone wallet before the plastic arrives.</p>'],
    ['Activation', '<p>The card is shipped inactive to limit the damage of mail theft. Activation, by app, phone or a first chip-and-PIN payment, switches it on.</p>'],
    ['In life', '<p>Limit changes, address changes, controls, tokens added to phones and merchants, disputes, and replacement after loss, damage or a compromise. A compromised card is usually reissued with a new number; a damaged one with the same number.</p>'],
    ['Renewal', '<p>Before expiry a new card is produced, usually with the same number, a new expiry and a new security code. Network account-updater services pass the new details to merchants that hold your card on file, and tokens in wallets update automatically.</p>'],
    ['Closure', '<p>An account can be closed by you, by the issuer for inactivity or risk, or after charge-off. The record stays on your credit report. Closing a card does not cancel recurring payments by contract: tell the merchants too.</p>']
  ],
  reg: { in: 'RBI rules require cards to be issued only with consent, with no unsolicited cards or limit increases, and a card not activated within 30 days must be closed if the customer does not confirm. A request to close a card must be honoured within 7 working days, or the issuer pays ₹500 a day.', us: 'Unsolicited credit cards are banned; issuers may send pre-approved offers. Closing an account with a balance leaves the balance payable on the original terms.', uk: 'Unsolicited credit cards and unsolicited limit increases are banned. You can opt out of automatic limit increases.', au: 'Issuers may not offer unsolicited limit increases, and must let you reduce your limit or close the card online.' },
  quiz: [['Why are new cards mailed inactive?', ['To limit fraud if the card is stolen in transit', 'To save postage', 'Because the chip needs charging'], ''], ['What usually changes when a card is renewed?', ['The expiry date and security code', 'The account number and credit history', 'Nothing'], '']],
  see: ['ch3', 'bins', 'stored-credentials', 'issuer-processor']
},
'bins': {
  brief: ['The first six to eight digits of a card number are its BIN, or issuer identification number.', 'The BIN tells the network which issuer to route to, and carries the card’s brand, type, product and country.', 'Fintechs that are not banks usually issue cards on a bank’s BIN.'],
  sec: [
    ['What a BIN encodes', '<p>The first digit is the major industry identifier: 4 for Visa, 2 and 5 for Mastercard, 3 for American Express and JCB, 6 for Discover and some RuPay and UnionPay ranges. The full BIN identifies the issuer and, in the networks’ tables, the product: credit or debit, consumer or commercial, standard or premium, country of issue. Acquirers use those tables to price transactions and to apply rules.</p>'],
    ['Six to eight', '<p>The ISO standard moved from six-digit to eight-digit BINs, with the networks’ migration completing in 2022, because the world was running out of six-digit ranges. Systems that assumed six digits had to be changed, and you will still see “first six” in older documents.</p>'],
    ['BIN sponsorship', '<p>Only licensed members of a network can own BINs. A programme manager that wants to launch a card partners with a <strong>BIN sponsor</strong>: a member bank that lends its BIN range, holds the regulatory responsibility and, usually, the customer funds. Most fintech cards work this way.</p>'],
    ['BIN attacks', '<p>Because a BIN fixes the first digits and the last is a checksum, fraudsters can generate plausible card numbers and test them with small payments at weak merchants. Issuers and merchants detect the pattern: many attempts on sequential numbers, unusual merchants, tiny amounts.</p>']
  ],
  facts: [['Length', '6 to 8 digits (8 since 2022)'], ['Standard', 'ISO/IEC 7812'], ['Encodes', 'Network, issuer, product, country'], ['Owned by', 'Network members only']],
  quiz: [['What is BIN sponsorship?', ['A licensed bank letting a programme manager issue cards on its BIN', 'A fee for printing numbers', 'A sponsorship deal with a network'], ''], ['Why did BINs grow to eight digits?', ['Six-digit ranges were running out', 'For extra security', 'To include the country code'], '']],
  see: ['card-programmes', 'baas', 'ch3', 'fraud-types']
},
'underwriting': {
  brief: ['Underwriting is how a lender decides whether to give you credit, how much, and at what price.', 'It combines your bureau data, what you declare, and the lender’s own models and policy rules.', 'It does not stop at approval: limits are reviewed for as long as the account is open.'],
  sec: [
    ['The inputs', '<p>Bureau data (score, accounts, payment history, enquiries). Application data (income, employment, housing, existing commitments). Internal data if you already bank there (salary credits, balances, behaviour). Sometimes alternative data: rent and utility payments, open-banking account data. Identity and fraud checks run alongside.</p>'],
    ['The decision', '<p>A scorecard estimates the probability you will default. Policy rules sit on top: minimum age and income, maximum debt-to-income, no recent defaults. Cut-off scores decide approve, refer or decline. Referred cases go to a human. Lenders test changes by running a new strategy (the challenger) against the current one (the champion) on part of the population.</p>'],
    ['Setting the limit', '<p>Limit assignment balances risk against value: a higher limit attracts more spending and more revolving balance, and more potential loss. Affordability rules in many countries require the lender to check you could repay the limit, not just the first payment.</p>'],
    ['Line management', '<p>Behaviour scores, updated monthly from how you use the account, drive limit increases, decreases, and offers such as balance transfers. A sudden cut in your limit usually means the lender saw stress on your bureau file or in its own data.</p>'],
    ['When you are declined', '<p>Lenders must usually tell you the main reasons, or at least which bureau they used, so you can check your file. Applying again at once elsewhere adds hard enquiries; fix the cause first.</p>']
  ],
  reg: { in: 'Lenders must assess creditworthiness and cannot issue cards or raise limits without explicit consent. Digital lending rules require a key fact statement and limit how lenders and their partners may access your phone data.', us: 'The CARD Act requires issuers to consider ability to pay; under 21 you need your own income or a co-signer. A declined applicant receives an adverse action notice naming the main reasons.', uk: 'FCA rules require a proportionate creditworthiness and affordability assessment, including the limit as a whole.', au: 'Responsible lending law requires lenders to verify your finances and to assess whether you could repay the whole limit within three years.' },
  quiz: [['What is a champion-challenger test?', ['Running a new credit strategy against the current one on part of the applicants', 'A competition between lenders', 'A second credit check'], ''], ['Why might a lender cut your limit without you missing a payment?', ['Its behaviour or bureau data shows rising risk elsewhere', 'It is not allowed to', 'To charge a fee'], '']],
  see: ['ch2', 'credit-risk', 'credit-reports', 'collections']
},
'collections': {
  brief: ['Collections is what a lender does when payments stop: from reminders, through hardship plans, to recovery and write-off.', 'Every stage is governed by rules on how and when you may be contacted.', 'The earlier a borrower talks to the lender, the more options there are.'],
  sec: [
    ['Early stage', '<p>Reminders by message and email, often before the due date. Then calls. The aim is to separate people who forgot from people who cannot pay. Lenders model this as <strong>roll rates</strong>: the share of accounts moving from one stage of lateness to the next.</p>'],
    ['Hardship and restructuring', '<p>For people who cannot pay, lenders offer reduced payments, frozen interest, conversion of the balance into a fixed instalment loan, or a settlement for less than the full amount. Each has different consequences on the credit file; a settlement is usually reported as such.</p>'],
    ['Late stage', '<p>After a few months the account is closed to spending. At around 90 days most regulators treat the loan as non-performing and require provisions. Accounts may be handed to an agency or sold to a debt purchaser. At around 180 days, card balances are typically written off the books, which does not erase the debt.</p>'],
    ['Conduct rules', `<p>${pick({ in: 'RBI’s rules bar recovery calls before 8 a.m. or after 7 p.m., threats, abuse and contacting your family or employer to shame you. Banks are responsible for the conduct of their recovery agents.', us: 'Third-party collectors are bound by the Fair Debt Collection Practices Act and Regulation F: no harassment, limits of roughly seven call attempts in seven days per debt, a validation notice, and the right to ask them to stop contacting you.', uk: 'FCA rules require lenders and collectors to treat customers in difficulty with forbearance and due consideration, signpost free debt advice and pause collection during Breathing Space.', au: 'ASIC and the ACCC’s debt collection guideline set limits on contact frequency and conduct, and you have a legal right to ask for a hardship variation.' })}</p>`],
    ['Why lenders care how they collect', '<p>A customer helped early often repays in full; one pushed into default rarely does. Aggressive collection also brings complaints, fines and reputational damage. Good collections teams are measured on cure rates, not on how hard they push.</p>']
  ],
  facts: [['Stages', 'Reminder, early collections, hardship, late stage, recovery'], ['Non-performing', 'Around 90 days past due'], ['Charge-off', 'Around 180 days for cards'], ['Write-off', 'An accounting step, not forgiveness']],
  quiz: [['A card balance is charged off after 180 days. Do you still owe it?', ['Yes, it can still be collected or sold', 'No, it is cancelled', 'Only half'], ''], ['What is a roll rate?', ['The share of accounts moving from one stage of lateness to the next', 'The interest rate on overdue balances', 'The rate at which cards are reissued'], '']],
  see: ['ch31', 'ch16', 'credit-risk', 'card-interest']
},
'card-programmes': {
  brief: ['A card product is assembled from parts: a licensed issuer, a processor, a network, a programme manager and a dozen vendors.', 'Fintech cards, co-branded cards and corporate cards are usually built this way.', 'The customer sees one brand. Behind it, responsibilities are split by contract.'],
  sec: [
    ['The parts', '<p><strong>Issuer of record</strong>: the licensed bank whose name is on the terms and whose BIN the card uses. <strong>Programme manager</strong>: designs the product, owns the customer relationship and the app, and often takes the economic risk. <strong>Processor</strong>: runs authorisations and the ledger. <strong>Network</strong>. Plus vendors for card manufacture, identity checks, fraud, disputes, customer support and collections.</p>'],
    ['How the money is shared', '<p>Interchange, interest and fees are split by contract. A programme manager typically receives most of the interchange and pays the sponsor bank a fee and the processor per account and per transaction. That split, plus the cost of acquiring customers, decides whether a programme makes money.</p>'],
    ['Who is responsible', '<p>The issuer of record remains responsible to the regulator for compliance, KYC, complaints and the safety of customer funds, even when a partner does the work. Regulators have repeatedly reminded sponsor banks of this after partners failed.</p>'],
    ['Co-brands', '<p>In a co-brand the partner (an airline, retailer or app) brings customers and a reward currency; the bank brings the licence and the balance sheet. The partner is paid for each account and for each point issued.</p>']
  ],
  reg: { in: 'RBI’s rules on co-branded cards let the partner market the card but not access transaction data or take part in lending decisions. Card issuance by non-banks is limited; most fintech cards are issued through banks or as prepaid instruments.', us: 'Sponsor-bank programmes are common. Several sponsor banks received regulatory orders in 2024 over oversight of fintech partners, and the 2024 failure of a middleware firm left customers unable to reach their funds.', uk: 'Many cards are issued by e-money institutions or through principal-member banks. Safeguarding of customer funds is the central regulatory question.', au: 'Most programmes run through authorised deposit-taking institutions; payments licensing is being reformed to cover more non-bank providers.' },
  quiz: [['A fintech card’s programme manager fails. Who remains responsible to the regulator for customer funds?', ['The issuing bank', 'The card network', 'Nobody'], ''], ['What does a co-brand partner usually contribute?', ['Customers and a reward currency', 'The banking licence', 'The processor'], '']],
  see: ['bins', 'baas', 'issuer-processor', 'prepaid-cards']
},
'commercial-cards': {
  brief: ['Businesses use cards for travel, purchasing, fuel and paying suppliers.', 'Commercial cards carry richer data, different liability and higher interchange than consumer cards.', 'Single-use virtual card numbers have become a standard way to pay invoices.'],
  sec: [
    ['The types', '<p><strong>Corporate (travel and expense)</strong> cards for employees. <strong>Purchasing cards</strong> for buying supplies, with limits by merchant category. <strong>Fleet cards</strong> for fuel and vehicle costs, capturing mileage and fuel type. <strong>Lodge or central travel accounts</strong> held by a travel agency for a company’s bookings. <strong>Virtual cards</strong>: numbers generated per supplier or per invoice.</p>'],
    ['Who is liable', '<p>Under <strong>corporate liability</strong> the company owes the issuer. Under <strong>individual liability</strong> the employee does and claims expenses back. Joint liability splits it. This affects credit checks, credit reporting and what happens when an employee leaves.</p>'],
    ['Better data', '<p>Commercial transactions can carry Level 2 and Level 3 data: tax amounts, customer codes, line items. Suppliers that send it may qualify for lower interchange, and buyers can reconcile spending automatically.</p>'],
    ['Paying invoices by virtual card', '<p>Instead of a bank transfer, a company pays a supplier with a single-use card number for the exact invoice amount. The buyer gets extra days of credit and often a rebate funded by interchange; the supplier gets paid quickly but pays the acceptance fee. Whether suppliers accept depends on their margins.</p>'],
    ['Pricing', '<p>Commercial cards sit outside consumer interchange caps in many regions, so they cost merchants more. That pays for rebates to the corporate customer and expense-management software.</p>']
  ],
  quiz: [['Why do companies like paying suppliers by virtual card?', ['Extra days of credit, rebates and automatic reconciliation', 'Suppliers are required to accept them', 'They are cheaper for the supplier'], ''], ['Under individual liability, who owes the card issuer?', ['The employee', 'The company', 'The supplier'], '']],
  see: ['charge-cards', 'ch26', 'mcc', 'reconciliation']
}
});
})();
