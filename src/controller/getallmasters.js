const Master = require("../models/master");
const slugify = require("slugify");
const shortid = require("shortid");

function createMasterList(masters, parentId = null) {
  const mastersList = [];
  const incomeList = [];
  let master;
  let annualincome;

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

exports.updateMasters = async (req, res) => {
  const { _id, name, description, parentId, type } = req.body;

  const updatedMasters = [];

  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const master = {
        name: name[i],
        type: type[i],
        description: description[i],
      };

      if (parentId[i] !== "") {
        master.parentId = parentId[i];
      }

      const updatedMasters = await Master.findOneAndUpdate(
        { _id: _id[i] },
        master,
        { new: true }
      );
      updatedMasters.push(updatedMasters);
    }
    return res.status(201).json({ updatedMasters: updatedMasters });
  } else {
    const master = {
      name,
      description,
      type,
    };

    if (parentId !== "") {
      master.parentId = parentId;
    }
    const updatedMaster = await Master.findOneAndUpdate({ _id }, master, {
      new: true,
    });

    return res.status(201).json({ updatedMaster: updatedMaster });
  }
};

exports.deleteProjects = async (req, res) => {
  const { ids } = req.body.payload;
  const deletedMasters = [];

  for (let i = 0; i < ids.length; i++) {
    const deleteMaster = await Master.findOneAndDelete({
      _id: ids[i]._id,
      createdBy: req.user._id,
    });
    deletedMasters.push(deleteMaster);
  }

  if (deletedMasters.length == ids.length) {
    res.status(201).json({ message: "Masters removed" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
};
