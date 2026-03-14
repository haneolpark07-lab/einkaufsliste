import { useState, useEffect } from 'react';

const API = 'http://localhost:3000';

function App() {
  const [artikel, setArtikel] = useState([]);
  const [neuerArtikel, setNeuerArtikel] = useState('');
  const [bearbeiterId, setBearbeiterId] = useState(null);
  const [bearbeiterName, setBearbeiterName] = useState('');

  // Alle Artikel laden
  useEffect(() => {
    fetch(`${API}/artikel`)
      .then(res => res.json())
      .then(data => setArtikel(data));
  }, []);

  // Artikel hinzufügen
  const hinzufuegen = () => {
    if (!neuerArtikel.trim()) return;
    fetch(`${API}/artikel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: neuerArtikel }),
    })
      .then(res => res.json())
      .then(data => {
        setArtikel([...artikel, data]);
        setNeuerArtikel('');
      });
  };

  // Artikel löschen
  const loeschen = (id) => {
    fetch(`${API}/artikel/${id}`, { method: 'DELETE' })
      .then(() => setArtikel(artikel.filter(a => a.id !== id)));
  };

  // Artikel aktualisieren
  const aktualisieren = (id) => {
    if (!bearbeiterName.trim()) return;
    fetch(`${API}/artikel/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: bearbeiterName }),
    })
      .then(res => res.json())
      .then(data => {
        setArtikel(artikel.map(a => a.id === id ? data : a));
        setBearbeiterId(null);
        setBearbeiterName('');
      });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>🛒 Einkaufsliste</h1>

      {/* Neuen Artikel hinzufügen */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          value={neuerArtikel}
          onChange={e => setNeuerArtikel(e.target.value)}
          placeholder="Artikel eingeben..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button onClick={hinzufuegen} style={{ padding: '8px 16px' }}>
          Hinzufügen
        </button>
      </div>

      {/* Artikelliste */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {artikel.map(a => (
          <li key={a.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
            {bearbeiterId === a.id ? (
              <>
                <input
                  value={bearbeiterName}
                  onChange={e => setBearbeiterName(e.target.value)}
                  style={{ flex: 1, padding: '8px' }}
                />
                <button onClick={() => aktualisieren(a.id)}>Speichern</button>
                <button onClick={() => setBearbeiterId(null)}>Abbrechen</button>
              </>
            ) : (
              <>
                <span style={{ flex: 1 }}>{a.name}</span>
                <button onClick={() => { setBearbeiterId(a.id); setBearbeiterName(a.name); }}>Bearbeiten</button>
                <button onClick={() => loeschen(a.id)}>Löschen</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;