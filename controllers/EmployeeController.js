const Employee = require('../models/EmployeeDemo')

const index = (req,res,next)=>{
    if(req.query.page && req.query.limit){
        Employee.paginate({},{page:req.query.page,limit:req.query.limit})
        .then(response=>{
                res.status(200).json({
                    response
                })
            })
            .catch(error =>{
                res.status(400).json({
                    message:'An Error Occured!'
                })
            })
    }else{
        Employee.find().then(response=>{
            res.json({
                response
            })
        })
        .catch(error =>{
            res.json({
                message:'An Error Occured!'
            })
        })
    }
}

const show = (req,res,next)=>{
    let employeeID = req.body.employeeID
    Employee.findById(employeeID)
    .then(response=>{
        res.json({
            response
        })
    })
    .catch(error=>{
        res.json({
            message:'An Error Occured!'
        })
    })
}


const store = (req,res,next)=>{
    let employee = new Employee({
        name:req.body.name,
        email:req.body.email,
        age:req.body.age
    })
    if(req.file){
        let path = ''
        req.files.forEach(function(files,index,arr){
            path = path + files.path + ','
        })
        path =path.substring(0,path.lastIndexOf(","))
        employee.avatar = path
    }
    employee.save()
    .then(response=>{
        res.json({
            message:'Employee Added Successfully'
        })
    })
    .catch(error=>{
        res.json({
            message:'An Error Occured!'
        })
    })
}


const update = (req,res,next)=>{
    let employeeID = req.body.employeeID
    let updateData = {
        name:req.body.name,
        email:req.body.email,
        age:req.body.age
    }
    Employee.findByIdAndUpdate(employeeID,{$set:updateData})
    .then(()=>{
        res.json({
            message:'Employee Updated Successfully'
        })
    })
    .catch(error=>{
        res.json({
            message:'An Error Occured!'
        })
    })
}

const destroy = (req,res,next)=>{
    let employeeID = req.body.employeeID
    Employee.findByIdAndRemove(employeeID)
    .then(()=>{
        res.json({
            message:'Employee Deleted Successfully'
        })
    })
    .catch(error=>{
        res.json({
            message:'An Error Occured!'
        })
    })
}

module.exports = {
    index,show,store,update,destroy
}