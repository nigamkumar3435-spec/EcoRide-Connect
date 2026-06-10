import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, onRatingChange = null, size = 18 }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.round(rating)) {
      stars.push(
        <FaStar
          key={i}
          size={size}
          className={`${
            onRatingChange
              ? 'text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors duration-150'
              : 'text-emerald-400'
          }`}
          onClick={() => onRatingChange && onRatingChange(i)}
        />
      );
    } else {
      stars.push(
        <FaRegStar
          key={i}
          size={size}
          className={`${
            onRatingChange
              ? 'text-slate-500 hover:text-emerald-400 cursor-pointer transition-colors duration-150'
              : 'text-slate-500'
          }`}
          onClick={() => onRatingChange && onRatingChange(i)}
        />
      );
    }
  }

  return <div className="flex gap-1 items-center">{stars}</div>;
};

export default StarRating;
