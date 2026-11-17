export const EMAIL = 'aditya.rathore10101@gmail.com';

/**
 * Gmail compose link. `mailto:` only works when a desktop mail client is
 * configured, which is why it silently did nothing for visitors without one.
 */
export function gmailCompose(subject = 'Hello Aditya') {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=${encodeURIComponent(subject)}`;
}
