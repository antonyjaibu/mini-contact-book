const API_URL = import.meta.env.VITE_API_URL;
export default function ContactDetails({ contact, onEdit, onDelete }) {
  if (!contact) {
    return (
      <div className="contact-details empty-state">
        <p className="muted">Select a contact to see their details.</p>
      </div>
    );
  }

  const initial = (contact.name?.[0] || '?').toUpperCase();

  return (
    <div className="contact-details">
      <div className="contact-details-header">
        <div className="contact-avatar">{initial}</div>
        <div>
          <h2>{contact.name}</h2>
          {contact.company && <p className="muted">{contact.company}</p>}
        </div>
      </div>

      <dl className="contact-fields">
        <div className="contact-field">
          <dt>Email</dt>
          <dd>
            {contact.email ? (
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            ) : (
              <span className="muted">—</span>
            )}
          </dd>
        </div>
        <div className="contact-field">
          <dt>Phone</dt>
          <dd>
            {contact.phone ? (
              <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            ) : (
              <span className="muted">—</span>
            )}
          </dd>
        </div>
        <div className="contact-field">
          <dt>Company</dt>
          <dd>{contact.company || <span className="muted">—</span>}</dd>
        </div>
      </dl>

      <div className="contact-details-actions">
        <button className="btn-secondary" onClick={() => onEdit(contact)}>
          Edit
        </button>
        <button className="btn-danger" onClick={() => onDelete(contact)}>
          Delete
        </button>
      </div>
    </div>
  );
}
