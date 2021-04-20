const Project = require("../models/project");

function createProperties(properties, parentId = null) {
  const propertiesList = [];
  let property;
  if (parentId == null) {
    property = properties.filter((prop) => prop.parentId == undefined);
  } else {
    property = properties.filter((prop) => prop.parentId == parentId);
  }

  for (let prop of property) {
    propertiesList.push({
      _id: prop._id,
      name: prop.name,
      slug: prop.slug,
      parentId: prop.parentId,
      type: prop.type,
      children: createProperties(properties, prop._id),
    });
  }

  return propertiesList;
}

exports.getProperties = (req, res) => {
  // res.status(200).json({ message: "Hello execution started" });

  Project.find({}).exec((error, properties) => {
    // res.status(200).json({ message: "Query Executed" });
    if (error) return res.status(400).json({ error: error });
    if (properties) {
      const propertyList = createProperties(properties);
      res.status(200).json({ propertyList: propertyList });
    }
  });
};
