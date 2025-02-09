const db = require('../lib/db');

// 계약 검색
exports.searchLeaseContract = (req, res) => {
    const {selected_date, start_date, end_date, house_id, lot_number, tenant_id, contract_status, billing_deadline} = req.body;

    let sqlQuery = `
      SELECT 
        lc.contract_number, lc.contract_status, h.address AS house_address, h.billing_deadline AS billing_deadline,
        DATE_FORMAT(lc.contract_date, '%Y-%m-%d') AS contract_date,
        DATE_FORMAT(lc.lease_period_start, '%Y-%m-%d') AS lease_period_start, 
        DATE_FORMAT(lc.lease_period_end, '%Y-%m-%d') AS lease_period_end, 
        te.name AS tenant_name, te.mobile AS tenant_mobile,
        FORMAT(lc.deposit, 0) AS deposit, FORMAT(lc.monthly_rent, 0) AS monthly_rent,
        FORMAT(lc.shared_cost, 0) AS shared_cost, FORMAT(lc.down_payment, 0) AS down_payment, 
        FORMAT(lc.interim_payment, 0) AS interim_payment, FORMAT(lc.prepaid_rent, 0) AS prepaid_rent, 
        lc.deposit as fromOther, lc.deposit as fromOther1, lc.contract_form AS fromOther2
    FROM LeaseContract lc
    JOIN Tenant te ON lc.tenant_id = te.tenant_id
    JOIN HouseInfo h ON lc.house_id = h.house_id
      WHERE 1=1
    `;
    const queryParams = [];

    if (selected_date && start_date && end_date) {
        sqlQuery += ` AND lc.${selected_date} BETWEEN ? AND ?`;
        queryParams.push(start_date, end_date);
    }
    if (contract_status) {
        sqlQuery += " AND lc.contract_status LIKE ?";
        queryParams.push(`%${contract_status}%`);
    }
    if (tenant_id) {
        sqlQuery += " AND te.name LIKE ?";
        queryParams.push(`%${tenant_id}%`);
    }
    if (house_id) {
        sqlQuery += " AND h.address LIKE ?";
        queryParams.push(`%${house_id}%`);
    }
    if (billing_deadline) {
        sqlQuery += " AND h.billing_deadline = ?";
        queryParams.push(billing_deadline);
    }
    if (lot_number) {
        sqlQuery += " AND h.lot_number LIKE ?";
        queryParams.push(`%${lot_number}%`);
    } 
    
    db.query(sqlQuery, queryParams, (err, results) => {
        if (err) {
            console.error("Error searching lease contract data:", err);
            res.status(500).send("Error retrieving data from the database");
        } else {
            res.json(results);
        }
    });
};

// 전체 계약 조회
exports.getLeaseContracts = (req, res) => {
    const query = `
    SELECT 
        lc.contract_number, lc.contract_status, h.address AS house_address, h.billing_deadline AS billing_deadline,
        DATE_FORMAT(lc.contract_date, '%Y-%m-%d') AS contract_date,
        DATE_FORMAT(lc.lease_period_start, '%Y-%m-%d') AS lease_period_start, 
        DATE_FORMAT(lc.lease_period_end, '%Y-%m-%d') AS lease_period_end, 
        te.name AS tenant_name, te.mobile AS tenant_mobile,
        FORMAT(lc.deposit, 0) AS deposit, FORMAT(lc.monthly_rent, 0) AS monthly_rent,
        FORMAT(lc.shared_cost, 0) AS shared_cost, FORMAT(lc.down_payment, 0) AS down_payment, 
        FORMAT(lc.interim_payment, 0) AS interim_payment, FORMAT(lc.prepaid_rent, 0) AS prepaid_rent, 
        lc.deposit as fromOther, lc.deposit as fromOther1, h.address AS fromOther2
    FROM LeaseContract lc
    JOIN Tenant te ON lc.tenant_id = te.tenant_id
    JOIN HouseInfo h ON lc.house_id = h.house_id;
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching LeaseContract data:", err);
            res.status(500).send("Error fetching data.");
        } else {
            res.json(results);
        }
    });
};
