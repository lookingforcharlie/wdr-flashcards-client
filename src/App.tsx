import { useEffect, useState } from 'react';

import { API_URL } from './api/config';
import { createDeck, deleteDeck } from './api/decks';
import Decks from './Decks';

export type TCard = {
  front: string;
  back: string;
  _id: string;
};

export type TDeck = {
  _id: string;
  title: string;
  cards: TCard[];
};

function App() {
  const [title, setTitle] = useState<string>('');
  const [decks, setDecks] = useState<TDeck[]>([]);

  // const fetchDeck = async () => {
  //   try {
  //     // fetch returns an object that has a .json() method
  //     const res = await fetch('http://localhost:5555/decks');
  //     const data = await res.json();
  //     return setDecks(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    // create AbortController that built in the browser for the cleanup func below
    // take a signal from the AbortController, put into your fetch request below
    // const controller = new AbortController();
    // const signal = controller.signal;
    try {
      // fetch returns an object that has a .json() method
      fetch(`${API_URL}/decks`).then(async (res) => {
        const data = await res.json();
        setDecks(data);
      });
    } catch (error) {
      console.log('err:', error);
    }

    // fetchDeck();

    // clean up function here cancel the fetch request, and none of fetch code will run
    // return () => {
    //   controller.abort();
    // };

    // Regarding clean up function: [https://www.youtube.com/watch?v=Wu0rVQuawLU&t=46s]
  }, []);

  const handleCreateDeck = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // When we submit, we need to talk with backend API to persist the deck
    // we got CORS error, because by default browser is not allowed to access URLs that do not match the  same hostname you are on
    // to bypass that we need setup CORS on API
    const deck = await createDeck(title);
    setDecks((prev) => [...prev, deck]);

    setTitle('');
  };

  const handleDeleteDeck = async (deckId: string) => {
    try {
      // don't forget await here
      await deleteDeck(deckId);
      // const data = res.json();
      // setDecks(data);
    } catch (error) {
      console.log(error);
    }

    // filter: put items in a new array when callback function return true
    setDecks((prev) => prev.filter((deck) => deck._id !== deckId));
  };

  return (
    <div className='bg-gray-400 flex flex-col min-h-screen items-center justify-center text-stone-800'>
      <form
        onSubmit={handleCreateDeck}
        className='flex flex-col text-right space-y-6 md:flex-row md:space-x-6 md:space-y-0'
      >
        <label
          htmlFor='deck-title'
          className='text-xl font-semibold text-left md:pt-1'
        >
          Deck Title
        </label>
        <input
          id='deck-title'
          className='text-black px-4 py-2 rounded-md focus:outline-none'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* button inside form will submit by default */}
        <button className='bg-orange-500 text-blue-800 px-4 py-2 rounded-lg shadow-lg hover:opacity-70 hover:scale-95 duration-300'>
          Create a Deck
        </button>
      </form>
      <ul className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 p-6 mx-auto'>
        {decks.map((item) => {
          return (
            <li
              key={item._id}
              className='relative flex flex-col items-center justify-center bg-gray-300 shadow-lg border border-stone-800 p-12  hover:bg-gray-200'
            >
              <Decks
                handleDeleteDeck={handleDeleteDeck}
                item={item}
                title={title}
                setTitle={setTitle}
                setDecks={setDecks}
                decks={decks}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
