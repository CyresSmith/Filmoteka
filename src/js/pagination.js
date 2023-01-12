import Pagination from 'tui-pagination';
// import 'tui-pagination/dist/tui-pagination.css';

export const paginationBox = document.getElementById(
  'tui-pagination-container'
);

const options = {
  totalItems: 0,
  itemsPerPage: 20,
  visiblePages: 5,
  page: 1,
  centerAlign: true,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  template: {
    page: '<a href="&" class="tui-custom">{{page}}</a>',
    currentPage:
      '<span class="tui-custom tui-custom-is-selected">{{page}}</span>',
    moveButton:
      '<a href="&" class="tui-custom tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</a>',
    disabledMoveButton:
      '<span class="tui-custom tui-is-disabled tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</span>',
    moreButton:
      '<a href="&" class="tui-custom tui-{{type}}-is-ellip">' +
      '<span class="tui-ico-ellip">...</span>' +
      '</a>',
  },
};

export const pagination = new Pagination(paginationBox, options);

pagination.getCurrentPage();
