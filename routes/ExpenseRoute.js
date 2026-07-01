const ExpenseController = require("../controller/ExpenseController");
const express = require("express");
const route = express.Router();

route.post("/add",ExpenseController.addExpense);
route.get("/get",ExpenseController.getExpense);
route.delete("/delete/:id",ExpenseController.deleteExpense);
route.put("/update/:id",ExpenseController.updateExpense);
route.get("/getByDate",ExpenseController.getExpenseByDate);

module.exports = route;