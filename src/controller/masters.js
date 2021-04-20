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

exports.getMasters = (req, res) => {
  Master.find({}).exec((error, masters) => {
    if (error) return res.status(400).json({ error: error });
    if (masters) {
      const masterList = createMasterList(masters);
      res.status(200).json({ masterList: masterList });
    }
  });
};

exports.addMaster = (req, res) => {
  const masterObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
    description: req.body.description,
    createdBy: req.user._id,
  };

  if (req.body.parentId) {
    masterObj.parentId = req.body.parentId;
  }

  // return res.status(201).json({ masterObj });

  const mstr = new Master(masterObj);
  mstr.save((error, master) => {
    if (error) return res.status(400).json({ error: error });
    if (master) {
      return res.status(201).json({ master });
    }
  });
};
