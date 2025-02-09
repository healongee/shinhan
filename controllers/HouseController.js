const db = require('../lib/db');

// 주택 검색
exports.searchHouse = (req, res) => {
    const { building_name, address, lot_number, lessor_id, management_status, billing_deadline } = req.body;

    let sqlQuery = `
        SELECT houseinfo.*, lessor.name AS lessor_name
        FROM houseinfo
        LEFT JOIN lessor ON houseinfo.lessor_id = lessor.lessor_id
        WHERE 1=1
    `;
    const queryParams = [];

    if (building_name) {
        sqlQuery += " AND houseinfo.building_name LIKE ?";
        queryParams.push(`%${building_name}%`);
    }
    if (address) {
        sqlQuery += " AND houseinfo.address LIKE ?";
        queryParams.push(`%${address}%`);
    }
    if (lot_number) {
        sqlQuery += " AND houseinfo.lot_number LIKE ?";
        queryParams.push(`%${lot_number}%`);
    }
    if (lessor_id) {
        sqlQuery += " AND lessor.name LIKE ?";
        queryParams.push(`%${lessor_id}%`);
    }
    if (management_status) {
        sqlQuery += " AND houseinfo.management_status = ?";
        queryParams.push(management_status);
    }
    if (billing_deadline) {
        sqlQuery += " AND houseinfo.billing_deadline = ?";
        queryParams.push(billing_deadline);
    }

    db.query(sqlQuery, queryParams, (err, results) => {
        if (err) {
            console.error("Error searching house data:", err);
            res.status(500).send("Error retrieving data from the database");
        } else {
            res.json(results);
        }
    });
};

// 전체 주택 정보 조회
exports.getHouseInfo = (req, res) => {
    const sqlQuery = `
        SELECT hi.*, l.name AS lessor_name
        FROM houseinfo hi
        LEFT JOIN lessor l 
        ON hi.lessor_id = l.lessor_id;
    `;
    
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error fetching house data:", err);
            res.status(500).send("Error retrieving data from the database");
        } else {
            res.json(results);
        }
    });
};

// 특정 주택 정보 조회
exports.getHouseById = (req, res) => {
    const houseId = req.params.houseId;
    
    db.query("SELECT hi.*, l.name AS lessor_name FROM houseinfo hi LEFT JOIN lessor l ON hi.lessor_id = l.lessor_id WHERE house_id=?", [houseId], (err, results) => {
        if (err) {
            console.error("Error fetching house info:", err);
            res.status(500).json({ error: "Database error" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "No house found" });
        } else {
            res.json(results[0]);
        }
    });
};

// 주택 등록
exports.addHouse = (req, res) => {
    const {
        usage_status, management_status, billing_deadline, vat,
        town, lot_number, unit_number, building_name, postal_code,
        land_area_m2, land_area_py, land_purpose, building_area_m2, building_area_py,
        building_purpose, building_structure, remarks, address,
        water_meter_date, water_payment_type, water_billing_month,
        electricity_meter_date, electricity_payment_type,
        gas_meter_date, gas_payment_type, other_fee,
        cable_fee, internet_fee, old_address, old_postal_code
    } = req.body;

    const sql = `
        INSERT INTO HouseInfo (
            usage_status, management_status, billing_deadline, vat,
            town, lot_number, unit_number, building_name, postal_code, address, 
            land_area_m2, land_area_py, land_purpose, building_area_m2, building_area_py,
            building_purpose, building_structure, remarks,
            water_meter_date, water_payment_type, water_billing_month,
            electricity_meter_date, electricity_payment_type,
            gas_meter_date, gas_payment_type, other_fee,
            cable_fee, internet_fee, old_address, old_postal_code
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        usage_status, management_status, billing_deadline, vat,
        town, lot_number, unit_number, building_name, postal_code, address,
        land_area_m2, land_area_py, land_purpose, building_area_m2, building_area_py,
        building_purpose, building_structure, remarks,
        water_meter_date, water_payment_type, water_billing_month,
        electricity_meter_date, electricity_payment_type,
        gas_meter_date, gas_payment_type, other_fee,
        cable_fee, internet_fee, old_address, old_postal_code
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting house data:", err);
            return res.status(500).json({ error: "Database insertion failed" });
        }
        res.status(201).json({ message: "House registered successfully", house_id: result.insertId });
    });
};

// 주택 삭제
exports.deleteHouse = (req, res) => {
    const houseId = req.params.house_id;
    
    const sql = "DELETE FROM houseinfo WHERE house_id = ?";
    db.query(sql, [houseId], (err, result) => {
      if (err) {
        console.error("Error deleting houseinfo: ", err);
        res.status(500).json({ error: "Failed to delete houseinfo" });
      } else {
        res.json({ message: "House info deleted successfully" });
      }
    });
};
