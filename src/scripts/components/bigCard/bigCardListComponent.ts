import {
    DEFAULT_ZOOM, HIDE_BLOCK_CLASS,
    InsertPosition,
    OPACITY_DEFAULT,
    OPACITY_INACTIVE,
    renderElement,
    StateActions,
    STATUS_CARD_BIG,
} from '../../utils';
import AbstractComponent from '../abstractComponent';
import BigCardComponent from './bigCardComponent';
import BigCardEmptyComponent from './bigCardEmptyComponent';
import WeatherService from "../../weatherService";

export class BigCardListComponent extends AbstractComponent {
    
    private favoritesCities: any[];
    private readonly weatherService: WeatherService;
    
    constructor(weatherService: WeatherService) {
        super();
        
        this.weatherService = weatherService;
        this.favoritesCities = this.weatherService.getFavoriteCities();
        
        this.dataChangedHandler = this.dataChangedHandler.bind(this);
    }

    protected getTemplate(): string {
        return `<div class="card-list weather-content__big-cards" data-status="${STATUS_CARD_BIG}">
                    ${this.favoritesCities.length === 0 ? this.getEmptyTemplate() : ``}
                </div>`;
    }

    private getEmptyTemplate(): string {
        return `<div class="weather-content__help">Перетащите сюда города, погода в которых вам интересна</div>`;
    }

    protected afterCreateElement(): void {
        this.render();
        this.addEventListeners();
        this.weatherService.makeListDroppable(this.getElement());
    }

    private addEventListeners(): void {
        window.addEventListener(StateActions.FILTER_CHANGES, this.dataChangedHandler);
        window.addEventListener(StateActions.CARD_UPDATE_POSITION, this.dataChangedHandler);
    }

    private dataChangedHandler(): void {
        this.favoritesCities = this.weatherService.getFavoriteCities();
        this.render();
    }

    // TODO: wtf
    private renderEmptyComponent(): void {
        const emptyItemComponent = new BigCardEmptyComponent();
        const emptyItemElement = emptyItemComponent.getElement();

        this.setElementVisibility(emptyItemElement, this.favoritesCities.length !== 0);
        renderElement(this.getElement().querySelector(`.card-list`), emptyItemElement, InsertPosition.BEFORE_END);
    }

    private render(): void {
        this.getElement()
            .querySelectorAll(`.card`)
            .forEach((element) => element.remove());

        this.favoritesCities.forEach((favoriteCity: any) => {
            const bigCardComponent = new BigCardComponent(favoriteCity, this.weatherService);
            const bigCardElement = bigCardComponent.getElement();

            bigCardElement.addEventListener(`click`, this.bigCardClickHandler.bind(this, favoriteCity, bigCardElement));
            bigCardElement.addEventListener(`mouseenter`, this.mouseEnterHandler.bind(this, favoriteCity));
            bigCardElement.addEventListener(`mouseleave`, this.mouseLeaveHandler.bind(this, favoriteCity, bigCardElement));
            renderElement(this.getElement(), bigCardElement, InsertPosition.BEFORE_END);
        });
    }

    private mouseEnterHandler(favoriteCity: any): void {
        const selectedMarker = this.weatherService.markers.find((marker: any) => marker.options.title === favoriteCity.name);

        if (selectedMarker) {
            selectedMarker.setOpacity(OPACITY_DEFAULT);
        }
    }

    private mouseLeaveHandler(favoriteCity: any, bigCardElement: HTMLElement): void {
        this.weatherService.markers.forEach((marker: any) => {
            if (marker.options.title === favoriteCity.name && !bigCardElement.classList.contains(`active`)) {
                marker.setOpacity(OPACITY_INACTIVE);
            }
        });
    }

    private bigCardClickHandler(favoriteCity: any, bigCardElement: HTMLElement) {
        const isAlreadyActive = bigCardElement.classList.contains(`active`);

        document.querySelectorAll(`.card-list .card`).forEach((city) => city.classList.remove(`active`));

        if (!isAlreadyActive) {
            bigCardElement.classList.add(`active`);
            this.weatherService.map.setView([favoriteCity.coord.lat, favoriteCity.coord.lon], DEFAULT_ZOOM);
        } else {
            // @ts-ignore
            const group = L.featureGroup(this.weatherService.markers);
            this.weatherService.map.fitBounds(group.getBounds());
        }

        const selectedMarker = this.weatherService.markers.find((marker: any) => marker.options.title === favoriteCity.name);

        if (selectedMarker) {
            selectedMarker.setOpacity(bigCardElement.classList.contains(`active`) ? OPACITY_DEFAULT : OPACITY_INACTIVE);
        }
    }

    private setElementVisibility(element: HTMLElement, visibility: boolean): void {
        element.classList.toggle(HIDE_BLOCK_CLASS, !visibility);
    }
}

export default BigCardListComponent;
