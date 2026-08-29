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

The **Payments** section (`#payments`) now has a real, working integration with **Paystack** for the **Card** and **M-Pesa** tabs — Paystack's checkout popup handles both, since Paystack in Kenya supports Visa/Mastercard/Verve cards worldwide and M-Pesa STK Push from one account. The **Bank Transfer** tab shows your live account details, and the **PayPal** tab is still a placeholder (see below).

**Bank details currently shown on the site:**
- Account name: **DOVE ASSET MANAGEMENT**
- Bank: **Cooperative Bank of Kenya**, Kangemi Branch
- Account number: **01192763735500**
- Bank code: **11000**
- SWIFT/BIC: **KCOOKENA**

### Making Card & M-Pesa go live with Paystack

The checkout code is already in place (`js/script.js`, using Paystack's official Inline library loaded in `index.html`). It currently uses a placeholder public key, so nothing charges yet. To activate it:

1. **Create a Paystack account** at [paystack.com](https://paystack.com) for Dove Asset Management, and complete their business verification (KYC).
2. In your Paystack Dashboard, add the **Cooperative Bank account (01192763735500, Kangemi Branch)** as your settlement account — this is what routes collected payments there. Typically it takes about 3 working days after a customer pays for funds to reach your account.
3. If you want to accept cards from **outside Kenya**, request **"Accept international payments"** under Dashboard → Preferences — this isn't automatic.
4. Go to Dashboard → Settings → **API Keys & Webhooks** and copy your **Public Key** (starts with `pk_test_...` in test mode, `pk_live_...` once you switch to live).
5. Open `js/script.js`, find this line near the top of the Payments section:
   ```js
   const PAYSTACK_PUBLIC_KEY = "pk_test_REPLACE_WITH_YOUR_PAYSTACK_PUBLIC_KEY";
   ```
   Replace it with your real key.
6. Test a payment using [Paystack's test cards](https://paystack.com/docs/payments/test-payments/) while still in test mode.
7. **Set up server-side verification before accepting real money.** The current code trusts Paystack's browser callback to show a confirmation message — that's fine for testing, but a determined person could fake that callback. Before going live, add a small backend endpoint that calls Paystack's `GET /transaction/verify/:reference` using your **secret key** (never expose the secret key in this front-end code), and only mark an order/invoice as paid once that server-side check succeeds. This also lets you receive Paystack's webhook events for extra reliability.
8. Once verified end-to-end, switch `PAYSTACK_PUBLIC_KEY` to your `pk_live_...` key.

Card details are never collected or stored on this website — Paystack's popup collects them directly inside its own secure iframe, which is what keeps this site out of PCI-DSS scope. Paystack itself is PCI DSS Level 1 certified, the highest tier available.

### PayPal (not yet connected)

The PayPal tab still shows a placeholder alert. To connect it, add the [PayPal Checkout SDK](https://developer.paypal.com/sdk/js/) and, like Paystack, verify completed orders server-side before treating them as paid — see PayPal's [Standard Checkout integration guide](https://developer.paypal.com/docs/checkout/standard/).

### General security notes
- Serve the site over **HTTPS** (GitHub Pages does this automatically) — never collect payment info over plain HTTP.
- Never commit a secret key to this repository, in any file, at any point.
- Keep the public key as the *only* payment credential that lives in this front-end code.

If you'd like, I can build the backend verification endpoint next — that needs a small server (e.g. a Node/Express app on Render, Vercel, or similar) since GitHub Pages only serves static files and can't run this logic on its own.
