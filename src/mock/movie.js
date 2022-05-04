import {getRandomInteger} from '../utils';
import dayjs from 'dayjs';
import {EMOTIONS} from '../const';

const generateDescription = () => {
  const descriptions = [
    'Oscar-winning film, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generatePoster = () => {
  const posters = [
    'images/posters/made-for-each-other.png',
    'images/posters/popeye-meets-sinbad.png',
    'images/posters/sagebrush-trail.jpg',
    'images/posters/santa-claus-conquers-the-martians.jpg',
    'images/posters/the-dance-of-life.jpg',
    'images/posters/the-great-flamarion.jpg',
    'images/posters/the-man-with-the-golden-arm.jpg',
  ];

  const randomIndex = getRandomInteger(0, posters.length - 1);

  return posters[randomIndex];

};

const generateTitle = () => {
  const titles = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'A Little Pony Without The Carpet',
    'Laziness Who Sold Themselves'
  ];

  const randomIndex = getRandomInteger(0, titles.length - 1);

  return titles[randomIndex];
};

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

export const generateMovie = () => ({
  id: '0',
  comments: [
    '1', '2'
  ],
  filmInfo: {
    title: generateTitle(),
    alternativeTitle: generateTitle(),
    totalRating: 5.3,
    poster: generatePoster(),
    ageRating: 0,
    director: 'Tom Ford',
    writers: [
      'Takeshi Kitano',
      'Tom Ford'
    ],
    actors: [
      'Morgan Freeman',
      'Mary Beth Hughes',
      'Erich von Stroheim'
    ],
    release: {
      date: generateDate(),
      releaseCountry: 'Finland'
    },
    runtime: 77,
    genre: [
      'Comedy',
      'Western'
    ],
    description: generateDescription(),
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger(0, 1)),
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: Boolean(getRandomInteger(0, 1))
  }
});

export const generateComment = () => (
  {
    id: '2',
    author: 'Ilya O\'Reilly',
    comment: generateCommentText(),
    date: generateDate(),
    emotion: generateCommentSmile()
  }
);
