const db = require('../lib/db');

exports.searchTenant = async (req, res) => {
    const { name, ssn, mobile } = req.body; // 클라이언트에서 보낸 데이터 추출

    // 기본 SQL 쿼리
    let sqlQuery = "SELECT * FROM tenant WHERE 1=1";
    const queryParams = [];

    // 조건에 따라 쿼리와 파라미터 동적 생성
    if (name) {
        sqlQuery += " AND NAME LIKE ?";
        queryParams.push(`%${name}%`); // 부분 검색 가능하도록 설정
    }
    if (ssn) {
        sqlQuery += " AND SSN LIKE ?";
        queryParams.push(`%${ssn}%`); // 부분 검색 가능하도록 설정
    }
    if (mobile) {
        sqlQuery += " AND MOBILE LIKE ?";
        queryParams.push(`%${mobile}%`); // 부분 검색 가능하도록 설정
    }

    // 데이터베이스 쿼리 실행
    db.query(sqlQuery, queryParams, (err, results) => {
        if (err) {
            console.error("Error searching lessor data:", err);
            res.status(500).send("Error retrieving data from the database");
        } else {
            res.json(results); // 검색 결과 반환
        }
    });
};

exports.getTenantList = async (req, res) => {
    const sqlQuery = `SELECT * FROM tenant`;
    
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error fetching tenant data:", err);
            res.status(500).send("Error retrieving data from the database");
        } else {
            res.json(results); // 데이터를 JSON 형식으로 반환
        }
    });
};

exports.addTenant = async (req, res) => {
    const {
        name,
        usage_status = "사용", // 기본값 "사용"
        relation,
        relatedTenant,
        ssn,
        address,
        mobile,
        email,
        remarks,
        registered_by = "admin", // 기본값 "admin" (수정 가능)
    } = req.body;

    // 데이터 유효성 검사
    if (!name || !usage_status || !mobile) {
        return res.status(400).send("필수 필드(name, usage_status, mobile)를 입력해야 합니다.");
    }

    // SQL 쿼리 작성
    const sqlQuery = `
        INSERT INTO tenant (
            usage_status,name,relationship,related_tenant,ssn,address,mobile,email,remarks,registered_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const queryParams = [
        usage_status,
        name,
        relation || null,
        relatedTenant || null,
        ssn || null,
        address || null,
        mobile,
        email || null,
        remarks || null,
        registered_by,
    ];

    // 데이터베이스에 삽입
    db.query(sqlQuery, queryParams, (err, result) => {
        if (err) {
            console.error("Error inserting tenant data:", err);
            res.status(500).send("임차인 데이터를 삽입 중 오류가 발생했습니다.");
        } else {
            res.status(201).send("임차인이 성공적으로 등록되었습니다.");
        }
    });
};

exports.deleteTenant = async (req, res) => {
    const { id } = req.body; // 클라이언트에서 전송된 id

    if (!id) {
        return res.status(400).json({ success: false, message: "tenant_id is required" });
    }

    try {
        const [result] = await db.promise().query("DELETE FROM tenant WHERE tenant_id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "해당 임차인이 없습니다." });
        }

        res.status(200).json({ success: true, message: "삭제되었습니다." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "삭제 실패" });
    }
};
