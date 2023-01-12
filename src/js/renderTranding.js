import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { MovieApiService } from './MovieApiService';
import { renderGalleryMarkup } from './renderGallery';
import { pagination, paginationBox } from './pagination';

export const fetchTrending = new MovieApiService({
  reqType: 'trending',
  mediaType: 'movie',
  timeWindow: 'week',
});

export const renderTranding = async () => {
  Loading.hourglass();
  try {
    const { results, total_results } = await fetchTrending.getReqData();

    if (total_results > 0) {
      pagination.reset(total_results);
      renderGalleryMarkup(results);
      paginationBox.classList.remove('visually-hidden');
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    Loading.remove();
  }
};

async function loadMoreTrending(e) {
  const currentPage = e.page;
  Loading.hourglass();

  try {
    const { results, total_results } = await fetchTrending.getReqData(
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

pagination.on('beforeMove', loadMoreTrending);
