import { TCard } from '../App';
import { API_URL } from './config';

export async function createCard(
  textFront: string,
  textBack: string,
  deckId: string
): Promise<TCard[]> {
  // without headers, body ain't gonna  be sent over to API, because by default, 'content-type' is text/plain
  const res = await fetch(`${API_URL}/decks/${deckId}/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      textFront,
      textBack,
    }),
  });
  const data = await res.json();
  return data.cards;
}

export async function deleteCard(deckId: string, cardIdx: number) {
  // don't put ':' in between 'deckId' and '/'
  await fetch(`${API_URL}/decks/${deckId}/cards/${cardIdx}`, {
    method: 'DELETE',
  });
}
