import ReactGA from 'react-ga';

ReactGA.initialize('UA-109297932-1');

const pageView = (pageUrl, title) => {
    if (pageUrl.indexOf('/article') === -1) {
        ReactGA.set({ pageUrl });
        ReactGA.pageview(pageUrl, null, title ? title : 'TrustVardi');
    }
};

const setEvent = (event) => {
    ReactGA.event(event);
};

const articlePage = (pageUrl, title) => {
    ReactGA.set({ pageUrl });
    ReactGA.pageview(pageUrl, null, title ? title : 'TrustVardi');
}

const ReactAnalytics = {
    pageView,
    setEvent,
    articlePage
};

export default ReactAnalytics;