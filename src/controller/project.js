const Project = require("../models/project");
const slugify = require("slugify");
const shortid = require("shortid");

function createProjects(projects, parentId = null) {
  const projectsList = [];
  let project;
  if (parentId == null) {
    project = projects.filter((prj) => prj.parentId == undefined);
  } else {
    project = projects.filter((prj) => prj.parentId == parentId);
  }

  for (let prj of project) {
    projectsList.push({
      _id: prj._id,
      name: prj.name,
      slug: prj.slug,
      parentId: prj.parentId,
      type: prj.type,
      children: createProjects(projects, prj._id),
    });
  }

  return projectsList;
}

exports.addProject = (req, res) => {
  const projectObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
    createdBy: req.user._id,
  };

  if (req.file) {
    projectObj.image = "/public/" + req.file.filename;
  }

  if (req.body.parentId) {
    projectObj.parentId = req.body.parentId;
  }

  const prj = new Project(projectObj);
  prj.save((error, project) => {
    if (error) return res.status(400).json({ error });
    if (project) {
      return res.status(201).json({ project });
    }
  });
};

exports.getProjects = (req, res) => {
  Project.find({}).exec((error, projects) => {
    if (error) return res.status(400).json({ error });
    if (projects) {
      const projectList = createProjects(projects);
      res.status(200).json({ projectList });
    }
  });
};

exports.updateProjects = async (req, res) => {
  const { _id, name, parentId, type } = req.body;
  const updatedProjects = [];
  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const project = {
        name: name[i],
        type: type[i],
      };
      if (parentId[i] !== "") {
        project.parentId = parentId[i];
      }

      const updatedProjects = await Project.findOneAndUpdate(
        { _id: _id[i] },
        project,
        { new: true }
      );
      updatedProjects.push(updatedProjects);
    }
    return res.status(201).json({ updatedProjects: updatedProjects });
  } else {
    const project = {
      name,
      type,
    };
    if (parentId !== "") {
      project.parentId = parentId;
    }
    const updatedProject = await Project.findOneAndUpdate({ _id }, project, {
      new: true,
    });
    return res.status(201).json({ updatedProject });
  }
};

exports.deleteProjects = async (req, res) => {
  const { ids } = req.body.payload;
  const deletedProjects = [];
  for (let i = 0; i < ids.length; i++) {
    const deleteProject = await Project.findOneAndDelete({
      _id: ids[i]._id,
      createdBy: req.user._id,
    });
    deletedProjects.push(deleteProject);
  }

  if (deletedProjects.length == ids.length) {
    res.status(201).json({ message: "Projects removed" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
};
