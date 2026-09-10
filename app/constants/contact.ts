export const CONTACT = {
  email: "ashutoshsun@ucla.edu",
  github: "https://github.com/AshutoshSundresh",
  linkedin: "https://linkedin.com/in/asund",
  x: "https://x.com/asundresh",
} as const;

export const CONTACT_LINKS = [
  CONTACT.github,
  CONTACT.linkedin,
  CONTACT.x,
] as const;

export const CONTACT_EMAIL_HREF = `mailto:${CONTACT.email}`;

/**
 * Opens ChatGPT with a search-grounded prompt about the site owner.
 * Deliberately kept out of CONTACT_LINKS: that array feeds the JSON-LD
 * `sameAs`, which is for profiles, not queries about the person.
 */
export const GPT_PROMPT = "Who is Ashutosh Sundresh?";

export const GPT_HREF = `https://chatgpt.com/?hints=search&prompt=${encodeURIComponent(GPT_PROMPT)}`;
