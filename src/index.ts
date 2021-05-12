import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/js/all";

import "./fakeServer";

import TreeView from "./treeview/treeView";
import { ActionEnum } from "./treeview/treeViewInterface";
import ContainerList from "./treeview/containerList";
import { ContainerData } from "./treeview/pickContainersInterface";

interface ContainerDataInterface {
  id: string;
  name: string;
  parent_id: string;
  has_children: string;
}

function searchContainerList(event: any, containerList: ContainerList) {
  containerList.filter(event.target.value);
}

function shouldBeSelected(selectedContainer: ContainerData[], id: string) : boolean {
  return !!selectedContainer.find((container) => container.id === id);
}

document.addEventListener("DOMContentLoaded", function() {

  const containerList = new ContainerList([], (nodeId) => {
    // eslint-disable-next-line no-use-before-define
    treeView.select(nodeId, false);
  });

  const treeView = new TreeView({
    onLoad: (treeItem) => {
      axios.get(`/containers.json?parent_id=${treeItem.nodeId}`)
        .then((response) => {
          // handle success
          const payLoadData = response.data.containers.map(({
            id, name, parent_id, has_children,
          } : ContainerDataInterface) => ({
            nodeId: id,
            parentId: parent_id,
            hasChildren: has_children,
            data: { name, isSelected: shouldBeSelected(containerList.getContainer(), id) },
          }));
          console.log(payLoadData)
          treeView.addNodes(payLoadData);
        });
    },
    onClick: (treeItem) => {
      console.warn(treeItem.nodeId);
    },
    updateSelectedIds: (id, action, name, breadcrumb) => {
      if (action === ActionEnum.add) {
        containerList.addContainer(id, name, breadcrumb);
      } else if (action === ActionEnum.remove) {
        containerList.removeContainer(id);
      }
    },
  }, []);

  // first call on 
  axios.get("/containers.json")
    .then((response) => {
      // handle success
      const payLoadData = response.data.containers.map(({
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
});
