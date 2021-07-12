import ButtonDefault from '../buttonDefault/buttonDefault';
import Control from '../utilities/control';
import paginateStyles from '../chatPage/paginate-container.module.css';

class PaginatedContainer extends Control {
  private pages: Array<{ name: string; page: Control; button: Control }> = [];
  private main: Control;
  private pagination: Control;
  public onLastPageClose: () => void;
  private title: Control;

  constructor(parentNode: HTMLElement, style: string) {
    super(parentNode, 'div', style);
    const wrapperCommon = new Control(this.node, 'div', paginateStyles.wrapper_common_pag);
    this.title = new Control(wrapperCommon.node, 'div', paginateStyles.title_paginate, 'Your active channels: ');
    this.title.node.classList.add(paginateStyles.default_hidden);
    this.pagination = new Control(wrapperCommon.node, 'div', paginateStyles.paginate_wrapper);
    this.main = new Control(this.node, 'div', style);
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
    this.title.node.classList.remove(paginateStyles.default_hidden);
    this.main.node.appendChild(page.node);
    let button = new ButtonDefault(this.pagination.node, paginateStyles.paginate_button, name);
    this.pages.push({
      name,
      page,
      button
    });

    button.onClick = () => {
      this.select(name);
    };
    this.select(name);
  }

  remove(name: string) {
    const pageIndex = this.pages.findIndex((item) => item.name === name);
    if (pageIndex !== -1) {
      const page = this.pages[pageIndex]
      this.pages = this.pages.filter((elem) => elem !== page);
      page.button.destroy();
      this.main.node.removeChild(page.page.node);
      if(this.pages.length) {
        if(this.pages[pageIndex]) {
          this.selectByIndex(pageIndex)
        } else {
          this.selectByIndex(pageIndex - 1)
        }
      } else {
        this.onLastPageClose?.();
      }
    } else {
      throw new Error ('Page not found');
    }
  }

  selectByIndex(index: number) {
    this.pages.forEach((pageItem, i) => {
      if (index === i) {
        pageItem.page.node.style.display = '';
      } else {
        pageItem.page.node.style.display = 'none';
      }
    });
  }
}

export default PaginatedContainer;
