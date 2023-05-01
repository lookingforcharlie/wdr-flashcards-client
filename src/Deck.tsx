import React, { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineSave } from 'react-icons/ai';
import { RiEditBoxLine } from 'react-icons/ri';
import { Link, useParams } from 'react-router-dom';

import { createCard, deleteCard } from './api/cards';
import { API_URL } from './api/config';
import { TDeck } from './App';

const Deck = () => {
  const [text, setText] = useState<string>('');
  const [cards, setCards] = useState<string[]>([]);
  const [deck, setDeck] = useState<TDeck>();

  let { deckId } = useParams();
  // const [decks, setDecks] = useState<TDeck[]>([]);

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
    const cardText = await createCard(text, deckId!);
    setCards(cardText.cards);

    setText('');
  };

  const handleDeleteCard = async (cardIdx: number) => {
    console.log(cardIdx);
    try {
      await deleteCard(deckId!, cardIdx);
    } catch (error) {
      console.log(error);
    }

    // seemingly can't splice in frontend
    setCards((prev) => prev.slice(0, cardIdx).concat(prev.slice(cardIdx + 1)));
  };
  return (
    <div className='bg-gray-400 flex flex-col min-h-screen items-center justify-center text-stone-800'>
      <form onSubmit={handleCreateCard} className='space-x-6'>
        <label htmlFor='card-text' className='text-xl font-semibold'>
          Card Text
        </label>
        <input
          id='card-text'
          className='text-black px-4 py-2 rounded-md focus:outline-none'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {/* button inside form will submit by default */}
        <button className='bg-orange-500 text-blue-800 px-4 py-2 rounded-lg shadow-lg hover:opacity-70 hover:scale-95 duration-300'>
          Create a Card
        </button>
      </form>
      <ul className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 p-6 mx-auto'>
        {cards.map((card, idx) => {
          return (
            <li
              key={crypto.randomUUID()}
              className='relative flex flex-col items-center justify-center bg-gray-300 shadow-lg border border-stone-800 p-12  hover:bg-gray-200'
            >
              <div className='hover:opacity-80'>{card}</div>
              <div className='absolute top-4 right-4'>
                <AiOutlineDelete
                  onClick={() => handleDeleteCard(idx)}
                  className='hover:cursor-pointer'
                />
              </div>
              <div className='absolute top-4 right-10 text-base'>
                <RiEditBoxLine
                  // onClick={handleEditText}
                  className='hover:cursor-pointer'
                />
              </div>
            </li>
          );
        })}
      </ul>
      <div className='mt-12'>
        <Link to='/'>
          <button className='border border-stone-800 px-8 py-3 shadow-lg hover:scale-95 duration-200'>
            Back to Decks
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Deck;
