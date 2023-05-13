import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TCard, TDeck } from './App';
import Card from './Card';
import { createCard, deleteCard } from './api/cards';
import { API_URL } from './api/config';

const Deck = () => {
  const [textFront, setTextFront] = useState<string>('');
  const [textBack, setTextBack] = useState<string>('');
  const [isEditable, setIsEditable] = useState<boolean>(false);

  // create a hook to store the index number of the card that will be modified
  // I need the index to hit the endpoint
  const [modifyCardIndex, setModifyCardIndex] = useState<number>();

  const [cards, setCards] = useState<TCard[]>([]);
  const [deck, setDeck] = useState<TDeck>();

  let { deckId } = useParams();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      fetch(`${API_URL}/decks/${deckId}/cards`, { signal }).then(
        async (res) => {
          const data = await res.json();
          setDeck(data);
          setCards(data.cards);
        }
      );
    } catch (error) {
      console.log('err:', error);
    }

    return () => {
      controller.abort();
    };
  }, []);

  const handleCreateCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // when isEditable is false, it's simply a Create Card function
    if (isEditable === false) {
      const cardText = await createCard(textFront, textBack, deckId!);
      console.log('created cards (client):', cardText);
      setCards(cardText);
    }

    // when isEditable is true, it's a modify card function
    if (isEditable === true) {
      // modify card function
      console.log('inside isEditable is true:', modifyCardIndex);

      const res = await fetch(
        `${API_URL}/decks/${deckId}/cards/${modifyCardIndex}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            textFront,
            textBack,
          }),
        }
      );
      const data = await res.json();
      setIsEditable(false);
      setCards(data);
      setTextFront('');
      setTextBack('');
      return data;
    }

    setTextFront('');
    setTextBack('');
  };

  const handleDeleteCard = async (cardIdx: number) => {
    try {
      await deleteCard(deckId!, cardIdx);
    } catch (error) {
      console.log(error);
    }

    // seemingly can't splice in frontend
    setCards((prev) => prev.slice(0, cardIdx).concat(prev.slice(cardIdx + 1)));
  };

  const modifyCard = async () => {
    const res = fetch(``);
  };

  return (
    <div className='bg-gray-400 flex flex-col min-h-screen items-center justify-center text-stone-800'>
      <h3>You are looking at Deck of</h3>
      {deck?.title}
      {/* <h3>You are looking at deck of{deck!.title}</h3> */}
      <form onSubmit={handleCreateCard} className='space-x-6'>
        <label htmlFor='front-text' className='text-xl font-semibold'>
          Front side Card Text
        </label>
        <input
          id='front-text'
          required
          className='text-black px-4 py-2 rounded-md focus:outline-none'
          value={textFront}
          onChange={(e) => setTextFront(e.target.value)}
        />
        <label htmlFor='back-text' className='text-xl font-semibold'>
          Back side Card Text
        </label>
        <input
          id='back-text'
          required
          className='text-black px-4 py-2 rounded-md focus:outline-none'
          value={textBack}
          onChange={(e) => setTextBack(e.target.value)}
        />
        {/* button inside form will submit by default */}

        {isEditable === true ? (
          <button className='bg-green-500 text-blue-800 px-4 py-2 rounded-lg shadow-lg hover:opacity-70 hover:scale-95 duration-300'>
            Save the Card
          </button>
        ) : (
          <button className='bg-orange-500 text-blue-800 px-4 py-2 rounded-lg shadow-lg hover:opacity-70 hover:scale-95 duration-300'>
            Create a Card
          </button>
        )}
      </form>

      <ul className='mt-8 grid grid-cols-2 justify-items-stretch gap-4 md:grid-cols-3 p-6 mx-auto'>
        {cards.map((card, idx) => {
          return (
            <li key={crypto.randomUUID()}>
              <Card
                card={card}
                cards={cards}
                handleDeleteCard={handleDeleteCard}
                idx={idx}
                setTextFront={setTextFront}
                setTextBack={setTextBack}
                setIsEditable={setIsEditable}
                setModifyCardIndex={setModifyCardIndex}
              />
            </li>
          );
        })}
      </ul>

      {/* Back to Decks Button */}
      <div className='mt-12'>
        <Link to='/'>
          <button className='border border-stone-800 px-8 py-3 shadow-lg hover:scale-95 duration-200'>
            Back to Decks
          </button>
        </Link>
      </div>
      {/* Back to Decks Button ends */}
    </div>
  );
};

export default Deck;
