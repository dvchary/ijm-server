// const Product = require("../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
// const Category = require("../models/category");
const Project = require("../models/project");
const Unit = require("../models/unit");

exports.createUnit = (req, res) => {
  // res.status(200).json({ file: req.files, body: req.body });

  const { name, price, description, project, quantity, createdBy } = req.body;

  if (!name) {
    res.status(200).json({ message: "Name Value is not passed" });
  }
  let unitPictures = [];

  if (req.files.length > 0) {
    unitPictures = req.files.map((file) => {
      return { unitPictures: file.location };
    });
  }

  const unit = new Unit({
    name: name,
    slug: slugify(name),
    price,
    quantity,
    description,
    unitPictures,
    project,
    createdBy: req.user._id,
  });

  unit.save((error, unit) => {
    if (error) return res.status(400).json({ error });
    if (unit) {
      res.status(201).json({ unit, files: req.files });
    }
  });
};

exports.getUnitsBySlug = (req, res) => {
  const { slug } = req.params;
  Project.findOne({ slug: slug })
    .select("_id type")
    .exec((error, project) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (project) {
        Unit.find({ project: project._id }).exec((error, units) => {
          if (error) {
            return res.status(400).json({ error });
          }

          if (project.type) {
            if (units.length > 0) {
              res.status(200).json({
                units,
                priceRange: {
                  under5k: 5000,
                  under10k: 10000,
                  under15k: 15000,
                  under20k: 20000,
                  under30k: 30000,
                },
                productsByPrice: {
                  under5k: products.filter((product) => product.price <= 5000),
                  under10k: products.filter(
                    (product) => product.price > 5000 && product.price <= 10000
                  ),
                  under15k: products.filter(
                    (product) => product.price > 10000 && product.price <= 15000
                  ),
                  under20k: products.filter(
                    (product) => product.price > 15000 && product.price <= 20000
                  ),
                  under30k: products.filter(
                    (product) => product.price > 20000 && product.price <= 30000
                  ),
                },
              });
            }
          } else {
            res.status(200).json({ units });
          }
        });
      }
    });
};

exports.getUnitDetailsById = (req, res) => {
  const { unitId } = req.params;
  if (unitId) {
    Unit.findOne({ _id: unitId }).exec((error, unit) => {
      if (error) return res.status(400).json({ error });
      if (unit) {
        res.status(200).json({ unit });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

// new update
exports.deleteUnitById = (req, res) => {
  const { unitId } = req.body.payload;
  if (unitId) {
    Unit.deleteOne({ _id: unitId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getUnits = async (req, res) => {
  const units = await Unit.find({ createdBy: req.user._id })
    .select("_id name price quantity slug description unitPictures project")
    .populate({ path: "project", select: "_id name" })
    .exec();

  res.status(200).json({ units });
};
