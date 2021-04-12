import {FilterState, SortType} from '../../utils';
import AbstractComponent from '../abstractComponent';
import WeatherService from "../../weatherService";

class HeaderNavComponent extends AbstractComponent {
    
    private readonly weatherService: WeatherService;
    private sortType: string;
    
    constructor(weatherService: WeatherService) {
        super();
        this.weatherService = weatherService;
        
        this.sortType = SortType.ASC;

        this.changeSortHandler = this.changeSortHandler.bind(this);
        this.filterByTextHandler = this.filterByTextHandler.bind(this);
        this.filterSortHandler = this.filterSortHandler.bind(this);
    }

    protected getTemplate(): string {
        return `<section class="sort-form weather-content__sort">
                    <h2 class="visually-hidden">Форма сортировки</h2>
                    <form action="#" method="GET">
                      <div class="sort-form__group">
                        <div class="sort-form__input-wrapper input-wrapper input-wrapper--checkbox">
                          <input id="alphabet-sort" name="alphabet-sort" type="checkbox" value="${this.sortType}" />
                          <label aria-label="Сортировка по алфавиту" for="alphabet-sort">
                            <span class="icon icon--arrow-down"></span>
                          </label>
                        </div>
                      </div>
                      <div class="sort-form__group">
                        <div class="sort-form__input-wrapper input-wrapper input-wrapper--search">
                          <input id="search" name="city-search" placeholder="Название города" type="search" />
                          <label aria-label="Поиск городов" for="search"></label>
                        </div>
                      </div>
                      <div class="sort-form__group">
                        ${this.getWeatherConditionFilterTemplate(FilterState.THUNDERSTORM, "Thunderstorm")}
                        ${this.getWeatherConditionFilterTemplate(FilterState.DRIZZLE, "Drizzle")}
                        ${this.getWeatherConditionFilterTemplate(FilterState.RAIN, "Rain")}
                        ${this.getWeatherConditionFilterTemplate(FilterState.SNOW, "Snow")}
                        ${this.getWeatherConditionFilterTemplate(FilterState.CLEAR, "Clear")}
                        ${this.getWeatherConditionFilterTemplate(FilterState.CLOUDS, "Clouds")}
                      </div>
                    </form>
                  </section>`;
    }
    
    private getWeatherConditionFilterTemplate(filterName: string, filterDescription: string): string {
        return `
            <div class="sort-form__input-wrapper input-wrapper input-wrapper--checkbox">
              <input id="${filterName}" name="weather-conditions" type="checkbox" value="${filterName}" />
              <label aria-label="${filterDescription}" for="${filterName}">
                <span class="icon icon--${filterName}"></span>
              </label>
            </div>
        `;
    }

    protected afterCreateElement(): void {
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.getElement()
            .querySelector(`#alphabet-sort`)
            .addEventListener(`change`, this.changeSortHandler);

        this.getElement()
            .querySelector(`#search`)
            .addEventListener(`input`, this.filterByTextHandler);
        
        for (let filterState in FilterState) {
            this.getElement()
                .querySelector(`#${filterState.toLowerCase()}`)
                .addEventListener(`change`, this.filterSortHandler);
        }
    }

    private changeSortHandler(evt: Event): void {
        this.sortType = this.sortType === SortType.ASC ? SortType.DESC : SortType.ASC;
        
        let inputWrapperElement = (evt.target as HTMLElement).closest(".input-wrapper");
        let iconElement = inputWrapperElement.querySelector(".icon");
        if (iconElement.classList.contains("icon--arrow-down")) {
            iconElement.classList.remove("icon--arrow-down");
            iconElement.classList.add("icon--arrow-up");
        } else {
            iconElement.classList.remove("icon--arrow-up");
            iconElement.classList.add("icon--arrow-down");
        }

        this.weatherService.setSortType(this.sortType);
    }

    private filterByTextHandler(evt: Event): void {
        evt.preventDefault();
        this.weatherService.setSearch((evt.target as any).value);
    }

    private filterSortHandler(evt: Event): void {
        this.weatherService.setFilter((evt.target as any).value, (evt.target as any).checked);
    }
}

export default HeaderNavComponent;
