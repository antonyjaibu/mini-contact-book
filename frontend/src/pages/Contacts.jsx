
import { useEffect, useMemo, useState } from 'react';
import ContactDetails from '../components/ContactDetails';
import ContactForm from '../components/ContactForm';
import ContactList from '../components/ContactList';
import Navbar from '../components/Navbar';
import * as api from '../services/api';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [formState, setFormState] = useState(null); // null | {} | contact
  const [error, setError] = useState('');

  const loadContacts = async (searchTerm = '') => {
    setLoading(true);
    try {
      const { data } = await api.fetchContacts(searchTerm);
      setContacts(data);
    } catch (err) {
      setError('Could not load contacts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Debounced search
  useEffect(() => {
    const handle = setTimeout(() => {
      loadContacts(search);
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const selectedContact = useMemo(
    () => contacts.find((c) => c.id === selectedId) || null,
    [contacts, selectedId]
  );

  const handleCreate = async (payload) => {
    const { data } = await api.createContact(payload);
    setContacts((prev) =>
      [...prev, data].sort((a, b) => a.name.localeCompare(b.name))
    );
    setSelectedId(data.id);
    setFormState(null);
  };

  const handleUpdate = async (payload) => {
    const { data } = await api.updateContact(formState.id, payload);
    setContacts((prev) =>
      prev
        .map((c) => (c.id === data.id ? data : c))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
    setFormState(null);
  };

  const handleDelete = async (contact) => {
    if (!window.confirm(`Delete ${contact.name}? This can't be undone.`)) {
      return;
    }
    await api.deleteContact(contact.id);
    setContacts((prev) => prev.filter((c) => c.id !== contact.id));
    if (selectedId === contact.id) setSelectedId(null);
  };

  return (
    <div className="app-shell">
      <Navbar />
      {error && <p className="form-error page-error">{error}</p>}
      <main className="contacts-layout">
        <ContactList
          contacts={contacts}
          selectedId={selectedId}
          onSelect={setSelectedId}
          search={search}
          onSearchChange={setSearch}
          onNewContact={() => setFormState({})}
          loading={loading}
        />
        <ContactDetails
          contact={selectedContact}
          onEdit={(contact) => setFormState(contact)}
          onDelete={handleDelete}
        />
      </main>

      {formState !== null && (
        <ContactForm
          initial={formState.id ? formState : null}
          onSubmit={formState.id ? handleUpdate : handleCreate}
          onCancel={() => setFormState(null)}
        />
      )}
    </div>
  );
}
