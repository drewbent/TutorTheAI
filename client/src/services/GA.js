import ReactGA from 'react-ga';

const LOGGING = false;

export const GA = {
  init() {
    ReactGA.initialize('UA-174909627-1');
  },

  pageView(page) {
    ReactGA.pageview(page);

    if (LOGGING) console.log('[GA] Page view:', page);
  },

  event(props) {
    removeUndefined(props);
    const {
      category,
      action,
      label,
      value
    } = props;

    ReactGA.event({
      category,
      action,
      label,
      value,
      nonInteraction: false
    });

    if (LOGGING) {
      console.log(`[GA] Event:`);
      console.log(props);
    }
  }
};

const removeUndefined = (obj) => {
  for(let prop in obj) {
    if (obj[prop] === undefined) delete obj[prop];
  };
}