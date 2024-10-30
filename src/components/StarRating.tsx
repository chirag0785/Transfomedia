import React from 'react';
type Props = {
    rating: number;
    setRating: React.Dispatch<React.SetStateAction<number>>;
    hover: number;
    setHover: React.Dispatch<React.SetStateAction<number>>;
    field: {
        onChange: (value: number) => void;
        value: number;
    };
};
const StarRating = ({rating, setRating, hover, setHover,field}:Props) => {

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        index += 1;
        return (
          <span
            key={index}
            onClick={() =>{
                setRating(index);
                field.onChange(index)
            }}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
            className={`cursor-pointer text-2xl ${
              index <= (hover || rating) ? 'text-yellow-400' : 'text-gray-400'
            }`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
