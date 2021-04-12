import AbstractComponent from '../abstractComponent';

class BigCardEmptyComponent extends AbstractComponent {
    
    protected getTemplate() {
        return `<li class="card">
                  <div class="big-card--empty"></div>
                </li>`;
    }
}

export default BigCardEmptyComponent;
