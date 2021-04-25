const Master = require("../models/master");
const slugify = require("slugify");
const shortid = require("shortid");

function createMasterList(masters, parentId = null) {
  const mastersList = [];
  let master;

  if (parentId == null) {
    master = masters.filter((prop) => prop.parentId == undefined);
  } else {
    master = masters.filter((prop) => prop.parentId == parentId);
  }

  for (let mstr of master) {
    mastersList.push({
      _id: mstr._id,
      name: mstr.name,
      slug: mstr.slug,
      description: mstr.description,
      parentId: mstr.parentId,
      type: mstr.type,
      children: createMasterList(masters, mstr._id),
    });
  }

  return mastersList;
}

exports.getAllMasters = (req, res) => {
  Master.find({}).exec((error, masters) => {
    if (error) return res.status(400).json({ error: error });
    if (masters) {
      const masterList = createMasterList(masters);
      res.status(200).json({ masterList: masterList });
    }
  });
};
