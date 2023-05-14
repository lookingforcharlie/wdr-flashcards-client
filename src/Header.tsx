import React, { FC } from 'react';
import icon from '../public/assets/flashcards-icon.png';

const Header: FC = () => {
  return (
    <div className='w-full mx-auto bg-[#2f2e3b] shadow-xl px-8 py-2 text-white'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-center'>
          <img src={icon} className='w-16 md:w-24' />
          <div className='text-base md:text-2xl'>Flashcards</div>
        </div>
        <div className='space-x-4'>
          <a href='/' className='md:text-xl'>
            My Deck
          </a>
          <a href='#' className='md:text-xl'>
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
