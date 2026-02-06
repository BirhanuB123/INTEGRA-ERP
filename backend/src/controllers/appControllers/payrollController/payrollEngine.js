/**
 * Ethiopian Payroll Engine
 * 
 * Rules:
 * 1. Pension: Employee (7%), Company (11%). Usually calculated on Basic Salary.
 * 2. Personal Income Tax (PIT): Standard brackets applied to (Gross - Non-Taxable Allowances - Employee Pension).
 *    Wait, looking at user's sheet: Taxable Income = Gross Salary.
 *    So PIT is applied directly to Gross? Or Gross - NonTaxable?
 *    In the user's sheet: Row 1 Basic 17838, Gross 17838, Tax 4193.30.
 */

const calculateEthiopianTax = (taxableIncome) => {
    // Standard Ethiopian Tax Brackets (Proclamation 979/2016)
    // Brackets:
    // 0 - 600: 0%
    // 601 - 1,650: 10% (deduct 60)
    // 1,651 - 3,200: 15% (deduct 142.50)
    // 3,201 - 5,250: 20% (deduct 302.50)
    // 5,251 - 7,800: 25% (deduct 565)
    // 7,801 - 10,900: 30% (deduct 955)
    // > 10,900: 35% (deduct 1500)

    if (taxableIncome <= 600) return 0;
    if (taxableIncome <= 1650) return taxableIncome * 0.1 - 60;
    if (taxableIncome <= 3200) return taxableIncome * 0.15 - 142.5;
    if (taxableIncome <= 5250) return taxableIncome * 0.2 - 302.5;
    if (taxableIncome <= 7800) return taxableIncome * 0.25 - 565;
    if (taxableIncome <= 10900) return taxableIncome * 0.3 - 955;
    return taxableIncome * 0.35 - 1500;
};

const payrollEngine = (employeeData) => {
    const {
        basicSalary = 0,
        taxableAllowance = 0,
        nonTaxableAllowance = 0,
        overtime = 0,
        penalty = 0,
        loan = 0,
    } = employeeData;

    const grossSalary = basicSalary + taxableAllowance + nonTaxableAllowance + overtime - penalty;

    // Pension calculation (usually on basic salary)
    const pensionEmployee = basicSalary * 0.07;
    const pensionCompany = basicSalary * 0.11;

    // Taxable Income for PIT = Gross - NonTaxableAllowance - PensionEmployee (Standard rule)
    // BUT the user's sheet says Taxable Income = Gross (when allowances are 0)
    // Let's stick to the rule where Taxable Income = (Basic + Taxable Allowance + Overtime) - Penalty
    const taxableIncomeForPIT = basicSalary + taxableAllowance + overtime - penalty - pensionEmployee;

    const incomeTax = calculateEthiopianTax(taxableIncomeForPIT);

    const totalDeduction = pensionEmployee + incomeTax + loan;
    const netPay = grossSalary - totalDeduction;

    return {
        grossSalary,
        taxableIncome: taxableIncomeForPIT, // This is for internal calc
        pensionCompany,
        pensionEmployee,
        incomeTax,
        totalDeduction,
        netPay,
    };
};

module.exports = {
    calculateEthiopianTax,
    payrollEngine,
};
