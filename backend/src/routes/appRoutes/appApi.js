const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();

const appControllers = require('@/controllers/appControllers');
const { routesList } = require('@/models/utils');
const checkFiscalPeriod = require('@/middlewares/checkFiscalPeriod');
const checkAbility = require('@/middlewares/checkAbility');

// Add approval routes FIRST
const globalSearchController = require('@/controllers/appControllers/globalSearchController');
const approvalController = require('@/controllers/appControllers/approvalController');
console.log('Registering manual approval routes...');
router.route('/approval/create').post(catchErrors(approvalController['create']));
router.route('/approval/list').get(catchErrors(approvalController['list']));
router.route('/approval/myApprovals').get(catchErrors(approvalController['myApprovals'])).post(catchErrors(approvalController['myApprovals']));
router.route('/approval/approve/:id').post(catchErrors(approvalController['approve']));
router.route('/approval/reject/:id').post(catchErrors(approvalController['reject']));
router.route('/approval/history').get(catchErrors(approvalController['history'])).post(catchErrors(approvalController['history']));
router.route('/approval/summary').get(catchErrors(approvalController['summary'])).post(catchErrors(approvalController['summary']));
router.route('/approval/notifications').get(catchErrors(approvalController['notifications']));
router.route('/approval/read/:id').get(catchErrors(approvalController['read']));
console.log('Manual approval routes registered.');

router.route('/global/search').get(catchErrors(globalSearchController.search));

const employeeController = require('@/controllers/appControllers/employeeController');
router.route('/employee/myProfile').get(checkAbility('employee'), catchErrors(employeeController['myProfile']));

const routerApp = (entity, controller) => {
  if (!controller) {
    console.warn(`No controller found for entity: ${entity}`);
    return;
  }
  // Skip manual routes if already registered
  if (entity === 'approval') return;

  const ability = checkAbility(entity);

  router.route(`/${entity}/create`).post(
    ['invoice', 'quote', 'payment', 'payroll', 'payslip', 'expense', 'purchaseorder'].includes(entity)
      ? [ability, checkFiscalPeriod, catchErrors(controller['create'])]
      : [ability, catchErrors(controller['create'])]
  );
  router.route(`/${entity}/read/:id`).get([ability, catchErrors(controller['read'])]);
  router.route(`/${entity}/update/:id`).patch(
    ['invoice', 'quote', 'payment', 'payroll', 'payslip', 'expense', 'purchaseorder'].includes(entity)
      ? [ability, checkFiscalPeriod, catchErrors(controller['update'])]
      : [ability, catchErrors(controller['update'])]
  );
  router.route(`/${entity}/delete/:id`).delete(
    ['invoice', 'quote', 'payment', 'payroll', 'payslip', 'expense', 'purchaseorder'].includes(entity)
      ? [ability, checkFiscalPeriod, catchErrors(controller['delete'])]
      : [ability, catchErrors(controller['delete'])]
  );
  router.route(`/${entity}/search`).get([ability, catchErrors(controller['search'])]);
  router.route(`/${entity}/list`).get([ability, catchErrors(controller['list'])]);
  router.route(`/${entity}/listAll`).get([ability, catchErrors(controller['listAll'])]);
  router.route(`/${entity}/filter`).get([ability, catchErrors(controller['filter'])]);
  router.route(`/${entity}/summary`).get([ability, catchErrors(controller['summary'])]);

  if (entity === 'invoice' || entity === 'quote' || entity === 'payment') {
    router.route(`/${entity}/mail`).post([ability, catchErrors(controller['mail'])]);
  }

  if (entity === 'quote') {
    router.route(`/${entity}/convert/:id`).get([ability, catchErrors(controller['convert'])]);
  }
};

routesList.forEach(({ entity, controllerName }) => {
  const controller = appControllers[controllerName];
  console.log(`Registering route for entity: ${entity} with controller: ${controllerName}`);
  routerApp(entity, controller);
});

module.exports = router;
