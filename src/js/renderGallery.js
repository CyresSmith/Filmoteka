import { Report } from 'notiflix/build/notiflix-report-aio';
import { MovieApiService } from './MovieApiService';
import { onMovieCardClick } from './movieCardInfoModal';

const fetchGenres = new MovieApiService({
  reqType: 'genre',
  mediaType: 'movie',
});

const refs = {
  gallery: document.querySelector('.gallery'),
};

export const renderGalleryMarkup = async results => {
  try {
    const { genres } = await fetchGenres.getReqData();
    refs.gallery.innerHTML = createGalleryMarkup(results, genres);
    refs.gallery.addEventListener('click', onMovieCardClick);
  } catch (error) {
    console.error(error.message);
  }
};

const cardGenres = (genre_ids, genres, genresArr) => {
  let cardGenresArr = [];

  if (genres) {
    if (genres.length === 0) {
      return 'no iformation';
    }

    switch (true) {
      case genres.length > 2:
        return `${genres[0].name}, ${genres[1].name}, other`;

      case genres.length === 2:
        return `${genres[0].name}, ${genres[1].name}`;

      case genres.length === 1:
        return `${genres[0].name}`;

      default:
        break;
    }
  } else {
    if (genre_ids.length === 0) {
      return 'no iformation';
    }

    genre_ids.map(genre_id =>
      genresArr.map(genre => {
        if (genre.id === genre_id) {
          cardGenresArr.push(genre.name);
        }
      })
    );

    switch (true) {
      case cardGenresArr.length > 2:
        return `${cardGenresArr[0]}, ${cardGenresArr[1]}, other`;

      case cardGenresArr.length === 2:
        return `${cardGenresArr[0]}, ${cardGenresArr[1]}`;

      case cardGenresArr.length === 1:
        return `${cardGenresArr[0]}`;

      default:
        break;
    }
  }
};

const titleSlice = title => {
  if (title.length > 30) {
    const titleSliced = title.slice(0, 30) + '...';
    return titleSliced;
  } else {
    return title;
  }
};

const posterPath = posterPath => {
  if (posterPath) {
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  }
  return './no-available.422868f7.png';
};

const createGalleryMarkup = (results, genresArr = '') => {
  const markup = results
    .map(
      ({
        poster_path,
        title = '',
        id,
        genre_ids,
        genres,
        release_date = '    ',
      }) => `
      <li class="movieCard">
              <a data-id="${id}">
                  <img class="movieCard__image" src="${posterPath(
                    poster_path
                  )}" alt="movieImg" />
                  <p class="movieCard__info movieCard__title">${titleSlice(
                    title
                  )}</p>
                      <p class="movieCard__info movieCard__description">${cardGenres(
                        genre_ids,
                        genres,
                        genresArr
                      )} | ${release_date.slice(0, 4)}</p>
              </a>
      </li>
    `
    )
    .join('');
  return markup;
};
