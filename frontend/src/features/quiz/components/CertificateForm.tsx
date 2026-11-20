import { useState } from 'react';
import { Download } from 'lucide-react';
import { downloadCertificate } from '../certificate';

// Shown once every answer is right: name and email go onto a PDF
// certificate made in the browser. They are not sent or stored.
export function CertificateForm() {
  const [status, setStatus] = useState<'idle' | 'working' | 'error'>('idle');

  async function submit(event: {
    preventDefault(): void;
    currentTarget: HTMLFormElement;
  }) {
    event.preventDefault();
    const field = (key: string) =>
      (
        event.currentTarget.elements.namedItem(key) as HTMLInputElement
      ).value.trim();
    const name = field('name');
    const email = field('email');
    if (!name || !email) return;
    setStatus('working');
    try {
      await downloadCertificate(name, email);
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="certificate" aria-labelledby="certificate-title">
      <h4 id="certificate-title">Get your certificate</h4>
      <p>
        Enter your name and email to download a PDF certificate of completion
        from CubSpace. Your details only appear on the certificate; they are not
        sent or saved.
      </p>
      <form className="certificate-form" onSubmit={submit}>
        <label>
          <span>Name</span>
          <input
            name="name"
            required
            maxLength={80}
            // At least one character that is not a space.
            pattern=".*\S.*"
            autoComplete="name"
          />
        </label>
        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            maxLength={120}
            autoComplete="email"
          />
        </label>
        <button type="submit" disabled={status === 'working'}>
          <Download aria-hidden="true" />
          {status === 'working' ? 'Preparing…' : 'Download certificate'}
        </button>
      </form>
      {status === 'error' && (
        <p className="certificate-error" role="alert">
          The certificate could not be made in this browser. Please try again.
        </p>
      )}
    </section>
  );
}
