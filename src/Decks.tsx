import React, { useState } from 'react';
import { AiOutlineDelete, AiOutlineSave } from 'react-icons/ai';
import { RiEditBoxLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { TDeck } from './App';
import { API_URL } from './api/config';

type Props = {
  handleDeleteDeck: (deckId: string) => Promise<void>;
  item: TDeck;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDecks: React.Dispatch<React.SetStateAction<TDeck[]>>;
  decks: TDeck[];
};
const Decks = (Props: Props) => {
  const { handleDeleteDeck, item, title, setTitle, setDecks, decks } = Props;

  const [editable, setEditable] = useState(false);
  const [modifyTitle, setModifyTitle] = useState('');

  const handleEditTitle = (id: string) => {
    console.log('editing the deck title');
    setModifyTitle(item.title);
    setEditable(true);
  };

  const handleModifyTitle = async (id: string) => {
    console.log(id);
    // if user didn't change anything, doesn't need to fetch API.
    if (item.title === modifyTitle) {
      setEditable(false);
      return decks;
    }
    const res = await fetch(`${API_URL}/decks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: modifyTitle,
      }),
    });

    // returned the whole decks
    const modifiedDecks = await res.json();
    // setDecks((prev as TDeck) => prev.map((deck) => deck._id === id));
    setDecks(modifiedDecks);
    setEditable(false);
  };

  return (
    <>
      {editable === true ? (
        <>
          <input
            defaultValue={item.title}
            onChange={(e) => setModifyTitle(e.target.value)}
          />
          <div className='absolute top-4 right-10 text-base'>
            <AiOutlineSave
              onClick={() => handleModifyTitle(item._id)}
              className='hover:cursor-pointer'
            />
          </div>
        </>
      ) : (
        <>
          <Link to={`/decks/${item._id}`} className='hover:opacity-80'>
            {item.title}
          </Link>
          <div className='absolute top-4 right-10 text-base'>
            <RiEditBoxLine
              onClick={() => handleEditTitle(item._id)}
              className='hover:cursor-pointer'
            />
          </div>
        </>
      )}
      <div className='absolute top-4 right-4'>
        <AiOutlineDelete
          onClick={() => handleDeleteDeck(item._id)}
          className='hover:cursor-pointer'
        />
      </div>
    </>
  );
};

export default Decks;
