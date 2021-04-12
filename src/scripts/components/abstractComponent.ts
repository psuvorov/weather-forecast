import {createElement} from '../utils';

abstract class AbstractComponent {
    
    protected element: HTMLElement;
    
    protected constructor() {
    }

    protected abstract getTemplate(): string;

    getElement(): HTMLElement {
        if (!this.element) {
            this.element = createElement(this.getTemplate());
            this.afterCreateElement();
        }
        
        return this.element;
    }

    protected afterCreateElement() {
        // hook method
    }
}

export default AbstractComponent;
