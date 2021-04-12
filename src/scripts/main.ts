import App from './app';

const app = new App();
const weatherAppElement = document.querySelector(`.weather-app`) as HTMLElement;

app.init(weatherAppElement);
