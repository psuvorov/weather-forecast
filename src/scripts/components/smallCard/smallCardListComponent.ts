import {InsertPosition, renderElement, StateActions, STATUS_CARD_SMALL} from '../../utils';
import AbstractComponent from '../abstractComponent';
import SmallCardComponent from './smallCardComponent';
import WeatherService from "../../weatherService";

class SmallCardListComponent extends AbstractComponent {
    
    private readonly weatherService: WeatherService;
    private allCities: any;
    
    constructor(weatherService: WeatherService) {
        super();
        
        this.weatherService = weatherService;
        
        this.dataChangedHandler = this.dataChangedHandler.bind(this);
    }

    protected getTemplate(): string {
        return `<div class="card-list weather-content__small-cards" data-status="${STATUS_CARD_SMALL}"></div>`;
    }

    protected afterCreateElement(): void {
        this.weatherService.getAllCities().then((cities) => {
            this.allCities = cities;
            this.render();
        });

        this.addEventListeners();
        this.weatherService.makeListDroppable(this.getElement());
    }

    private addEventListeners(): void {
        window.addEventListener(StateActions.SORT_CHANGES, this.dataChangedHandler);
        window.addEventListener(StateActions.SEARCH_CHANGES, this.dataChangedHandler);
        window.addEventListener(StateActions.CARD_UPDATE_POSITION, this.dataChangedHandler);
    }

    private dataChangedHandler(): void {
        this.allCities = this.weatherService.getCitiesForSmallCardList();
        this.render();
    }

    private render(): void {
        this.getElement()
            .querySelectorAll(`.card`)
            .forEach((element) => element.remove());

        this.allCities.forEach((city: any) => {
            const smallCardComponent = new SmallCardComponent(city, this.weatherService);
            const smallCardElement = smallCardComponent.getElement();

            renderElement(this.getElement(), smallCardElement, InsertPosition.BEFORE_END);
        });
    }
}

export default SmallCardListComponent;
