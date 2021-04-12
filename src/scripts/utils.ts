const OPEN_WEATHER_MAP_API_KEY = "";

// TODO: use enum
const AVAILABLE_CITY_IDS = [
    "1850147", // Tokyo
    "524901", // Moscow
    "498817", // Saint Petersburg
    "1273294", // Delhi
    "1796236", // Shanghai
    "3448439", // Sao Paulo
    "3530597", // Mexico City
    "360630", // Cairo
    "1275339", // Mumbai
    "1816670", // Beijing
    "1273043", // Dhaka
    "1853909", // Osaka-shi
    "5128638", // New York
    "1174872", // Karachi
    "3435910", // Buenos Aires
    "1814906", // Chongqing	
    "745044", // Istanbul
    "1701668", // Manila
    "2332459", // Lagos
    "3451190" // Rio de Janeiro
];

export const OPEN_WEATHER_MAP_URL = `https://api.openweathermap.org/data/2.5/group?id=${AVAILABLE_CITY_IDS.join(",")}&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric`;

export const HIDE_BLOCK_CLASS = `hidden-block`;

export const STATUS_CARD_BIG = `big`;
export const STATUS_CARD_SMALL = `small`;

// TODO: use enum
export const InsertPosition = {
    AFTER_BEGIN: `afterbegin`,
    BEFORE_END: `beforeend`,
    AFTER_END: `afterend`
};

// TODO: use enum
export const SortType = {
    ASC: `asc`,
    DESC: `desc`,
};

// TODO: use enum
export const StateActions = {
    SORT_CHANGES: `sort-changes`,
    SEARCH_CHANGES: `search-changes`,
    FILTER_CHANGES: `filter-changes`,
    CARD_UPDATE_POSITION: `card-update-position`,
};

// TODO: use enum
export const FilterState = {
    THUNDERSTORM: `thunderstorm`,
    DRIZZLE: `drizzle`,
    RAIN: `rain`,
    SNOW: `snow`,
    CLEAR: `clear`,
    CLOUDS: `clouds`
};

export const DEFAULT_LAT = 55.751244;
export const DEFAULT_LON = 37.618423;
export const DEFAULT_ZOOM = 10;
export const OPACITY_DEFAULT = 1.0;
export const OPACITY_INACTIVE = 0.7;

// TODO: !!
export const SortTypeMethods = {
    asc: (a: any, b: any): number => a.name.localeCompare(b.name),
    desc: (a: any, b: any): number => -a.name.localeCompare(b.name),
};

export const LOCATION_API_URL = `https://ipinfo.io/json?token=c53e5677671c54`;

export function createElement(template: string): HTMLElement {
    const element = document.createElement(`div`);
    element.innerHTML = template;
    
    return element.firstElementChild as HTMLElement;
}

export function renderElement(container: HTMLElement, element: HTMLElement, insertPosition: string = InsertPosition.AFTER_BEGIN) {
    switch (insertPosition) {
        case InsertPosition.BEFORE_END:
            container.append(element);
            break;
        case InsertPosition.AFTER_BEGIN:
            container.prepend(element);
            break;
        case InsertPosition.AFTER_END:
            container.insertAdjacentElement(`afterend`, element);
            break;
    }
}
