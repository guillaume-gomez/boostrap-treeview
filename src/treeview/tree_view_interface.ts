export enum ActionEnum {
  add,
  remove
}

export interface TreeItemData {
  name: string;
  isSelected: boolean;
}

export interface CallbackData {
  data: TreeItemData;
  parentId: string | null;
  hasChildren: boolean;
  nodeId: string;
}

export interface HandlersTreeViewInterface {
  onClick?: (data: CallbackData) => void;
  onLoad?: (data: CallbackData) => void;
  onSelectedIds?: (ids: string[]) => void;
  updateSelectedIds?: (nodeId: string, action: ActionEnum, name: string, breadcrumb: string) => void;
}
