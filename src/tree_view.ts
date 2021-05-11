// import TreeItem from "./TreeItem";
// import {
//   ActionEnum, TreeItemData, HandlersTreeViewInterface,
// } from "./tree_view_interface";

// const TREE_ITEM_ID = "treeView";

// interface PayLoadData extends TreeItemData {
//   parentId: string | null;
//   hasChildren: boolean;
//   nodeId: string
//   data: TreeItemData;
// }

// class TreeView {
//   private roots: TreeItem[] = [];

//   private handlers : HandlersTreeViewInterface;

//   private selectedIds : string[] = [];

//   constructor(handlers: HandlersTreeViewInterface, selectedIds: string[] = []) {
//     this.handlers = {
//       updateSelectedIds: (nodeId: string, action: ActionEnum) => this.updateSelectedIds(nodeId, action),
//       ...handlers,
//     };
//     this.selectedIds = selectedIds;
//   }

//   addNode(nodeId: string, parentId: string | null, hasChildren: boolean, data: TreeItemData, reRender: boolean = true) : string {
//     if (parentId === null) {
//       const root = new TreeItem(nodeId, null, hasChildren, this.computeBreadcrumb(data.name, null), data, this.handlers);
//       this.roots = [...this.roots, root];
//       return nodeId;
//     }

//     const parentTreeItem = this.findNode(parentId);
//     if (!parentTreeItem) {
//       console.error(`node not found with id: ${parentId}`);
//       return "";
//     }
//     const newNode = new TreeItem(nodeId, parentId, hasChildren, this.computeBreadcrumb(data.name, parentTreeItem), data, this.handlers);
//     parentTreeItem.addChild(newNode);
//     if (reRender) {
//       this.render();
//     }
//     return nodeId;
//   }

//   addNodes(payload: PayLoadData[]) {
//     payload.forEach(({
//       nodeId, parentId, hasChildren, data,
//     }) => {
//       this.addNode(nodeId, parentId, hasChildren, data, false);
//     });
//     this.render();
//   }

//   select(nodeId: string, state: boolean) {
//     const treeItem : TreeItem | null = this.findNode(nodeId);
//     if (treeItem) {
//       treeItem.setSeleted(state);
//     }
//   }

//   private findNode(nodeId: string) : TreeItem | null {
//     let result = null;
//     for (let i = 0; result == null && i < this.roots.length; i += 1) {
//       result = this.roots[i].findNode(nodeId);
//     }
//     return result;
//   }

//   static refresh(): void {
//     const treeViewNode = document.getElementById(TREE_ITEM_ID);
//     if (!treeViewNode) {
//       return;
//     }
//     while (treeViewNode.firstChild) {
//       treeViewNode.firstChild.remove();
//     }
//   }

//   private computeBreadcrumb(nodeName: string, parent : TreeItem | null) : string[] {
//     let currentParent = parent;
//     const breadcrumb : string[] = [nodeName];
//     while (currentParent !== null) {
//       const name = currentParent?.getData()?.name;
//       if (name) {
//         breadcrumb.push(name);
//       }

//       const parentId = currentParent.getParentId();
//       if (parentId) {
//         currentParent = this.findNode(parentId);
//       } else {
//         // exit the loop
//         currentParent = null;
//       }
//     }
//     return breadcrumb;
//   }

//   updateSelectedIds(nodeId: string, action: ActionEnum) {
//     if (action === ActionEnum.add) {
//       this.selectedIds = [...this.selectedIds, nodeId];
//     } else if (action === ActionEnum.remove) {
//       this.selectedIds = this.selectedIds.filter((id) => id !== nodeId);
//     }
//     if (this.handlers?.onSelectedIds) {
//       this.handlers.onSelectedIds(this.selectedIds);
//     }
//   }

//   private render(domId = TREE_ITEM_ID) {
//     TreeView.refresh();
//     const container : HTMLElement | null = document.getElementById(domId);
//     if (!container) {
//       console.error(`could not find in the DOM ${domId}`);
//       return;
//     }

//     const parent = document.createElement("ul");
//     parent.setAttribute("class", "tree-view");
//     container.appendChild(parent);

//     if (this.roots) {
//       this.roots.forEach((root) => {
//         root.render(parent);
//       });
//     }
//   }
// }

// export default TreeView;
