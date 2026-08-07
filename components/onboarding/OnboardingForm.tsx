"use client";
import { useEffect, useState } from "react";
import BrandMark from "@/components/BrandMark";
import SearchSelect from "@/components/onboarding/SearchSelect";
import {
  identifyAndTrackTikTok,
  trackTikTok,
} from "@/lib/analytics/tiktok";
import { COUNTRIES, CURRENCIES, flagEmoji } from "@/lib/onboarding/countries";
import { isGenericToken } from "@/lib/onboarding/generic";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const UserIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 19.5c1.2-3 3.9-4.5 7-4.5s5.8 1.5 7 4.5" />
  </svg>
);
const MailIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 7 7.5 6 7.5-6" />
  </svg>
);
const PhoneIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M6.6 3.8 8.8 6a1.6 1.6 0 0 1 0 2.2l-1 1a13.5 13.5 0 0 0 7 7l1-1a1.6 1.6 0 0 1 2.2 0l2.2 2.2a1.5 1.5 0 0 1-.1 2.2c-1.3 1.1-3.2 1.5-4.8.9-5-1.9-9-5.9-10.9-10.9-.6-1.6-.2-3.5.9-4.8a1.5 1.5 0 0 1 2.2-.1Z" />
  </svg>
);
const CoinsIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <ellipse cx="12" cy="6.5" rx="7" ry="3" />
    <path d="M5 6.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
    <path d="M5 11.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
  </svg>
);

type Errors = Partial<
  Record<"firstName" | "lastName" | "email" | "phone" | "country" | "amount", string>
>;

export default function OnboardingForm({ id, sig }: { id: string; sig: string }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dial, setDial] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    trackTikTok("ViewContent", {
      contents: [
        {
          content_id: "sector1_onboarding",
          content_type: "product",
          content_name: "Sector1 VIP access registration",
        },
      ],
    });
  }, []);

  const phoneDigits = phone.replace(/[\s().-]/g, "");

  function validate(): Errors {
    const e: Errors = {};
    if (!firstName.trim()) e.firstName = "Enter your first name";
    if (!lastName.trim()) e.lastName = "Enter your last name";
    if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email";
    if (phoneDigits && !/^\d{4,14}$/.test(phoneDigits)) e.phone = "Enter a valid phone number";
    else if (phoneDigits && !dial) e.phone = "Select your country code";
    if (!country) e.country = "Select your country";
    const value = Number(amount);
    if (!amount.trim() || !Number.isFinite(value) || value <= 0) {
      e.amount = "Enter your deposit amount";
    }
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSending(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id,
          sig,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone_dial: phoneDigits ? dial : "",
          phone_number: phoneDigits,
          country,
          deposit_amount: Number(amount),
          deposit_currency: currency,
          source_url: window.location.origin + window.location.pathname,
        }),
      });
      if (res.ok) {
        const { conversion } = (await res.json()) as { conversion?: boolean };
        setDone(true);
        if (conversion) {
          void identifyAndTrackTikTok(
            "Purchase",
            {
              email,
              phoneNumber: phoneDigits ? `+${dial}${phoneDigits}` : undefined,
              externalId: isGenericToken(id) ? undefined : id,
            },
            {
              contents: [
                {
                  content_id: "sector1_vip_access",
                  content_type: "product",
                  content_name: "Sector1 VIP access",
                },
              ],
              value: Number(amount),
              currency,
            },
          );
        }
      } else if (res.status === 429) {
        setSubmitError(
          "You've already submitted recently. Please wait an hour and try again.",
        );
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="ob-card ob-center">
        <div className="ob-logo">
          <BrandMark size={48} />
        </div>
        <div className="ob-done-check" aria-hidden="true">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="m8 12 2.6 2.6L16 9" />
          </svg>
        </div>
        <h2 className="ob-done-title">Thank You!</h2>
        <p className="ob-done-text">
          Thank you! Click below to access the VIP group.
        </p>
        <a
          className="btn btn-green btn-xl btn-block"
          href="https://linktr.ee/S1bX7jNllz"
          target="_blank"
          rel="noopener noreferrer"
        >
          CLICK HERE TO JOIN
        </a>
      </div>
    );
  }

  return (
    <form className="ob-card" onSubmit={onSubmit} noValidate>
      <div className="ob-logo">
        <BrandMark size={48} />
      </div>

      <div className="ob-field">
        <label className="ob-label" htmlFor="ob-first">
          First Name <span className="ob-req">*</span>
        </label>
        <div className="ob-input-wrap">
          {UserIcon}
          <input
            id="ob-first"
            className="ob-input"
            autoComplete="given-name"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        {errors.firstName && <p className="ob-error">{errors.firstName}</p>}
      </div>

      <div className="ob-field">
        <label className="ob-label" htmlFor="ob-last">
          Last Name <span className="ob-req">*</span>
        </label>
        <div className="ob-input-wrap">
          {UserIcon}
          <input
            id="ob-last"
            className="ob-input"
            autoComplete="family-name"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        {errors.lastName && <p className="ob-error">{errors.lastName}</p>}
      </div>

      <div className="ob-field">
        <label className="ob-label" htmlFor="ob-email">
          Email <span className="ob-req">*</span>
        </label>
        <div className="ob-input-wrap">
          {MailIcon}
          <input
            id="ob-email"
            className="ob-input"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {errors.email && <p className="ob-error">{errors.email}</p>}
      </div>

      <div className="ob-field">
        <label className="ob-label" htmlFor="ob-phone">
          Phone Number
        </label>
        <div className="ob-phone">
          <SearchSelect
            wide
            ariaLabel="Country code"
            placeholder="Select Code"
            value={dial}
            onChange={setDial}
            options={COUNTRIES.map((c) => ({
              value: c.dial,
              label: `${flagEmoji(c.code)} +${c.dial} ${c.name}`,
            }))}
          />
          <div className="ob-input-wrap">
            {PhoneIcon}
            <input
              id="ob-phone"
              className="ob-input"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        {errors.phone && <p className="ob-error">{errors.phone}</p>}
      </div>

      <div className="ob-field">
        <label className="ob-label" htmlFor="ob-country">
          Country <span className="ob-req">*</span>
        </label>
        <SearchSelect
          id="ob-country"
          ariaLabel="Country"
          placeholder="Select country"
          value={country}
          onChange={setCountry}
          options={COUNTRIES.map((c) => ({
            value: c.code,
            label: `${flagEmoji(c.code)} ${c.name}`,
          }))}
        />
        {errors.country && <p className="ob-error">{errors.country}</p>}
      </div>

      <div className="ob-row2">
        <div className="ob-field">
          <label className="ob-label" htmlFor="ob-amount">
            Deposit Amount <span className="ob-req">*</span>
          </label>
          <div className="ob-input-wrap">
            {CoinsIcon}
            <input
              id="ob-amount"
              className="ob-input"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <p className="ob-help">How much did you deposit?</p>
          {errors.amount && <p className="ob-error">{errors.amount}</p>}
        </div>
        <div className="ob-field">
          <label className="ob-label" htmlFor="ob-currency">
            Currency
          </label>
          <SearchSelect
            id="ob-currency"
            ariaLabel="Currency"
            value={currency}
            onChange={setCurrency}
            options={CURRENCIES.map((c) => ({
              value: c.code,
              label: `${flagEmoji(c.flag)} ${c.label}`,
            }))}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-green btn-xl btn-block" disabled={sending}>
        {sending ? "SENDING…" : "CLICK HERE"}
      </button>
      {submitError && <p className="ob-error ob-error-submit">{submitError}</p>}
    </form>
  );
}
