import axios from "axios";
import TreeView from "./tree_view";
import { ActionEnum } from "./tree_view_interface";
//import { addDebounceAndEnterTrigger } from "../../helpers";
import ContainerList from "./container_list";
import { ContainerData } from "./pick_containers_interface";

interface ContainerDataInterface {
  id: string;
  name: string;
  parent_id: string;
  has_children: string;
}

const HIDDEN_FIELDS_ID = "#hidden_fields_container_ids";
const PICK_CONTAINER_PAGE_DOM_ID = "pick-container-page";
const SEARCH_CONTAINER_CONTAINER_LIST_DOM_ID = "#search_container_container_list";
const ALDREADY_SELECTED_CONTAINER_ID_DOM = "#already_selected_container_ids";

function removeHiddenField(nodeId: string) {
  $(`input[type="hidden"][value="${nodeId}"]`).remove();
}

function addHiddenField(nodeId: string) {
  $(HIDDEN_FIELDS_ID).append(`<input type='hidden' value="${nodeId}" name="youtube_template[container_ids][]">`);
}

function searchContainerList(event: any, containerList: ContainerList) {
  containerList.filter(event.target.value);
}

function shouldBeSelected(selectedContainer: ContainerData[], id: string) : boolean {
  return !!selectedContainer.find((container) => container.id === id);
}

$(document).on("turbolinks:load", () => {
  // check if we are on pick_container step in youtube_template controller
  if (document.getElementById(PICK_CONTAINER_PAGE_DOM_ID)) {
    // remove onEnter submit to avoid bad behaviour during research
    $("form input").keydown((event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
      }
    });
    // by default add hidden field for empty values
    addHiddenField("");

    // get already selected container
    const alreadySelectedContainerIdsHiddenField = $(ALDREADY_SELECTED_CONTAINER_ID_DOM).val();
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
        axios.get(`/containers.json?filters[parent_id]=${treeItem.nodeId}`)
          .then((response) => {
            // handle success
            const payLoadData = response.data.map(({
              id, name, parent_id, has_children,
            } : ContainerDataInterface) => ({
              nodeId: id,
              parentId: parent_id,
              hasChildren: has_children,
              data: { name, isSelected: shouldBeSelected(containerList.getContainer(), id) },
            }));
            treeView.addNodes(payLoadData);
          });
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

    axios.get("/containers.json")
      .then((response) => {
        // handle success
        const payLoadData = response.data.map(({
          id, name, parent_id, has_children,
        } : ContainerDataInterface) => ({
          nodeId: id,
          parentId: parent_id,
          hasChildren: has_children,
          data: { name, isSelected: shouldBeSelected(containerList.getContainer(), id) },
        }));
        treeView.addNodes(payLoadData);
      })
      .catch((error) => {
        // handle error
        console.error(error);
      });

    //addDebounceAndEnterTrigger(SEARCH_CONTAINER_CONTAINER_LIST_DOM_ID, (e) => searchContainerList(e, containerList));
  }
});
