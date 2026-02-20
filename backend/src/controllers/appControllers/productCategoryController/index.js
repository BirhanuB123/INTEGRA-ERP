const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const methods = createCRUDController('ProductCategory');

function normalizeParentCategory(body) {
    const b = { ...body };
    if (b.parentCategory === '' || b.parentCategory === null || b.parentCategory === undefined) {
        delete b.parentCategory;
    }
    return b;
}

const originalCreate = methods.create;
methods.create = (req, res) => {
    req.body = normalizeParentCategory(req.body);
    return originalCreate(req, res);
};

const originalUpdate = methods.update;
methods.update = (req, res) => {
    req.body = normalizeParentCategory(req.body);
    return originalUpdate(req, res);
};

module.exports = methods;
