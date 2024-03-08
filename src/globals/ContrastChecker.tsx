import { FC } from 'react';

type Props = {
  hexColor: string;
};

const contrastChecker = (hexColor: string) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const lightness = r + g + b;

  // returns true if value is light (fx. white)
  return lightness > 128 ? true : false;
};

export default contrastChecker;
