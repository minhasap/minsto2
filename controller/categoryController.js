const categoryCollection = require("../models/categoryModel");

const loadCategory = async (req, res) => {
  try {
    const data = await categoryCollection.find({ status: false });
    res.render('category', { data });
  } catch (error) {
    console.log(error);
  }
}

const loadAddCategory = async (req, res) => {
  try {
    // const categories = await categoryCollection.find();
    res.render('addCategory');
  } catch (error) {
    console.log(error);
  }
}

const addCategory = async (req, res) => {
  try {
    const newCategory = req.body.category;

    // Check if the category already exists
    const existingCategory = await categoryCollection.findOne({ category: newCategory });
    if (existingCategory) {
      console.log("existing category");
      res.render('addCategory',
        {
          category: await categoryCollection.find({}),
          errorMessage: "Category already exists.",

        });
    } else {
      console.log(" category added");

      const result = await categoryCollection.create({ category: newCategory });
      if (result) {
        res.redirect("category");
      } else {
        res.redirect("category");
      }
    }
  } catch (error) {
    console.log(error);
  }
}


const editCategory = async (req, res) => {


  try {
    // const category =await categorycollection.find().lean();
    const id = req.params.id;

    const category = await categoryCollection.findOne({ _id: id });
    console.log(category);


    res.render("editCategory", {
      category,
    });
  } catch (error) {
    console.log(error);
  }
};


const addEditCategory = async (req, res) => {
  try {
    const id = req.body.id;
    console.log(id);
    if (id) {
      await categoryCollection.updateOne({ _id: id }, {
        $set: {
          category: req.body.category,
        }
      })
      res.redirect('category')
    }
  } catch (error) {

  }
};




module.exports = {
  loadCategory,
  addCategory,
  loadAddCategory,
  editCategory,
  addEditCategory,
};
