import {STATUS_CARD_BIG} from '../../utils';
import AbstractComponent from '../abstractComponent';
import WeatherService from "../../weatherService";

class BigCardComponent extends AbstractComponent {
    
    private readonly favoriteCity: any
    private weatherService: WeatherService;
    
    constructor(favoriteCity: any, weatherService: WeatherService) {
        super();
        
        this.favoriteCity = favoriteCity;
        this.weatherService = weatherService;
    }

    getTemplate(): string {
        return `<div class="card big-card" id="${this.favoriteCity.name.replaceAll(` `, `-`)}" data-status="${STATUS_CARD_BIG}" draggable="true">
                    <div class="big-card__header">
                        <span class="icon icon--strips-big"></span>
                        <span class="big-card__city">${this.favoriteCity.name}</span>
                    </div>
                    <div class="big-card__content">
                        <div class="big-card__content-wrapper">
                            <div class="big-card__weather-conditions">
                                ${this.getConditionsTemplate(this.favoriteCity.weather)}
                            </div>
                            <div class="big-card__wind">
                                <span class="icon icon--wind"></span>
                                <span class="big-card__wind-info">
                                    <!-- TODO add wind dir                                    -->
                                    Ветер ${this.favoriteCity.wind.speed.toFixed()} м/с
                                </span>
                            </div>
                        </div>
                        <span class="big-card__temperature">
                          ${this.favoriteCity.main.temp > 0 ? `+` : ``}${this.favoriteCity.main.temp.toFixed()}°
                        </span>
                    </div>
                </div>`;
    }

    protected afterCreateElement(): void {
        this.weatherService.makeCardDraggable(this.element, this.favoriteCity);
    }

    private getConditionsTemplate(weather: any): any {
        return Object.keys(weather)
            .map((idx) => {
                return weather[idx] ? `<span class="icon icon--${weather[idx].main.toLowerCase()}"></span>` : ``;
            })
            .join(``);
    }
}

export default BigCardComponent;
