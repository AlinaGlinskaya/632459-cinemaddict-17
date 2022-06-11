import {getRandomInteger} from '../utils/common';
import dayjs from 'dayjs';
import {EMOTIONS} from '../const';

const generateCommentText = () => {
  const comments = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.'
  ];

  const randomIndex = getRandomInteger(0, comments.length - 1);

  return comments[randomIndex];
};

const generateCommentSmile = () => {
  const randomIndex = getRandomInteger(0, EMOTIONS.length - 1);

  return EMOTIONS[randomIndex];
};

const generateDate = () => {
  const maxDaysGap = 10000;
  const daysGap = getRandomInteger(-maxDaysGap, 0);

  const result = dayjs().add(daysGap, 'day');
  return dayjs(result).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
};

export const generateComment = () => (
  {
    id: String(getRandomInteger(1, 10)),
    author: 'Ilya O\'Reilly',
    comment: generateCommentText(),
    date: generateDate(),
    emotion: generateCommentSmile()
  }
);
