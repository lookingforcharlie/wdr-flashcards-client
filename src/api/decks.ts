import { API_URL } from './config';

export async function createDeck(title: string) {
  // without headers, body ain't gonna  be sent over to API, because by default, 'content-type' is text/plain
  const res = await fetch(`${API_URL}/decks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
    }),
  });
  const data = await res.json();
  return data;
}

export async function deleteDeck(deckId: string) {
  // don't put ':' in between 'deckId' and '/'
  await fetch(`${API_URL}/decks/${deckId}`, {
    method: 'DELETE',
  });
}
