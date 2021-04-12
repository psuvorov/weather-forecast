import {STATUS_CARD_SMALL} from '../../utils';
import AbstractComponent from '../abstractComponent';
import WeatherService from "../../weatherService";

class SmallCardComponent extends AbstractComponent {

    private readonly weatherService: WeatherService;
    private readonly data: any;
    
    constructor(data: any, weatherService: WeatherService) {
        super();
        
        this.data = data;
        this.weatherService = weatherService;
    }

    protected getTemplate(): string {
        return `<div class="card small-card" id="${this.data.name.replaceAll(` `, `-`)}" data-status="${STATUS_CARD_SMALL}" draggable="true">
                    <span class="small-card__city"> ${this.data.name} </span>
                    <span class="small-card__temperature">
                        ${this.data.main.temp > 0 ? `+` : ``}${this.data.main.temp.toFixed()}°
                    </span>
                    <span class="icon icon--strips-small"></span>
                </div>`;
    }

    protected afterCreateElement(): void {
        this.weatherService.makeCardDraggable(this.element, this.data);
    }
}

export default SmallCardComponent;
