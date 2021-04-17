const Project = require("../../models/project");
const Unit = require("../../models/unit");
// const Order = require("../../models/order");

function createProjectList(projects, parentId = null) {
  const projectList = [];
  let project;
  if (parentId == null) {
    project = projects.filter((prj) => prj.parentId === undefined);
  } else {
    project = projects.filter((prj) => prj.parentId === parentId);
  }

  for (let prj of project) {
    projectList.push({
      _id: prj._id,
      name: prj.name,
      slug: prj.slug,
      parentId: prj.parentId,
      type: prj.type,
      children: createProjectList(projects, prj._id),
    });
  }

  return projectList;
}

exports.initialData = async (req, res) => {
  const projects = await Project.find({}).exec();
  // const units = await Unit.find({ createdBy: req.user._id })
  const units = await Unit.find({})
    .select("_id name price quantity slug description unitPictures project")
    .populate({ path: "project", select: "_id name" })
    .exec();
  // const orders = await Order.find({})
  //   .populate("items.productId", "name")
  //   .exec();
  res.status(200).json({
    projectList: createProjectList(projects),
    // projects,
    units,
  });
};
