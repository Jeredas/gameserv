import ButtonDefault from '../buttonDefault/buttonDefault';
import Control from '../utilities/control';

class PaginatedContainer extends Control {
  private pages: Array<{ name: string; page: Control }> = [];
  private main: Control;
  private pagination: Control;

  constructor(parentNode: HTMLElement, style: string) {
    super(parentNode, 'div', style);
    this.main = new Control(this.node, 'div', style);
    this.pagination = new Control(this.node);
  }

  select(name: string) {
    this.pages.forEach((pageItem) => {
      if (pageItem.name === name) {
        pageItem.page.node.style.display = '';
      } else {
        pageItem.page.node.style.display = 'none';
      }
    });
  }

  add(name: string, page: Control) {
    this.main.node.appendChild(page.node);
    this.pages.push({
      name,
      page
    });
    let button = new ButtonDefault(this.pagination.node, '', name);
    button.onClick = () => {
      this.select(name);
    };
    this.select(name);
  }

  remove(index: number) {}
}

export default PaginatedContainer;
