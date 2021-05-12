import 'bootstrap/dist/css/bootstrap.min.css';


import TreeView from "./treeview/tree_view";
import { ActionEnum } from "./treeview/tree_view_interface";
//import { addDebounceAndEnterTrigger } from "../../helpers";
import ContainerList from "./treeview/container_list";
import { ContainerData } from "./treeview/pick_containers_interface";

interface ContainerDataInterface {
  id: string;
  name: string;
  parent_id: string;
  has_children: string;
}

const HIDDEN_FIELDS_ID = "#hidden_fields_container_ids";
const SEARCH_CONTAINER_CONTAINER_LIST_DOM_ID = "#search_container_container_list";
const ALDREADY_SELECTED_CONTAINER_ID_DOM = "already_selected_container_ids";

function removeHiddenField(nodeId: string) {
  //$(`input[type="hidden"][value="${nodeId}"]`).remove();
}

function addHiddenField(nodeId: string) {
  //$(HIDDEN_FIELDS_ID).append(`<input type='hidden' value="${nodeId}" name="youtube_template[container_ids][]">`);
}

function searchContainerList(event: any, containerList: ContainerList) {
  containerList.filter(event.target.value);
}

function shouldBeSelected(selectedContainer: ContainerData[], id: string) : boolean {
  return !!selectedContainer.find((container) => container.id === id);
}

document.addEventListener("DOMContentLoaded", function() {
 // remove onEnter submit to avoid bad behaviour during research
  // $("form input").keydown((event) => {
  //   if (event.keyCode === 13) {
  //     event.preventDefault();
  //   }
  // });
  // by default add hidden field for empty values
  addHiddenField("");

  // get already selected container
  const alreadySelectedContainerIdsHiddenField = (document.getElementById(ALDREADY_SELECTED_CONTAINER_ID_DOM) as HTMLInputElement).value;
  const initContainerList : ContainerData[] = JSON.parse(alreadySelectedContainerIdsHiddenField as string);
  // add hidden field for existing values
  initContainerList.forEach((containerData) => {
    addHiddenField(containerData.id);
  });

  const containerList = new ContainerList(initContainerList, (nodeId) => {
    // eslint-disable-next-line no-use-before-define
    treeView.select(nodeId, false);
    removeHiddenField(nodeId);
  });

  const treeView = new TreeView({
    onLoad: (treeItem) => {
      // axios.get(`/containers.json?filters[parent_id]=${treeItem.nodeId}`)
      //   .then((response) => {
      //     // handle success
      //     const payLoadData = response.data.map(({
      //       id, name, parent_id, has_children,
      //     } : ContainerDataInterface) => ({
      //       nodeId: id,
      //       parentId: parent_id,
      //       hasChildren: has_children,
      //       data: { name, isSelected: shouldBeSelected(containerList.getContainer(), id) },
      //     }));
      //     treeView.addNodes(payLoadData);
      //   });
    },
    onClick: (treeItem) => {
      console.warn(treeItem.nodeId);
    },
    updateSelectedIds: (id, action, name, breadcrumb) => {
      if (action === ActionEnum.add) {
        containerList.addContainer(id, name, breadcrumb);
        addHiddenField(id);
      } else if (action === ActionEnum.remove) {
        containerList.removeContainer(id);
        removeHiddenField(id);
      }
    },
  },
  initContainerList.map((container) => container.id));

  // axios.get("/containers.json")
  //   .then((response) => {
  //     // handle success
  //     const payLoadData = response.data.map(({
  //       id, name, parent_id, has_children,
  //     } : ContainerDataInterface) => ({
  //       nodeId: id,
  //       parentId: parent_id,
  //       hasChildren: has_children,
  //       data: { name, isSelected: shouldBeSelected(containerList.getContainer(), id) },
  //     }));
  //     treeView.addNodes(payLoadData);
  //   })
  //   .catch((error) => {
  //     // handle error
  //     console.error(error);
  //   });
  treeView.addNode("1", null, true, { name: "guillaume", isSelected: false}, true);
  //addDebounceAndEnterTrigger(SEARCH_CONTAINER_CONTAINER_LIST_DOM_ID, (e) => searchContainerList(e, containerList));
});
