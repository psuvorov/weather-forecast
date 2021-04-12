import MapComponent from './components/map/mapComponent';
import WeatherComponent from './components/weather/weatherComponent';
import {InsertPosition, renderElement} from './utils';
import WeatherService from './weatherService';
import "../scss/style.scss";

class App {
    
    private readonly weatherService: WeatherService;
    
    constructor() {
        this.weatherService = new WeatherService();
    }

    public init(weatherAppElement: HTMLElement): void {
        const weatherComponent = new WeatherComponent(this.weatherService);
        const weatherElement = weatherComponent.getElement();
        renderElement(weatherAppElement, weatherElement, InsertPosition.BEFORE_END);

        const mapComponent = new MapComponent(this.weatherService);
        const mapElement = mapComponent.getElement();
        renderElement(weatherAppElement, mapElement, InsertPosition.BEFORE_END);

        mapComponent.init();
    }
}

export default App;
