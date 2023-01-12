import { MovieApiService } from './MovieApiService';
import { renderGalleryMarkup } from './renderGallery';
import { renderTranding } from './renderTranding';
import { pagination, paginationBox } from './pagination';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

export const fetchSerched = new MovieApiService({
  reqType: 'search',
  mediaType: 'movie',
});

const refs = {
  searchForm: document.querySelector('.searchForm'),
  searchQueryInput: document.querySelector('input[name=searchQuery]'),
  searchBtn: document.querySelector('.searchForm__button'),
  gallery: document.querySelector('.gallery'),
};

let searchQuery = '';

const setSearchQuery = e => {
  searchQuery = e.target.value.toLowerCase().trim();
  // refs.searchQueryInput.value = searchQuery;

  if (searchQuery.length > 0) {
    refs.searchBtn.removeAttribute('disabled');
    refs.searchBtn.addEventListener('click', onSearchBtn);
    return;
  }

  refs.searchBtn.setAttribute('disabled', true);
  refs.searchBtn.removeEventListener('click', onSearchBtn);
  renderTranding();
};

export const onSearchBtn = async () => {
  event.preventDefault();
  refs.searchBtn.setAttribute('disabled', true);
  refs.searchBtn.removeEventListener('click', onSearchBtn);
  fetchSerched.request = searchQuery;
  Loading.hourglass();

  try {
    const { results, total_results } = await fetchSerched.getReqData();
    paginationBox.classList.add('visually-hidden');

    if (total_results > 0) {
      pagination.off();
      renderGalleryMarkup(results);
      Notify.success(
        `${total_results} matches found for your query "${searchQuery}"`,
        {
          width: '394px',
          position: 'center-top',
          distance: '157px',
          clickToClose: true,
        }
      );
      pagination.reset(total_results);
    }

    if (total_results > 20) {
      pagination.on('beforeMove', loadMoreSerched);
      paginationBox.classList.remove('visually-hidden');
    }

    if (total_results === 0) {
      refs.searchForm.reset();
      paginationBox.classList.add('visually-hidden');
      Report.failure(
        'No matches for Your search',
        'Please try to enter another query to find the information You need',
        'Okay',
        { clickToClose: true }
      );
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    Loading.remove();
  }
};

refs.searchQueryInput.addEventListener('input', setSearchQuery);

async function loadMoreSerched(e) {
  const currentPage = e.page;
  Loading.hourglass();

  try {
    const { results, total_results } = await fetchSerched.getReqData(
      null,
      currentPage
    );

    if (total_results > 0) {
      renderGalleryMarkup(results);
      paginationBox.classList.remove('visually-hidden');
      return;
    } else {
      paginationBox.classList.add('visually-hidden');
    }
  } catch (error) {
    console.error(error);
  } finally {
    Loading.remove();
    window.scroll(0, 0);
  }
}
