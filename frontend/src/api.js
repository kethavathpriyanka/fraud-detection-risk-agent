const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function analyzeTransaction(payload) {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('Backend analysis failed');
  return response.json();
}
