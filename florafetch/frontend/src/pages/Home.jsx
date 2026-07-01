import { useEffect, useState } from 'react';
import api from '../api/client.js';
//12334

export default function Home() {
  const [status, setStatus] = useState('loading…');
//113345
  useEffect(() => {
    api
      .get('/health')
      .then((res) => setStatus(res.data.status))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>🌿 FloraFetch</h1>
      <p>
        Backend health: <strong>{status}</strong>
      </p>
    </main>
  );
}
