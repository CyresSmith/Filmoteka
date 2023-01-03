import { hideScrollUpBtn } from './js/hide-scroll-up-button';
import { smoothscroll } from './js/smoothscroll';
import { renderMarkup } from './js/showTrending/renderTrending';
import { hiddenElementsOnMobileVersion } from './js/hideElementsInMobileVersion';
import './js/firebase';
import './js/signInModal';
smoothscroll();
window.addEventListener('scroll', hideScrollUpBtn);

console.log('d/filmoteka');
console.log('hello from heare');
