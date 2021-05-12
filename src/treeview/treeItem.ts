import {
  ActionEnum, TreeItemData, HandlersTreeViewInterface, CallbackData,
} from "./treeViewInterface";

class TreeItem {
  private readonly id: string;

  private readonly data: TreeItemData;

  private readonly parentId: string | null;

  private readonly hasChildren: boolean = false;

  private readonly breadcrumb : string[];

  private children: TreeItem[] = [];

  private expanded: boolean = true;

  private handlers: HandlersTreeViewInterface = {}

  private buttonDom: HTMLElement | null = null;

  constructor(id: string, parentId: string | null, hasChildren: boolean, breadcrumb: string[], treeItemData: TreeItemData, handlers: HandlersTreeViewInterface = {}) {
    this.id = id;
    this.parentId = parentId;
    this.hasChildren = hasChildren;
    this.data = treeItemData;
    this.breadcrumb = breadcrumb;
    this.handlers = handlers;
  }

  public getData() {
    return this.data;
  }

  public getParentId() {
    return this.parentId;
  }

  public setSeleted(newState: boolean) {
    this.data.isSelected = newState;
    if (!this.buttonDom) {
      console.error("could not find buttonDom element in the html");
      return;
    }

    if (this.data.isSelected) {
      this.buttonDom.classList.add(...["btn-lg", "active"]);
      // eslint-disable-next-line no-param-reassign
      this.buttonDom.textContent = "Added";
    } else {
      this.buttonDom.classList.remove(...["btn-lg", "active"]);
      // eslint-disable-next-line no-param-reassign
      this.buttonDom.textContent = "Select";
    }
  }

  addChild(treeItem: TreeItem) {
    this.children.push(treeItem);
  }

  removeChild(treeItemId: string) {
    const newChildrenArray = this.children.filter((child) => child.id !== treeItemId);
    this.children = newChildrenArray;
  }

  findNode(nodeId: string) : TreeItem | null {
    if (this.id === nodeId) {
      return this;
    }

    let result = null;
    for (let i = 0; result == null && i < this.children.length; i += 1) {
      result = this.children[i].findNode(nodeId);
    }

    return result;
  }

  private manageExpend(htmlElement: HTMLDivElement) {
    if (!this.hasChildren) {
      return;
    }
    this.expanded = !this.expanded;
    const iTag = htmlElement.querySelector("svg");
    if (!iTag) {
      console.error("Could not find tag element");
      return;
    }

    if (this.expanded) {
      iTag.classList.replace("fa-chevron-down", "fa-chevron-right");
    } else {
      iTag.classList.replace("fa-chevron-right", "fa-chevron-down");
    }
  }

  private toggle(event: Event) {
    const { currentTarget } = event;
    this.manageExpend(currentTarget as HTMLDivElement);
    if (this.children.length > 0 || this.hasChildren) {
      const ulDom = (currentTarget as Node).nextSibling as HTMLDivElement;
      ulDom!.classList.toggle("active");
    }

    const callbackData : CallbackData = {
      data: this.data, parentId: this.parentId, hasChildren: this.hasChildren, nodeId: this.id,
    };
    if (this.handlers.onClick) {
      this.handlers.onClick(callbackData);
    }

    if (this.handlers.onLoad && this.hasChildren && this.children.length <= 0) {
      this.handlers.onLoad(callbackData);
    }
  }

  private onClickButton(event : MouseEvent) {
    event.stopPropagation();
    this.setSeleted(!this.data.isSelected);

    if (this.handlers.onClick) {
      const action : ActionEnum = this.data.isSelected ? ActionEnum.add : ActionEnum.remove;
      const breadcrumbString : string = this.breadcrumb.reverse().join(" > ");
      if (this.handlers?.updateSelectedIds) {
        this.handlers.updateSelectedIds(this.id, action, this.data.name, breadcrumbString);
      }
    }
  }

  render(container: HTMLElement) {
    // create li to store itself and its children
    const li = document.createElement("li");
    li.classList.add("tree-view-li");

    // separator
    const separator = document.createElement("div");
    separator.classList.add("tree-view-item-separator");
    li.appendChild(separator);

    const divLi = document.createElement("div");
    divLi.classList.add("tree-view-li-items");
    li.appendChild(divLi);

    // add icon
    const iTag = document.createElement("i");
    iTag.classList.add(...["fas", "fa-chevron-right", "tree-item-anchor"]);

    const spanText = document.createElement("span");
    spanText.classList.add("tree-item-text");
    const textNode = document.createTextNode(this.data.name);
    spanText.appendChild(textNode);
    // add button
    this.buttonDom = document.createElement("span");
    this.buttonDom.classList.add(...["btn", "btn-sm", "btn-outline-primary"]);
    this.buttonDom.addEventListener("click", (event) => this.onClickButton(event));
    if (this.data.isSelected) {
      this.buttonDom.classList.add(...["btn-lg", "active"]);
      this.buttonDom.textContent = "Added";
    } else {
      this.buttonDom.classList.remove(...["btn-lg", "active"]);
      this.buttonDom.textContent = "Select";
    }

    if (this.hasChildren) {
      divLi.appendChild(iTag);
    }
    divLi.appendChild(spanText);
    divLi.appendChild(this.buttonDom);
    container.appendChild(li);

    divLi.addEventListener("click", (event) => this.toggle(event));
    if (this.children.length > 0 || this.hasChildren) {
      li.classList.add("parent");

      const ul = document.createElement("ul");
      ul.classList.add(...["nested", "active"]);
      ul.setAttribute("id", this.data.name);
      li.appendChild(ul);

      this.children.forEach((child) => {
        child.render(ul);
      });
    } else {
      li.classList.add("leaf");
    }
  }
}

export default TreeItem;
