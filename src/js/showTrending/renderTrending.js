import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { fetchTrending } from './fetchTrending';
import axios from 'axios';

const refs = {
  searchForm: document.querySelector('.searchForm'),
  searchQueryInput: document.querySelector('input[name=searchQuery]'),
  searchBtn: document.querySelector('.searchForm__button'),
  gallery: document.querySelector('.gallery'),
  backdrop: document.querySelector('.backdrop'),
};

let page = 1;
let pageLimit = 40;
let searchQuery = '';
let gallery;
let lastCard;

const renderMarkup = async () => {
  try {
    const { page, results, total_pages, total_results } = await fetchTrending();

    if (total_results > 0) {
      Loading.hourglass();

      refs.gallery.innerHTML = galleryMarkupСreation(results);
      if (total_results > pageLimit) {
        observeLastCard();
      }

      Loading.remove();
      return;
    }
    Report.failure('Sorry, some problem happend. Please try again.');
    refs.gallery.innerHTML = '';
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
  }
};

renderMarkup();

const galleryMarkupСreation = results => {
  const markup = results
    .map(
      ({ poster_path, title, id, release_date }) => `
        <li class="movieCard">
          <a data-id=${id}>
            <img class="movieCard__image" src="https://image.tmdb.org/t/p/w500${poster_path}" alt="movieImg" />              
                <p class="movieCard__info movieCard__title">${title}</p>
                <p class="movieCard__info movieCard__description">Drama, Action | ${release_date.substr(
                  0,
                  4
                )}</p>            
          </a> 
        </li>
      `
    )
    .join('');
  return markup;
};

const loadMore = async () => {
  page += 1;
  Loading.hourglass();

  try {
    const { results, total_pages, total_results } = await fetchTrending(page);
    refs.gallery.insertAdjacentHTML(
      'beforeend',
      galleryMarkupСreation(results)
    );
    Loading.remove();

    // if (page * pageLimit >= totalHits) {
    //   Notify.info("We're sorry, but you've reached the end of search results.");
    //   return;
    // }

    observeLastCard();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
  }
};

const observer = new IntersectionObserver(
  ([entry], observer) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      loadMore();
    }
  },
  { threshold: 0.5 }
);

const observeLastCard = () => {
  lastCard = document.querySelector('.movieCard:last-child');
  observer.observe(lastCard);
};

const onMovieCardClick = async e => {
  event.preventDefault();
  const id = e.target.parentElement.dataset.id;

  try {
    const resp = await fetchMovieForModal(id);
    refs.backdrop.innerHTML = modalMarkupСreation(resp);
    refs.backdrop.classList.remove('backdrop--hidden');
    // console.log(resp);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
  }
};

refs.gallery.addEventListener('click', onMovieCardClick);

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
    // eslint-disable-next-line no-console
    console.error(error.message);
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
  <div class="movieModal">
    <button class="button modal-close-button" type="button" data-modal-close>
      <img
        class="modal-close-button__cross"
        src=""
        alt="movieImg"
      />
    </button>
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
            <td class="movieModal__value no-padding-td">${genres}</td>
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
    </div>
  </div>`;
  return markup;
};
