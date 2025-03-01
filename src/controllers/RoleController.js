const roleModel = require('../models/RoleModels');

const getAllRoles = async (req, res) => {
    try {
        const roles = await roleModel.find();
        res.status(200).json({
            message: 'Roles fetched successfully',
            data: roles
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching roles',
            error: error.message
        });
    }
};

const createRole = async (req, res) => {
    try {
        const createdRole = await roleModel.create(req.body)
        res.status(201).json({
            message: 'Role created successfully',
            data: createdRole
        })
    }   
    catch (error) {
        res.status(500).json({
            message: 'Error creating role',
            error: error.message
        });
    }
}

const deleteRole = async (req, res) => {
    try {
        const deletedRole = await roleModel.findByIdAndDelete(req.params.id);
        res.status(204).json({
            message: 'Role deleted successfully',
            data: deletedRole
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error deleting role',
            error: error.message
        });
    }
}

const getRoleById = async (req, res) => {
    try {
        const foundRole = await roleModel.findById(req.params.id);
        res.status(200).json({
            message: 'Role fetched successfully',
            data: foundRole
        });
    }
    catch(error) {
        res.status(500).json({
            message: 'error fetching role',
            error: error.message
        });
    }
}   

module.exports = {
    getAllRoles, createRole, deleteRole, getRoleById
}