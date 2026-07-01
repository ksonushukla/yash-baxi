const categoryModel = require("../model/CategoryModel");

const addCategory = async(req,res)=>{
    const newCategory = await categoryModel.create(req.body);
    if(!newCategory){
        res.json({
            message:"Category not added",
            data:null
        })
    }
    else{
        res.json({
            message:"Category added successfully",
            data:newCategory
        })
    }
}

const getCategory = async(req,res)=>{
    const category = await categoryModel.find();
    if(!category){
        res.json({
            message:"Category not found",
            data:null
        })
    }
    else{
        res.json({
            message:"Category found",
            data:category
        })
    }
}

const deleteCategory = async(req,res)=>{
    const id = req.params.id;
    const category = await categoryModel.findOneAndDelete({_id:id});
    if(!category){
        res.status(404).json({
            message:"Category not found",
            data:null
        })
    }
    else{
        res.json({
            message:"Category deleted successfully",
            data:category
        })
    }
}

const updateCategory = async(req,res)=>{
    const id = req.params.id;
    const category = await categoryModel.findOneAndUpdate({_id:id},req.body,{new:true,runValidators:true});
    if(!category){
        res.status(404).json({
            message:"Category not found",
            data:null
        })
    }
    else{
        res.json({
            message:"Category updated successfully",
            data:category
        })
    }
}

module.exports = {
    addCategory,
    getCategory,
    deleteCategory,
    updateCategory
}