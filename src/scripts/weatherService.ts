import {
    createElement,
    SortType,
    SortTypeMethods,
    StateActions,
    STATUS_CARD_BIG,
    STATUS_CARD_SMALL,
    OPEN_WEATHER_MAP_URL
} from './utils';

class WeatherService {
    
    private readonly favoritesCities: any[];
    private search: string;
    private sortType: string = SortType.ASC;
    private readonly filter: any;
    private data: any[];
    private _map: any;
    private _markers: any[];
    private draggedElement: HTMLElement;
    private readonly emptyCardElement: HTMLElement;
    
    constructor() {
        this.favoritesCities = [];
        this.search = '';
        this.filter = {
            thunderstorm: false,
            drizzle: false,
            rain: false,
            snow: false,
            clear: false,
            clouds: false
        };
        this.data = [];
        this._map = undefined;
        this.markers = [];

        this.emptyCardElement = createElement(`<div class="card big-card big-card--empty card-draggable"></div>`);
    }


    get map(): any {
        return this._map;
    }

    set map(value: any) {
        this._map = value;
    }

    get markers() {
        return this._markers;
    }

    set markers(value) {
        this._markers = value;
    }

    public async getAllCities(): Promise<any[]> {
        this.data = await fetch(OPEN_WEATHER_MAP_URL)
            .then(res => res.json())
            .then(data => data.list)
            .catch(() => {});

        // @ts-ignore
        return this.data.sort(SortTypeMethods[this.sortType]);
    }

    public getCitiesForSmallCardList(): any[] {
        return this.data.filter((item) => item.name.toLowerCase().includes(this.search))
            // @ts-ignore
            .sort(SortTypeMethods[this.sortType]);
    }

    public setSortType(sortType: any): void {
        this.sortType = sortType;
        this.emitEvent(StateActions.SORT_CHANGES, this.sortType);
    }

    public setSearch(text: string): void {
        this.search = text.toLowerCase();
        this.emitEvent(StateActions.SEARCH_CHANGES, this.sortType);
    }

    public setFilter(filterKey: string, value: string): void {
        this.filter[filterKey] = value;
        this.emitEvent(StateActions.FILTER_CHANGES, this.sortType);
    }

    public getFavoriteCities(): any {
        const keysForFilter = Object.keys(this.filter).filter(f => this.filter[f]);

        return this.favoritesCities.filter((city) => {
            if (keysForFilter.length) {
                let cityWeatherConditions = city.weather.map((x: any) => x.main.toLowerCase());

                return keysForFilter.every(kf => cityWeatherConditions.includes(kf));
            }
            
            return true;
        });
    }

    private updatePosition(card: any, prevCardId: string, list: string): void {
        const status = this.favoritesCities.includes(card) ? STATUS_CARD_BIG : STATUS_CARD_SMALL;

        if (list === STATUS_CARD_BIG && status === STATUS_CARD_BIG) {
            const cardIndex = this.favoritesCities.findIndex((city: any) => city.name === card.name);
            this.favoritesCities.splice(cardIndex, 1);

            const prevCardIndex = this.favoritesCities.findIndex((city) => city.name === prevCardId);
            this.favoritesCities.splice(prevCardIndex + 1, 0, card);
        } else if (list === STATUS_CARD_BIG && status === STATUS_CARD_SMALL) {
            const cardIndex = this.data.findIndex((city) => city.name === card.name);
            this.data.splice(cardIndex, 1);

            if (prevCardId) {
                const prevCardIndex = this.favoritesCities.findIndex((city) => city.name === prevCardId);
                this.favoritesCities.splice(prevCardIndex + 1, 0, card);
            } else {
                this.favoritesCities.push(card);
            }
        } else if (list === STATUS_CARD_SMALL && status === STATUS_CARD_BIG) {
            const cardIndex = this.favoritesCities.findIndex((city) => city.name === card.name);
            this.favoritesCities.splice(cardIndex, 1);

            this.data.push(card);
        }

        this.emitEvent(StateActions.CARD_UPDATE_POSITION, card);
    }

    public makeCardDraggable(element: HTMLElement, city: string): void {
        this.draggedElement = null;

        element.addEventListener(`dragstart`, () => {
            this.draggedElement = element;
            this.draggedElement.classList.add(`small-card--shadow`);
        });

        element.addEventListener(`dragend`, () => {
            const prevCardId = this.emptyCardElement.previousElementSibling ? this.emptyCardElement.previousElementSibling.id : undefined;

            this.draggedElement.classList.remove(`small-card--shadow`);
            this.updatePosition(city, prevCardId, this.draggedElement.dataset.status);

            this.draggedElement = null;
        });
    }

    public makeListDroppable(listElement: HTMLElement): void {
        listElement.addEventListener(`dragover`, (evt) => {
            evt.preventDefault();

            const underElement = evt.target as HTMLElement;
            const underCardElement = underElement.closest(`.card`) as HTMLElement;
            const underListElement = underElement.closest(`.card-list`) as HTMLElement;

            if (!underListElement || (underCardElement === this.draggedElement)) {
                return;
            }

            this.draggedElement.dataset.status = underListElement.dataset.status;

            if (underCardElement && (underListElement.dataset.status !== STATUS_CARD_SMALL)) {
                underListElement.insertBefore(this.emptyCardElement, underCardElement.nextElementSibling);
            } else {
                underListElement.append(this.emptyCardElement);
            }
        });
    }

    // TODO: double check this!
    private emitEvent(type: string, data: any): void {
        window.dispatchEvent(new CustomEvent<any>(type, {detail: data}));
    }
}

export default WeatherService;
