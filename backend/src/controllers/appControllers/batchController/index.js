const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const methods = createCRUDController('Batch');

function normalizeBody(body) {
    const b = { ...body };
    if (b.warehouse === '' || b.warehouse === null || b.warehouse === undefined) {
        delete b.warehouse;
    }
    return b;
}

const originalCreate = methods.create;
methods.create = (req, res) => {
    req.body = normalizeBody(req.body);
    return originalCreate(req, res);
};

const originalUpdate = methods.update;
methods.update = (req, res) => {
    req.body = normalizeBody(req.body);
    return originalUpdate(req, res);
};

module.exports = methods;
