
import { useMemo } from 'react';

/**
 * Groups contacts alphabetically by the first letter of their name and
 * renders a scrollable, searchable list. Selecting a contact notifies
 * the parent via onSelect.
 */
export default function ContactList({
  contacts,
  selectedId,
  onSelect,
  search,
  onSearchChange,
  onNewContact,
  loading,
}) {
  const grouped = useMemo(() => {
    const groups = {};
    contacts.forEach((contact) => {
      const letter = (contact.name?.[0] || '#').toUpperCase();
      const key = /[A-Z]/.test(letter) ? letter : '#';
      if (!groups[key]) groups[key] = [];
      groups[key].push(contact);
    });
    return Object.keys(groups)
      .sort()
      .map((letter) => ({ letter, items: groups[letter] }));
  }, [contacts]);

  return (
    <div className="contact-list">
      <div className="contact-list-header">
        <input
          type="text"
          className="search-input"
          placeholder="Search contacts…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button className="btn-primary" onClick={onNewContact}>
          + New
        </button>
      </div>

      <div className="contact-list-scroll">
        {loading && <p className="muted">Loading contacts…</p>}

        {!loading && contacts.length === 0 && (
          <p className="muted">No contacts found.</p>
        )}

        {!loading &&
          grouped.map((group) => (
            <div key={group.letter} className="contact-group">
              <div className="contact-group-label">{group.letter}</div>
              {group.items.map((contact) => (
                <button
                  key={contact.id}
                  className={
                    'contact-list-item' +
                    (contact.id === selectedId ? ' selected' : '')
                  }
                  onClick={() => onSelect(contact.id)}
                >
                  <div className="contact-list-item-name">{contact.name}</div>
                  {contact.company && (
                    <div className="contact-list-item-sub">{contact.company}</div>
                  )}
                </button>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
