import { MovieApiService } from './MovieApiService';
import { onAddToWatchedBtnClick, onAddToQueueBtnClick } from './firebase';

const fetchMovieForModal = new MovieApiService({
  reqType: 'getById',
  mediaType: 'movie',
});

const refs = {
  backdrop: document.querySelector('.backdrop'),
  movieModal__infoBox: document.querySelector('.movieModal__infoBox'),
  gallery: document.querySelector('.gallery'),
  btnAddToWatched: document.querySelector('#addToWatched'),
  btnAddToQueue: document.querySelector('#addToQueue'),
  closeModalBtn: document.querySelector('[data-modal-close]'),
};

export const onMovieCardClick = async e => {
  event.preventDefault();

  let id;

  if (e.target.classList.contains('gallery')) {
    return;
  } else if (e.target.dataset.id) {
    id = e.target.dataset.id;
  } else {
    id = e.target.parentElement.dataset.id;
  }

  refs.movieModal__infoBox.innerHTML = '';

  try {
    const data = await fetchMovieForModal.getReqData(id);

    refs.movieModal__infoBox.innerHTML = modalMarkupСreation(data);

    const btnAddToWatched = document.querySelector('#addToWatched');
    const btnAddToQueue = document.querySelector('#addToQueue');

    btnAddToQueue.addEventListener('click', () =>
      onAddToQueueBtnClick(data.id, data.title)
    );

    btnAddToWatched.addEventListener('click', () =>
      onAddToWatchedBtnClick(data.id, data.title)
    );

    refs.closeModalBtn.addEventListener('click', () => {
      closeModalFunc();
      btnAddToQueue.removeEventListener('click', onAddToQueueBtnClick);
      btnAddToWatched.removeEventListener('click', onAddToWatchedBtnClick);
      refs.backdrop.removeEventListener('click', onBackdropClick);
      window.removeEventListener('keydown', onEscKeyPress);
    });

    refs.backdrop.addEventListener('click', onBackdropClick);
    window.addEventListener('keydown', onEscKeyPress);

    refs.backdrop.classList.remove('backdrop--hidden');
  } catch (error) {
    console.error(error.message);
  }
};

const genresTxt = genres => {
  if (genres.length > 0) {
    const arr = genres.map(({ name }) => name);

    switch (true) {
      case arr.length > 2:
        return `${arr[0]}, ${arr[1]}, other`;

      case arr.length === 2:
        return `${arr[0]}, ${arr[1]}`;

      case arr.length === 1:
        return `${arr[0]}`;

      default:
        break;
    }
  } else {
    return 'no information';
  }
};

const modalMarkupСreation = ({
  title,
  vote_average,
  vote_count,
  popularity,
  original_title,
  genres,
  overview,
  poster_path,
}) => {
  const markup = `
    <img class="movieModal__image" src="https://image.tmdb.org/t/p/w500${poster_path}" alt="movieImg" />
    <div class="movieModal__info">
      <table class="movieModal__table">      
        <caption class="movieModal__caption">
          ${title}
        </caption>
        <tbody>
          <tr>
            <td class="movieModal__parameter padding-bottom-td">
              Vote / Votes
            </td>
            <td class="movieModal__value padding-bottom-td">
              <span class="movieModal__vote">${vote_average}</span> /
              <span class="movieModal__votes">${vote_count}</span>
            </td>
          </tr>
          <tr>
            <td class="movieModal__parameter padding-bottom-td">
              Popularity
            </td>
            <td class="movieModal__value padding-bottom-td">${popularity}</td>
          </tr>
          <tr>
            <td class="movieModal__parameter padding-bottom-td">
              Original Title
            </td>
            <td class="movieModal__value padding-bottom-td">
              ${original_title}
            </td>
          </tr>
          <tr>
            <td class="movieModal__parameter no-padding-td">Genre</td>
            <td class="movieModal__value no-padding-td">${genresTxt(
              genres
            )}</td>
          </tr>
        </tbody>
      </table>
      <div class="movieModal__description">
        <p class="movieModal__about">about</p>
        <p class="movieModal__text">
          ${overview}
        </p>
      </div>
      <div class="movieModal__btns">
        <button
          class="filmoteca-btn filmoteca-btn--primary"
          type="button"
          id="addToWatched"
        >
          add to Watched
        </button>

        <button
          class="filmoteca-btn filmoteca-btn--secondary"
          type="button"
          id="addToQueue"
        >
          add to queue
        </button>
      </div>
      `;

  return markup;
};

const closeModalFunc = () => {
  refs.backdrop.classList.add('backdrop--hidden');

  refs.closeModalBtn.removeEventListener('click', () => {
    closeModalFunc();
    btnAddToQueue.removeEventListener('click', onAddToQueueBtnClick);
    btnAddToWatched.removeEventListener('click', onAddToWatchedBtnClick);
    refs.backdrop.removeEventListener('click', onBackdropClick);
    window.removeEventListener('keydown', onEscKeyPress);
  });
};

function onBackdropClick(event) {
  if (event.currentTarget === event.target) {
    closeModalFunc();
  }
}

function onEscKeyPress(event) {
  const ESC_KEY_CODE = 'Escape';
  const isEscKey = event.code === ESC_KEY_CODE;

  if (isEscKey) {
    closeModalFunc();
  }
}
