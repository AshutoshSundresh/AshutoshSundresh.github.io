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
