var Way = function(args) {
  this.id = (args['id'] === undefined) ? [] : args['id'];
  this.nodes = (args['nodes'] === undefined) ? [] : args['nodes'];
  this.edges = (args['edges'] === undefined) ? [] : args['edges'];
  this.graph = (args['graph'] === undefined) ? [] : args['graph'];
};

