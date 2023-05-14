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
    if (textFront.trim() === '' || textBack.trim() === '') return;

    // when isEditable is false, it's simply a Create Card function
    if (isEditable === false) {
      const cardText = await createCard(textFront, textBack, deckId!);
      console.log('created cards (client):', cardText);
      setCards(cardText);
    }

    // when isEditable is true, modify card function kicks in
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
    <div className='bg-gray-400 flex flex-col min-h-screen items-center justify-start text-stone-800 pt-16'>
      <div className=' px-8 mb-8'>
        <div className='flex flex-row'>
          <h1>You are in the Deck of &nbsp;</h1>
          <span className='text-blue-800'>{deck?.title}</span>
        </div>
      </div>

      <form
        onSubmit={handleCreateCard}
        className='border border-stone-800 flex flex-col rounded-md items-start justify-start gap-6 py-8 px-10'
      >
        <div className='space-x-6'>
          <label htmlFor='front-text' className='text-xl font-semibold'>
            Front side
          </label>
          <input
            id='front-text'
            required
            className='text-black px-4 py-1 rounded-md focus:outline-none'
            value={textFront}
            onChange={(e) => setTextFront(e.target.value)}
          />
        </div>

        <div className='space-x-6'>
          <label htmlFor='back-text' className='text-xl font-semibold'>
            Back side
          </label>
          <input
            id='back-text'
            required
            className='text-black px-4 py-1 rounded-md focus:outline-none'
            value={textBack}
            onChange={(e) => setTextBack(e.target.value)}
          />
        </div>
        {/* button inside form will submit by default */}

        {isEditable === true ? (
          <button className='bg-green-500 text-blue-800 px-6 py-2 rounded-lg shadow-lg hover:opacity-70 hover:scale-95 duration-300'>
            Save the Card
          </button>
        ) : (
          <button className='bg-orange-500 text-blue-800 px-6 py-2 rounded-lg shadow-lg hover:opacity-70 hover:scale-95 duration-300'>
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
          <button className='border border-stone-800 px-8 py-3 rounded-md shadow-lg hover:scale-95 duration-200'>
            Back to Decks
          </button>
        </Link>
      </div>
      {/* Back to Decks Button ends */}
    </div>
  );
};

export default Deck;
