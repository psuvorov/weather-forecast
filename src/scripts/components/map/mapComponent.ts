import {
    DEFAULT_LAT,
    DEFAULT_LON,
    DEFAULT_ZOOM,
    LOCATION_API_URL, OPACITY_DEFAULT,
    OPACITY_INACTIVE,
    StateActions
} from '../../utils';
import AbstractComponent from '../abstractComponent';
import WeatherService from "../../weatherService";

class MapComponent extends AbstractComponent {
    
    private markers: any[];
    private weatherService: WeatherService;
    
    constructor(weatherService: WeatherService) {
        super();
        
        this.markers = [];
        this.weatherService = weatherService;
        
        this.dataChangedHandler = this.dataChangedHandler.bind(this);
    }

    public init(): void {
        MapComponent.getLocation()
            .then(([lat = DEFAULT_LAT, long = DEFAULT_LON]) => {

                // @ts-ignore
                this.weatherService.map = L.map(`map`, {zoomControl: false}).setView([lat, long], DEFAULT_ZOOM);
                // @ts-ignore
                L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).addTo(this.weatherService.map);
                // @ts-ignore
                L.control.zoom({
                    position: 'bottomright'
                }).addTo(this.weatherService.map);

                window.addEventListener(StateActions.CARD_UPDATE_POSITION, this.dataChangedHandler);
            });
    }

    protected getTemplate(): string {
        return `<div id="map" class="weather-app__map weather-map"></div>`;
    }

    private static getLocation(): Promise<any> {
        return fetch(LOCATION_API_URL)
            .then((res) => res.json())
            .then((data) => data.loc.split(`,`));
    }
    
    private dataChangedHandler(): void {
        const favoritesCities = this.weatherService.getFavoriteCities();
        
        // Clear all markers and recreate them down below
        this.markers.forEach(x => {
            this.weatherService.map.removeLayer(x);
        });
        
        let toggleActiveClassForPointHandler = (evt: Event) => {
            const idByName = (evt.target as any).options.title.replaceAll(` `, `-`);
            const bigCardElement = document.querySelector(`#${idByName}`);
            let isShouldBeActive = false;

            switch (evt.type) {
                case `click`:
                    isShouldBeActive = !bigCardElement.classList.contains(`active`);
                    break;
                case `mouseover`:
                    isShouldBeActive = true;
                    break;
                case `mouseout`:
                    isShouldBeActive = false;
                    break;
            }

            document.querySelectorAll(`.card-list .card`).forEach((city) => city.classList.remove(`active`));
            bigCardElement.classList.toggle(`active`, isShouldBeActive);
            
            (evt.target as any).setOpacity(isShouldBeActive ? OPACITY_DEFAULT : OPACITY_INACTIVE);
        }

        this.weatherService.markers = favoritesCities.map((city: any) => {
            // @ts-ignore
            let marker = L.marker([city.coord.lat, city.coord.lon], {title: city.name})
                .addTo(this.weatherService.map)
                .setOpacity(OPACITY_INACTIVE)
                .on(`mouseover`, toggleActiveClassForPointHandler)
                .on(`mouseout`, toggleActiveClassForPointHandler);
            
            this.markers.push(marker);
            
            return marker;
        });

        if (favoritesCities.length) {
            // @ts-ignore
            const group = L.featureGroup(this.weatherService.markers);
            this.weatherService.map.fitBounds(group.getBounds());
        } else {
            this.weatherService.map.setView([DEFAULT_LAT, DEFAULT_LON], DEFAULT_ZOOM);
        }
    }
}

export default MapComponent;
