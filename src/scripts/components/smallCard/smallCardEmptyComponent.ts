import AbstractComponent from '../abstractComponent';

class SmallCardEmptyComponent extends AbstractComponent {
    
    protected getTemplate(): string {
        return `<div class="small-card small-card--empty"></div>`;
    }
}

export default SmallCardEmptyComponent;
