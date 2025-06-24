const category_model = require("../models/category.model")

/**
 * Controller for creating the category
 */
exports.createNewCategory = async (req, res)=>{
    const cat_data = {
        name : req.body.name,
        description : req.body.description
    }
    try{
       const category = await category_model.create(cat_data)
       return res.status(201).send(category)
    }catch(err){
        console.log("Error while creating the category", err)
        return res.status(500).send({
            message : "Error while creating the category"
        })
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await category_model.find();
        res.status(200).send(categories);
    } catch (err) {
        console.log("Error while fetching categories", err);
        res.status(500).send({
            message: "Error while fetching categories"
        });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const category = await category_model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!category) {
            return res.status(404).send({
                message: "Category not found"
            });
        }
        
        res.status(200).send(category);
    } catch (err) {
        console.log("Error while updating category", err);
        res.status(500).send({
            message: "Error while updating category"
        });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const category = await category_model.findByIdAndDelete(req.params.id);
        
        if (!category) {
            return res.status(404).send({
                message: "Category not found"
            });
        }
        
        res.status(200).send({
            message: "Category deleted successfully"
        });
    } catch (err) {
        console.log("Error while deleting category", err);
        res.status(500).send({
            message: "Error while deleting category"
        });
    }
}