const db = require('../lib/db');

exports.searchLessor = async (req, res) => {
    const { name, ssn, mobile } = req.body; // 클라이언트에서 보낸 데이터 추출

    // 기본 SQL 쿼리
    let sqlQuery = "SELECT * FROM lessor WHERE 1=1";
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

exports.getLessorList = async (req, res) => {
    const sqlQuery = `SELECT * FROM lessor`;
    
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error fetching lessor data:", err);
            res.status(500).send("Error retrieving data from the database");
        } else {
            res.json(results); // 데이터를 JSON 형식으로 반환
        }
    });
};

exports.addLessor = async (req, res) => {
    const {
        name,
        usage_status = "사용", // 기본값 "사용"
        is_business_owner = "N", // 기본값 "N"
        relationship,
        related_lessor,
        ssn,
        address,
        mobile,
        email,
        remarks,
        registered_by = "admin", // 기본값 "admin" (수정 가능)
    } = req.body;

    const finalIsBusinessOwner = is_business_owner === "Y" ? "Y" : "N"; // 보안 강화: 유효값만 허용

    // 데이터 유효성 검사
    if (!name || !usage_status || !mobile) {
        return res.status(400).send("필수 필드(name, usage_status, mobile)를 입력해야 합니다.");
    }

    // SQL 쿼리 작성
    const sqlQuery = `INSERT INTO lessor (
            usage_status,name,is_business_owner,relationship,related_lessor,ssn,address,mobile,email,remarks,registered_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const queryParams = [
        usage_status,
        name,
        finalIsBusinessOwner,
        relationship || null,
        related_lessor || null,
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
            console.error("Error inserting lessor data:", err);
            res.status(500).send("임대인 데이터를 삽입 중 오류가 발생했습니다.");
        } else {
            res.status(201).send("임대인이 성공적으로 등록되었습니다.");
        }
    });
};

exports.deleteLessor = async (req, res) => {
    const { id } = req.body; // 클라이언트에서 전송된 id

    if (!id) {
        return res.status(400).json({ success: false, message: "lessor_id is required" });
    }

    try {
        const [result] = await db.promise().query("DELETE FROM lessor WHERE lessor_id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "해당 임대인이 없습니다." });
        }

        res.status(200).json({ success: true, message: "삭제되었습니다." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "삭제 실패" });
    }
};

exports.searchLessorByName = (req, res) => { //houseinfoDetail에서 사용하는것임
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ success: false, message: "이름을 입력하세요." });
    }

    const query = "SELECT * FROM lessor WHERE name LIKE ?";
    db.query(query, [`%${name}%`], (error, results) => {
        if (error) {
            console.error("Lessor search error:", error);
            return res.status(500).json({ success: false, message: "서버 오류 발생." });
        }

        res.status(200).json({ success: true, lessors: results });
    });
};