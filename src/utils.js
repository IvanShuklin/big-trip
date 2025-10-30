import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import { DATE_FORMAT } from './const';

dayjs.extend(utc);
dayjs.extend(duration);

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (elements) =>
  elements[getRandomInteger(0, elements.length - 1)];

const convertDate = (date, formatKey) =>
  dayjs.utc(date).utcOffset(1, true).format(DATE_FORMAT[formatKey]);

const getDuration = (dateFrom, dateTo) => {
  const diff = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));

  const days = diff.days();
  const hours = diff.hours();
  const minutes = diff.minutes();

  const parts = [];

  if (days > 0) {
    parts.push(`${String(days).padStart(2, '0')}D`);
  }
  if (hours > 0 || days > 0) {
    parts.push(`${String(hours).padStart(2, '0')}H`);
  }
  parts.push(`${String(minutes).padStart(2, '0')}M`);

  return parts.join(' ');
};

const capitalizeFirstLetter = (word = '') =>
  word ? word[0].toUpperCase() + word.slice(1) : '';

function calculateTotalPrice(points) {
  return points.reduce((total, point) => {
    const pointOffersPrice =
      point.offers?.reduce((sum, offer) => sum + offer.price, 0) || 0;
    return total + point.basePrice + pointOffersPrice;
  }, 0);
}

function getRouteInfo(points, destinations) {
  if (!points || points.length === 0) {
    return { title: '', dates: '' };
  }

  const sortedPoints = [...points].sort(
    (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)
  );

  const destinationNames = [];
  sortedPoints.forEach((point) => {
    const destination = destinations.find(
      (dest) => dest.id === point.destination
    );
    const destName = destination ? destination.name : point.destination;

    if (!destinationNames.includes(destName)) {
      destinationNames.push(destName);
    }
  });

  let title = '';
  if (destinationNames.length <= 3) {
    title = destinationNames.join(' &mdash; ');
  } else {
    title = `${destinationNames[0]} &mdash; ... &mdash; ${
      destinationNames[destinationNames.length - 1]
    }`;
  }

  const startDate = sortedPoints[0].dateFrom;
  const endDate = sortedPoints[sortedPoints.length - 1].dateTo;

  const startDay = convertDate(startDate, 'DAY_ONLY');
  const startMonth = convertDate(startDate, 'MONTH_ONLY');
  const endDay = convertDate(endDate, 'DAY_ONLY');

  let dates;
  if (
    convertDate(startDate, 'MONTH_ONLY') === convertDate(endDate, 'MONTH_ONLY')
  ) {
    dates = `${startDay}&nbsp;&mdash;&nbsp;${endDay} ${startMonth}`;
  } else {
    const endMonth = convertDate(endDate, 'MONTH_ONLY');
    dates = `${startDay} ${startMonth}&nbsp;&mdash;&nbsp;${endDay} ${endMonth}`;
  }

  return { title, dates };
}

export {
  getRandomInteger,
  getRandomArrayElement,
  convertDate,
  getDuration,
  capitalizeFirstLetter,
  calculateTotalPrice,
  getRouteInfo,
};
