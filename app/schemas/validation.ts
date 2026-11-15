/**
 * Client-side validation (UX). The backend validates the same rules again (app/schemas.py),
 * so keep both in sync. Every validator returns an object { field: message } that is empty
 * when the data is valid.
 */

export type FieldErrors = Record<string, string>;

export const MIN_YEAR = 2000;
export const MAX_YEAR = 2100;
export const MAX_AMOUNT = 9_999_999.99;
export const MAX_CHAT_MESSAGE = 2000;

const EMAIL_RE = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}$/;
const COLOR_RE = /^(#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6}|[a-zA-Z]{3,20})$/;

export function hasErrors (errors: FieldErrors) {
    return Object.keys(errors).length > 0;
}

/** Reads the message the backend sent: {message}, {detail: "..."} or FastAPI's {detail: [{msg}]}. */
export function apiErrorMessage (data: unknown, fallback = "Something went wrong, try again.") {
    if (data && typeof data === "object") {
        const body = data as { message?: unknown, detail?: unknown };

        if (typeof body.message === "string" && body.message) return body.message;
        if (typeof body.detail === "string" && body.detail) return body.detail;

        if (Array.isArray(body.detail) && body.detail.length > 0) {
            const first = body.detail[0] as { msg?: unknown };
            if (typeof first?.msg === "string") return first.msg;
        }
    }

    return fallback;
}

export function validateLogin (data: { email: string, password: string }): FieldErrors {
    const errors: FieldErrors = {};

    if (!data.email.trim()) errors.email = "Enter your email.";
    else if (!EMAIL_RE.test(data.email.trim())) errors.email = "Enter a valid email, like name@example.com.";

    if (!data.password) errors.password = "Enter your password.";

    return errors;
}

export function validateSignUp (data: { username: string, email: string, password: string }, acceptedTerms: boolean): FieldErrors {
    const errors: FieldErrors = {};

    const username = data.username.trim();
    if (username.length < 2 || username.length > 100) errors.username = "Username must have between 2 and 100 characters.";

    const email = data.email.trim();
    if (!email) errors.email = "Enter your email.";
    else if (email.length > 100 || !EMAIL_RE.test(email)) errors.email = "Enter a valid email, like name@example.com.";

    if (data.password.length < 8) errors.password = "Password must have at least 8 characters.";
    else if (new TextEncoder().encode(data.password).length > 72) errors.password = "Password is too long (72 bytes maximum).";
    else if (!data.password.trim()) errors.password = "Password can not be only spaces.";

    if (!acceptedTerms) errors.terms = "You must accept the terms and privacy notice.";

    return errors;
}

export function validateTransaction (
    data: { date: string, description: string, category: string, card: string, amount: number },
    options: { categories?: string[], cards?: string[] } = {}
): FieldErrors {
    const errors: FieldErrors = {};

    if (!data.date) errors.date = "Select a date.";
    else {
        const year = Number(data.date.slice(0, 4));
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(data.date))) errors.date = "Enter a valid date.";
        else if (year < MIN_YEAR || year > MAX_YEAR) errors.date = `Year must be between ${MIN_YEAR} and ${MAX_YEAR}.`;
    }

    if (!data.category) errors.category = "Select a category.";
    else if (options.categories && options.categories.length > 0 && !options.categories.includes(data.category)) errors.category = "Select a valid category.";

    if (!data.card) errors.card = "Select a card or cash.";
    else if (options.cards && data.card !== "Cash" && !options.cards.includes(data.card)) errors.card = "Select a valid card.";

    const amount = Number(data.amount);
    if (!Number.isFinite(amount) || amount === 0) errors.amount = "Enter an amount different from 0.";
    else if (Math.abs(amount) > MAX_AMOUNT) errors.amount = "The amount is too large.";
    else if (Math.round(amount * 100) / 100 !== amount) errors.amount = "Use at most 2 decimals.";

    const description = data.description.trim();
    if (!description) errors.description = "Write a description.";
    else if (description.length > 500) errors.description = "Description must have at most 500 characters.";

    return errors;
}

export function validateCard (
    data: { name: string, type: string, last_numbers: string, expired_date: string, background_color: string, color: string },
    options: { otherNames?: string[] } = {}
): FieldErrors {
    const errors: FieldErrors = {};

    const name = data.name.trim();
    if (!name || name.length > 30) errors.name = "Name must have between 1 and 30 characters.";
    else if (name.toLowerCase() === "cash") errors.name = "\"Cash\" is reserved, choose another name.";
    else if (options.otherNames?.some(other => other.trim().toLowerCase() === name.toLowerCase())) errors.name = "You already have a card with that name.";

    if (data.type !== "Credit" && data.type !== "Debit") errors.type = "Select Credit or Debit.";

    if (!/^\d{4}$/.test(data.last_numbers)) errors.last_numbers = "Enter exactly 4 digits.";

    const expired = (data.expired_date ?? "").slice(0, 7);
    if (!expired) errors.expired_date = "Select the expiration month.";
    else if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(expired)) errors.expired_date = "Enter a valid expiration month.";
    else if (Number(expired.slice(0, 4)) < MIN_YEAR || Number(expired.slice(0, 4)) > MAX_YEAR) errors.expired_date = `Year must be between ${MIN_YEAR} and ${MAX_YEAR}.`;

    if (!COLOR_RE.test(data.background_color) || !COLOR_RE.test(data.color)) errors.colors = "Pick valid colors.";

    return errors;
}

/** Month/year filters of the Resume page. Returns "" when valid. */
export function validatePeriod (month: string, year: string): string {
    if (month && !year) return "Select a year to filter by month.";

    if (year) {
        if (!/^\d{4}$/.test(year) || Number(year) < MIN_YEAR || Number(year) > MAX_YEAR) return `Year must have 4 digits, between ${MIN_YEAR} and ${MAX_YEAR}.`;
    }

    return "";
}

export function validateChatMessage (message: string): string {
    const trimmed = message.trim();

    if (!trimmed) return "Write a message.";
    if (trimmed.length > MAX_CHAT_MESSAGE) return `Message must have at most ${MAX_CHAT_MESSAGE} characters.`;

    return "";
}
