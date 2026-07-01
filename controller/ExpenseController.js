const ExpenseModel = require("../model/ExpenseModel");

const addExpense = async (req, res) => {
    try {
        const expense = await ExpenseModel.create(req.body)
        if (!expense) {
            res.status(400).json({
                message: "Expense not created",
                data: null
            })
        }
        else {
            res.status(201).json({
                message: "Expense created successfully",
                data: expense
            })
        }
    }
  catch (err) {
  console.log(err);

  res.status(500).json({
    message: err.message,
    data: null
    
  });
}
}

const getExpense = async (req, res) => {
    try {
        const expense = await ExpenseModel.find().populate("userId").populate("categoryId")
        if (!expense) {
            res.status(400).json({
                message: "Expense not found",
                data: null
            })
        }
        else {
            res.status(200).json({
                message: "Expense found successfully",
                data: expense
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: "External problem",
            data: null
        })
    }
}

const deleteExpense = async (req, res) => {
    const id = req.params.id
    try {
        const expense = await ExpenseModel.findByIdAndDelete(id)
        if (!expense) {
            res.status(400).json({
                message: "Expense not found",
                data: null
            })
        }
        else {
            res.status(200).json({
                message: "Expense deleted successfully",
                data: expense
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: "External problem",
            data: null
        })
    }
}

const updateExpense = async (req, res) => {
    const id = req.params.id
    try {
        const expense = await ExpenseModel.findByIdAndUpdate(id, req.body, { new: true })
        if (!expense) {
            res.status(400).json({
                message: "Expense not found",
                data: null
            })
        }
        else {
            res.status(200).json({
                message: "Expense updated successfully",
                data: expense
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: "External problem",
            data: null
        })
    }
}


const getExpenseByDate = async (req, res) => {
    try {
        const now = new Date();
        // Always normalize start to first day of the month (12 months ago, UTC safe)
        const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));

        // Debug logs
        console.log("Now:", now);
        console.log("Start date filter:", start);

        const expense = await ExpenseModel.aggregate([
            {
                $match: {
                    date: { $gte: start } // Make sure "date" field is type: Date in your schema
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    totalExpense: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    year: "$_id.year",
                    monthNum: "$_id.month",
                    month: {
                        $arrayElemAt: [
                            [
                                "", "January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December"
                            ],
                            "$_id.month"
                        ]
                    },
                    totalExpense: 1,
                    _id: 0
                }
            },
            { $sort: { year: 1, monthNum: 1 } }
        ]);

        console.log("Raw aggregation result:", expense);

        // Fill missing months (0 expense)
        let result = [];
        let grandTotal = 0;

        for (let i = 0; i < 12; i++) {
            let d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
            let year = d.getFullYear();
            let monthNum = d.getMonth() + 1;
            let monthName = d.toLocaleString("default", { month: "long" });

            let found = expense.find(e => e.year === year && e.monthNum === monthNum);

            let monthlyExpense = found ? found.totalExpense : 0;
            grandTotal += monthlyExpense;

            result.push({
                year,
                month: monthName,
                totalExpense: monthlyExpense
            });
        }

        res.status(200).json({
            message: "Last 12 months expense",
            data: result,
            total: grandTotal
        });
    } catch (err) {
        console.error("Error in getExpenseByDate:", err);
        res.status(500).json({
            message: "External problem",
            data: null
        });
    }
};






module.exports = {
    addExpense,
    getExpense,
    deleteExpense,
    updateExpense,
    getExpenseByDate
}