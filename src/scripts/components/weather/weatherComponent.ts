import {InsertPosition, renderElement} from '../../utils';
import AbstractComponent from '../abstractComponent';
import BigCardListComponent from '../bigCard/bigCardListComponent';
import HeaderNavComponent from '../header/headerNavComponent';
import SmallCardListComponent from '../smallCard/smallCardListComponent';
import WeatherService from "../../weatherService";

class WeatherComponent extends AbstractComponent {
    
    private readonly weatherService: WeatherService;
    
    constructor(weatherService: WeatherService) {
        super();
        
        this.weatherService = weatherService;
    }

    protected getTemplate(): string {
        return `<div class="weather-app__content weather-content">
                  <section class="weather-content__result">
                    <h2 class="visually-hidden">Результаты сортировки</h2>
                  </section>
                </div>`;
    }

    protected afterCreateElement(): void {
        const headerNavComponent = new HeaderNavComponent(this.weatherService);
        const headerNavElement = headerNavComponent.getElement();
        renderElement(this.getElement(), headerNavElement, InsertPosition.AFTER_BEGIN);

        const smallCardListComponent = new SmallCardListComponent(this.weatherService);
        const smallCardListElement = smallCardListComponent.getElement();
        const weatherContentResultElement = this.getElement().querySelector(`.weather-content__result`) as HTMLElement;
        renderElement(weatherContentResultElement, smallCardListElement, InsertPosition.AFTER_BEGIN);

        const bigCardListComponent = new BigCardListComponent(this.weatherService);
        const bigCardListElement = bigCardListComponent.getElement();
        renderElement(weatherContentResultElement, bigCardListElement, InsertPosition.BEFORE_END);
    }
}

export default WeatherComponent;
