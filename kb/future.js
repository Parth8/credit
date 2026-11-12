// Guides: what comes next. Schema: see CLAUDE.md ("Guide schema").
(() => {
const { pick } = DCC;
Object.assign(window.DCC_KB = window.DCC_KB || {}, {
'stablecoins': {
  brief: ['A stablecoin is a token on a blockchain designed to hold a fixed value, usually one US dollar.', 'The reliable ones are backed one for one by cash and short-term government debt, and can be redeemed with the issuer.', 'Payments firms now use them for settlement and cross-border transfers; regulation is catching up.'],
  sec: [
    ['How the peg holds', '<p>A reserve-backed stablecoin issuer takes in dollars, holds them as cash and Treasury bills, and issues tokens. Approved customers can redeem tokens for dollars, so if the market price slips below one dollar, traders buy cheap tokens and redeem them at par. The peg is only as strong as the reserves and the redemption promise. An “algorithmic” stablecoin with no real reserves collapsed in 2022; even a well-backed one briefly lost its peg in 2023 when part of its reserves sat in a failing bank.</p>'],
    ['What they are used for', '<p>Most volume is still crypto trading. Growing uses: business-to-business cross-border payments, remittances, treasury movements between a company’s subsidiaries outside banking hours, and card network settlement. Since late 2025 some US banks have been able to settle with Visa in USDC over a public blockchain, including at weekends.</p>'],
    ['Advantages and catches', '<p>They move at any hour, settle in minutes, and work wherever the blockchain does. But converting to and from local currency still needs banks or exchanges, compliance checks still apply, transfers are usually irreversible, and consumer protection is thinner than with cards.</p>'],
    ['Regulation', `<p>The US passed the GENIUS Act in July 2025, requiring payment stablecoins to be fully reserved and issued by licensed entities; regulators missed their July 2026 deadline for final rules, and the law takes effect by January 2027. The EU’s MiCA regulation has governed stablecoins since 2024. The UK is building a regime split between the FCA and the Bank of England. ${pick({ in: 'India has no framework for private stablecoins and the RBI has repeatedly argued against them, preferring the e-rupee.', us: '', uk: '', au: 'Australia is folding stablecoins into its payments licensing reforms.' })}</p>`]
  ],
  facts: [['Backing', 'Cash and short-term government debt'], ['Largest', 'Dollar-denominated'], ['US law', 'GENIUS Act (2025), rules still being finalised'], ['EU law', 'MiCA']],
  quiz: [['What keeps a reserve-backed stablecoin at one dollar?', ['Reserves and the right to redeem at par', 'Government guarantee', 'An algorithm'], ''], ['Are stablecoin transfers reversible like card payments?', ['Usually not', 'Yes, within 60 days', 'Only abroad'], '']],
  see: ['cbdc', 'swift', 'central-bank-money', 'ch21']
},
'cbdc': {
  brief: ['A central bank digital currency is central bank money in digital form.', 'A retail CBDC would be digital cash for the public; a wholesale one is for settlement between institutions.', 'Countries have taken opposite paths: some are piloting, some have ruled it out.'],
  sec: [
    ['Retail and wholesale', '<p>A <strong>retail</strong> CBDC lets the public hold a direct claim on the central bank in an app, as cash is today. A <strong>wholesale</strong> CBDC, or tokenised reserves, lets banks and market infrastructures settle on new platforms in central bank money.</p>'],
    ['Why build one', '<p>To keep public money relevant as cash use falls. To give a public alternative to private stablecoins and foreign payment platforms. To improve cross-border payments. To enable programmability and offline payments.</p>'],
    ['The objections', '<p>Privacy: the state could see spending. Bank funding: deposits could move into CBDC in a crisis, so most designs cap holdings. Cost and complexity. And the question of whether existing instant payments already solve the problem.</p>'],
    ['Where things stand', `<p>${pick({ in: 'India’s e-rupee has been in pilot since December 2022, with millions of users, offline payments and programmable features being tested, and interoperability with UPI QR codes.', us: 'The US has ruled out a retail CBDC: a January 2025 executive order barred agencies from pursuing one.', uk: 'The UK’s digital pound remains in the design phase, with officials openly questioning whether it is needed alongside private innovation.', au: 'Australia has focused on wholesale uses, testing tokenised settlement with industry rather than a retail digital dollar.' })} The European Central Bank completed its preparation phase in 2025 and is working towards a possible first issuance around 2029, subject to legislation. China’s e-CNY is the largest retail pilot. Many central banks are also testing wholesale tokenised settlement.</p>`]
  ],
  facts: [['Retail CBDC', 'Digital cash for the public'], ['Wholesale CBDC', 'Settlement between institutions'], ['Usual safeguard', 'Holding limits'], ['Biggest debate', 'Privacy and bank funding']],
  quiz: [['Why do most retail CBDC designs cap how much a person can hold?', ['To stop deposits draining from banks in a crisis', 'To save storage', 'To limit inflation'], ''], ['Which is a wholesale CBDC use?', ['Banks settling securities trades in tokenised central bank money', 'Paying for coffee', 'Paying taxes by app'], '']],
  see: ['central-bank-money', 'stablecoins', 'upi']
},
'agentic-commerce': {
  brief: ['AI agents can now search, choose and pay on your behalf.', 'Networks and wallets issue agents their own scoped tokens and add signals that tell merchants an agent is acting for a verified person.', 'Who is liable when an agent buys the wrong thing is not yet settled.'],
  sec: [
    ['How an agent pays', '<p>You connect a card to an AI assistant. Instead of your card number, the network issues an <strong>agent token</strong> bound to that agent, often limited to a merchant, an amount or a time window. When the agent checks out, the merchant receives the token plus signals identifying the agent, and the payment runs as a normal authorisation.</p>'],
    ['Mandates', '<p>Emerging protocols record what you asked for as a signed mandate: an <em>intent</em> (“a return flight to Delhi under this price”) and later a <em>cart</em> (this exact itinerary). The mandate is evidence of what you authorised if the purchase is disputed.</p>'],
    ['The new questions', '<p>If an agent is tricked by a fake shop or a manipulated listing, is that fraud on the cardholder, a merchant problem, or the agent provider’s fault? Dispute rules were written for humans. Merchants also have to tell good agents from bots that scrape and test stolen cards.</p>'],
    ['Using one sensibly', '<p>Set limits per purchase and per month, require approval above a threshold, restrict merchants and block subscriptions. Chapter XXI lets you practise this.</p>']
  ],
  facts: [['Credential', 'Network agent token'], ['Evidence', 'Signed intent and cart mandates'], ['Open question', 'Liability when an agent is deceived'], ['Your control', 'Limits, approvals, merchant restrictions']],
  quiz: [['Why issue an agent its own token instead of sharing your card number?', ['It can be scoped and revoked without replacing your card', 'Agents cannot read card numbers', 'It is cheaper'], ''], ['What is a cart mandate?', ['A signed record of the exact purchase you approved', 'A shopping list', 'A refund policy'], '']],
  see: ['ch21', 'ch28', 'stored-credentials', 'fraud-types']
}
});
})();
