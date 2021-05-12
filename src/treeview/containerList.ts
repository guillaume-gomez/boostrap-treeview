import { camelCase } from "lodash";
import "./css/container_list.css";

import { ContainerData } from "./pickContainersInterface";

const CONTAINER_LIST_ID = "container_list";

class ContainerList {
  private containers : ContainerData[] = [];

  private onRemove: ((id: string) => void) | null;

  constructor(containers: ContainerData[] = [], onRemove: ((id:string) => void) | null = null) {
    this.containers = containers;
    this.render();
    this.onRemove = onRemove;
  }

  public getContainer() : ContainerData[] {
    return this.containers;
  }

  public addContainer(id: string, name: string, breadcrumb: string) {
    this.containers = [...this.containers, { id, name, breadcrumb }];
    this.render();
  }

  public removeContainer(id: string) {
    this.containers = this.containers.filter((container) => container.id !== id);
    this.render();
    if (this.onRemove) {
      this.onRemove(id);
    }
  }

  public filter(search: string) {
    const searchContainerList = this.containers.filter((container) => camelCase(container.name).includes(camelCase(search)));
    this.render(searchContainerList);
  }

  static refresh(): void {
    const containerListNode = document.getElementById(CONTAINER_LIST_ID);
    if (!containerListNode) {
      return;
    }
    while (containerListNode.firstChild) {
      containerListNode.firstChild.remove();
    }
  }

  render(containers : ContainerData[] = this.containers) {
    ContainerList.refresh();
    const parent = document.getElementById(CONTAINER_LIST_ID);
    if (!parent) {
      console.error(`something went wrong. Could not find id '${CONTAINER_LIST_ID}'`);
      return;
    }
    containers.forEach((container) => this.renderCard(container, parent));
  }

  renderCard(container: ContainerData, parent: HTMLElement) {
    const cardDom = document.createElement("div");
    cardDom.classList.add(...["card", "mb-3"]);

    const cardHeader = document.createElement("div");
    cardHeader.classList.add(...["card-header", "container-list-header", "pb-2", "pt-2"]);

    const headerTitle = document.createElement("span");
    headerTitle.textContent = container.name;
    cardHeader.appendChild(headerTitle);

    const headerCloseButton = document.createElement("button");
    headerCloseButton.classList.add("close");
    headerCloseButton.setAttribute("type", "button");
    headerCloseButton.addEventListener("click", () => this.removeContainer(container.id));

    const span = document.createElement("span");
    span.textContent = "x";
    span.setAttribute("aria-hidden", "true");
    headerCloseButton.appendChild(span);

    cardHeader.appendChild(headerCloseButton);

    const cardBody = document.createElement("div");
    cardBody.classList.add(...["card-body", "pb-3", "pt-3"]);

    const breacrumb = document.createElement("span");
    breacrumb.textContent = container.breadcrumb;
    cardBody.appendChild(breacrumb);

    parent.appendChild(cardDom);
    cardDom.appendChild(cardHeader);
    cardDom.appendChild(cardBody);
  }
}

export default ContainerList;
