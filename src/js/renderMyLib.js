import { auth, dbRef } from './firebase';
import { child, get } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { renderGalleryMarkup } from './renderGallery';
import { MovieApiService } from './MovieApiService';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

export const getById = new MovieApiService({
  reqType: 'getById',
  mediaType: 'movie',
});

export const renderWatchedFromDb = async e => {
  onAuthStateChanged(auth, user => {
    if (user) {
      Loading.hourglass();
      get(child(dbRef, `users/${user.uid}/watched`))
        .then(snapshot => {
          if (snapshot.exists()) {
            const savedMovies = Object.values(snapshot.val());
            const results = [];
            savedMovies.forEach(element => {
              getById
                .getReqData(element, null)
                .then(data => results.push(data));
            });
            renderGalleryMarkup(results);
          } else {
            Report.info(
              'No movies in collection now',
              'Add movies to see them here'
            );
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(Loading.remove());
    } else {
      console.log('no user');
    }
  });
};

export const renderQueueFromDb = async e => {
  onAuthStateChanged(auth, user => {
    if (user) {
      Loading.hourglass();
      get(child(dbRef, `users/${user.uid}/queue`))
        .then(snapshot => {
          if (snapshot.exists()) {
            const savedMovies = Object.values(snapshot.val());
            const results = [];
            savedMovies.forEach(element => {
              getById
                .getReqData(element, null)
                .then(data => results.push(data));
            });
            renderGalleryMarkup(results);
          } else {
            Report.info(
              'No movies in collection now',
              'Add movies to see them here'
            );
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(Loading.remove());
    } else {
      console.log('no user');
    }
  });
};
