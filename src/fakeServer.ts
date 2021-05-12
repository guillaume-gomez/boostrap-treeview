import { createServer, Model } from "miragejs"


createServer({
  models: {
    containers: Model,
  },

  seeds(server) {
      server.create("container", { id: "1", name: "A", parent_id: null, has_children: true })
      server.create("container", { id: "2", name: "B", parent_id: null, has_children: true })
      server.create("container", { id: "3", name: "C", parent_id: null, has_children: true })
      server.create("container", { id: "4", name: "AA", parent_id: "1", has_children: true })
      server.create("container", { id: "5", name: "AAA", parent_id: "4", has_children: true })
      server.create("container", { id: "6", name: "AAAA", parent_id: "5", has_children: false })
      server.create("container", { id: "7", name: "BB", parent_id: "2", has_children: true })
      server.create("container", { id: "8", name: "BB'", parent_id: "2", has_children: false })
      server.create("container", { id: "9", name: "BBB", parent_id: "7", has_children: false })
      server.create("container", { id: "10", name: "CC", parent_id: "3", has_children: false })
  },

  routes() {
    this.get("/containers.json", (schema, request) => {
      const { parent_id } = request.queryParams;
      const parentIdParam = parent_id || null;
      return (schema as any).containers.where({parent_id: parentIdParam });
    })
  },
})