# Dove Asset Management — Website

A single corporate website for Dove Asset Management: global navigation with mega-menus, a properties/services/technology/people/insights/industries overview, and a full "About Dove" corporate page.

## File structure

```
dove-site/
├── index.html        ← the website (open this in a browser)
├── css/
│   └── style.css      ← all styling
├── js/
│   └── script.js       ← scroll effects, mobile menu
└── README.md
```

## View it locally

Just double-click `index.html`, or open it from your browser with `File → Open`. No build step, no dependencies to install.

## Upload to GitHub

1. Extract this zip file to a folder on your computer.
2. Go to [github.com/new](https://github.com/new) and create a new repository (e.g. `dove-asset-management`).
3. On the new repo's page, click **"uploading an existing file"**.
4. Drag in the `index.html` file, the `css` folder, and the `js` folder (drag the whole folders — GitHub keeps the structure).
5. Scroll down and click **Commit changes**.

## Publish it live for free with GitHub Pages

1. In your repository, go to **Settings → Pages**.
2. Under "Build and deployment," set **Source** to `Deploy from a branch`.
3. Set **Branch** to `main` and folder to `/ (root)`, then click **Save**.
4. After a minute, your site will be live at:
   `https://<your-github-username>.github.io/<repository-name>/`

## Making edits later

- Text and layout live in `index.html`.
- Colors, fonts, and spacing live in `css/style.css`.
- Scroll animations and the mobile menu toggle live in `js/script.js`.

Contact shown on the site: **support@doveassetmanagement** · **+254 753 221960**

## Wiring up real payments (important)

The **Payments** section (`#payments`) on the site is currently a **front-end UI only** — the "Pay securely," "Send M-Pesa prompt," and "Continue to PayPal" buttons show a placeholder alert. No money moves yet, and no card numbers are collected or stored (the card fields are intentionally disabled). This is deliberate: card details should never be handled directly by a plain webpage, since that requires PCI‑DSS certification. Instead, plug in an established gateway that takes on that compliance for you.

**Before this goes live, replace the placeholder details in `index.html` (search for "PLACEHOLDER"):**
- M-Pesa Paybill number (`[Paybill No.]`)
- Bank name, account number, and SWIFT/BIC code

**Recommended providers, matched to what you selected (cards + M‑Pesa + PayPal + bank transfer):**

| Method | Provider | Why |
|---|---|---|
| Cards (international) | [Stripe](https://stripe.com) or [Flutterwave](https://flutterwave.com) | Hosted Checkout or Elements keep card data off your server entirely |
| Cards + Mobile money (Africa-focused) | [Flutterwave](https://flutterwave.com) or [Paystack](https://paystack.com) | Both support Kenyan cards, M-Pesa, and multi-currency in one integration |
| M-Pesa (direct) | [Safaricom Daraja API](https://developer.safaricom.co.ke) | Official STK Push API for "Lipa na M-Pesa" prompts straight to a phone |
| PayPal | [PayPal Checkout SDK](https://developer.paypal.com/sdk/js/) | Drop-in redirect checkout, good for clients outside East Africa |
| Bank transfer | No gateway needed | Just keep the displayed account details accurate; reconcile manually or via your bank's API |

**General flow for any of these:**
1. Create a merchant/business account with the provider and complete their KYC verification.
2. Get API keys — keep the **secret** key on a server only, never in this front-end code.
3. Build a small backend (e.g. a Node/Express or Python/Flask endpoint) that creates the charge/checkout session using the secret key, and returns a session URL or client token to the page.
4. Replace each `.pay-submit` click handler in `js/script.js` with a call to your backend endpoint instead of the placeholder `alert()`.
5. Test with the provider's sandbox/test mode before switching to live keys.
6. Serve the site over **HTTPS** (GitHub Pages does this automatically) — never collect payment info over plain HTTP.

If you'd like, I can build the actual backend integration for one of these providers next — that requires choosing a host for the backend (e.g. a small Node server, Vercel/Render function, etc.) since GitHub Pages only serves static files and can't run this logic on its own.
