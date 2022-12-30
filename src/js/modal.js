import axios from 'axios';

const refs = {
  backdrop: document.querySelector('.backdrop'),
  movieModal__div: document.querySelector('.movieModal__div'),
  gallery: document.querySelector('.gallery'),
};

export const onMovieCardClick = async e => {
  event.preventDefault();

  let id;

  if (e.target.dataset.id) {
    id = e.target.dataset.id;
  } else {
    id = e.target.parentElement.dataset.id;
  }

  refs.movieModal__div.innerHTML = '';
  try {
    const data = await fetchMovieForModal(id);
    refs.movieModal__div.insertAdjacentHTML(
      'beforeend',
      modalMarkupСreation(data)
    );
    refs.backdrop.classList.remove('backdrop--hidden');
    closeModalFunc();
  } catch (error) {
    console.error(error.message);
  }
};

const closeModalFunc = () => {
  const closeModalBtn = document.querySelector('[data-modal-close]');

  closeModalBtn.addEventListener('click', () =>
    refs.backdrop.classList.add('backdrop--hidden')
  );

  if (refs.backdrop.classList.contains('backdrop--hidden')) {
    closeModalBtn.removeEventListener('click', toggleModal);
  }
};

const fetchMovieForModal = async id => {
  const mediaType = 'movie';
  const URL = 'https://api.themoviedb.org/3/';

  let searchParams = new URLSearchParams({
    api_key: 'ac91775ba29254b7e75060011bf34a90',
  });

  try {
    const { data } = await axios.get(
      `${URL}${mediaType}/${id}?${searchParams}`
    );
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

const genresTxt = genres => {
  const arr = genres.map(({ name }) => name);
  switch (true) {
    case arr.length > 2:
      return `${arr[0]}, ${arr[1]}, other...`;

    case arr.length === 2:
      return `${arr[0]}, ${arr[1]}`;

    case arr.length === 1:
      return `${arr[0]}`;

    default:
      break;
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
          data-modal-close
        >
          add to Watched
        </button>
        <button
          class="filmoteca-btn filmoteca-btn--secondary"
          type="button"
          data-modal-close
        >
          add to queue
        </button>
      </div>
    </div>`;

  return markup;
};

refs.gallery.addEventListener('click', onMovieCardClick);
