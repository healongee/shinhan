const express = require('express')
const session = require('express-session')
const path = require('path');
const app = express()
const port = 3001

const db = require('./lib/db');
const sessionOption = require('./lib/sessionOption');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const { start } = require('repl');

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(sessionOption);
app.use(session({  
	key: 'session_cookie_name',
    secret: '~',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}))

app.get('/', (req, res) => {    
    req.sendFile(path.join(__dirname, '/build/index.html'));
})

app.get('/authcheck', (req, res) => {      
    const sendData = { isLogin: "" };
    if (req.session.is_logined) {
        sendData.isLogin = "True"
    } else {
        sendData.isLogin = "False"
    }
    res.send(sendData);
})

app.post("/login", (req, res) => { // 데이터 받아서 결과 전송
    const username = req.body.userId;
    const password = req.body.userPassword;
    const sendData = { isLogin: "" };

    if (username && password) {             // id와 pw가 입력되었는지 확인
        db.query('SELECT * FROM userTable WHERE username = ?', [username], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {       // db에서의 반환값이 있다 = 일치하는 아이디가 있다.      

                bcrypt.compare(password , results[0].password, (err, result) => {    // 입력된 비밀번호가 해시된 저장값과 같은 값인지 비교

                    if (result === true) {                  // 비밀번호가 일치하면
                        req.session.is_logined = true;      // 세션 정보 갱신
                        req.session.nickname = username;
                        req.session.save(function () {
                            sendData.isLogin = "True"
                            res.send(sendData);
                        });
                        db.query(`INSERT INTO logTable (created, username, action, command, actiondetail) VALUES (NOW(), ?, 'login' , ?, ?)`
                            , [req.session.nickname, '-', `React 로그인 테스트`], function (error, result) { });
                    }
                    else{                                   // 비밀번호가 다른 경우
                        sendData.isLogin = "로그인 정보가 일치하지 않습니다."
                        res.send(sendData);
                    }
                })                      
            } else {    // db에 해당 아이디가 없는 경우
                sendData.isLogin = "아이디 정보가 일치하지 않습니다."
                res.send(sendData);
            }
        });
    } else {            // 아이디, 비밀번호 중 입력되지 않은 값이 있는 경우
        sendData.isLogin = "아이디와 비밀번호를 입력하세요!"
        res.send(sendData);
    }
});

app.post("/signin", (req, res) => {  // 데이터 받아서 결과 전송
    const username = req.body.userId;
    const password = req.body.userPassword;
    const password2 = req.body.userPassword2;
    
    const sendData = { isSuccess: "" };

    if (username && password && password2) {
        db.query('SELECT * FROM userTable WHERE username = ?', [username], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
            if (error) throw error;
            if (results.length <= 0 && password == password2) {         // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우
                const hasedPassword = bcrypt.hashSync(password, 10);    // 입력된 비밀번호를 해시한 값
                db.query('INSERT INTO userTable (username, password) VALUES(?,?)', [username, hasedPassword], function (error, data) {
                    if (error) throw error;
                    req.session.save(function () {                        
                        sendData.isSuccess = "True"
                        res.send(sendData);
                    });
                });
            } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우                  
                sendData.isSuccess = "입력된 비밀번호가 서로 다릅니다."
                res.send(sendData);
            }
            else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우            
                sendData.isSuccess = "이미 존재하는 아이디 입니다!"
                res.send(sendData);  
            }            
        });        
    } else {
        sendData.isSuccess = "아이디와 비밀번호를 입력하세요!"
        res.send(sendData);  
    }
    
});

app.post("/searchLessor", (req, res) => {
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
});

app.get("/Lessorlist", (req, res) => {
    const sqlQuery = `SELECT * FROM lessor`;
    
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error fetching lessor data:", err);
            res.status(500).send("Error retrieving data from the database");
        } else {
            res.json(results); // 데이터를 JSON 형식으로 반환
        }
    });
});

app.post("/addLessor", (req, res) => {
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
});

app.delete("/deleteLessor", async (req, res) => {
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
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.post("/searchTenent", (req, res) => {
    const { name, ssn, mobile } = req.body; // 클라이언트에서 보낸 데이터 추출

    // 기본 SQL 쿼리
    let sqlQuery = "SELECT * FROM tenent WHERE 1=1";
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
});

app.get("/Tenentlist", (req, res) => {
    const sqlQuery = `SELECT * FROM tenent`;
    
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error fetching tenent data:", err);
            res.status(500).send("Error retrieving data from the database");
        } else {
            res.json(results); // 데이터를 JSON 형식으로 반환
        }
    });
});
app.post("/addTenent", (req, res) => {
    const {
        name,
        usage_status = "사용", // 기본값 "사용"
        relationship,
        related_tenent,
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
        INSERT INTO tenent (
            usage_status,name,relationship,related_tenent,ssn,address,mobile,email,remarks,registered_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const queryParams = [
        usage_status,
        name,
        relationship || null,
        related_tenent || null,
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
            console.error("Error inserting tenent data:", err);
            res.status(500).send("임차인 데이터를 삽입 중 오류가 발생했습니다.");
        } else {
            res.status(201).send("임차인이 성공적으로 등록되었습니다.");
        }
    });
});

app.delete("/deleteTenent", async (req, res) => {
    const { id } = req.body; // 클라이언트에서 전송된 id

    if (!id) {
        return res.status(400).json({ success: false, message: "tenent_id is required" });
    }

    try {
        const [result] = await db.promise().query("DELETE FROM tenent WHERE tenent_id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "해당 임차인이 없습니다." });
        }

        res.status(200).json({ success: true, message: "삭제되었습니다." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "삭제 실패" });
    }
});


app.post("/searchHouse", (req, res) => {
    const { building_name, address, lot_number, lessor_id, management_status, billing_deadline } = req.body;

    // 기본 SQL 쿼리
    let sqlQuery = `
        SELECT houseinfo.*, lessor.name AS lessor_name
        FROM houseinfo
        LEFT JOIN lessor ON houseinfo.lessor_id = lessor.lessor_id
        WHERE 1=1
    `;
    const queryParams = [];

    // 조건에 따라 쿼리와 파라미터 동적 생성
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

    // 데이터베이스 쿼리 실행
    db.query(sqlQuery, queryParams, (err, results) => {
        if (err) {
            console.error("Error searching house data:", err);
            res.status(500).send("Error retrieving data from the database");
        } else {
            res.json(results); // 검색 결과 반환
        }
    });
});

app.get("/HouseInfo", (req, res) => {
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
            res.json(results); // 조인된 데이터를 JSON 형식으로 반환
        }
    });
});

app.post("/searchLeaseContract", (req, res) => {
    const {selected_date, start_date, end_date, house_id, lot_number, tenent_id, contract_status, billing_deadline} = req.body;

    let sqlQuery = `
      SELECT 
        lc.contract_number, lc.contract_status,h.address AS house_address,h.billing_deadline AS billing_deadline,
        DATE_FORMAT(lc.contract_date, '%Y-%m-%d') AS contract_date,
        DATE_FORMAT(lc.lease_period_start, '%Y-%m-%d') AS lease_period_start, 
        DATE_FORMAT(lc.lease_period_end, '%Y-%m-%d') AS lease_period_end, 
        te.name AS tenent_name,te.mobile AS tenent_mobile,
        FORMAT(lc.deposit, 0) AS deposit,FORMAT(lc.monthly_rent, 0) AS monthly_rent,
        FORMAT(lc.shared_cost, 0) AS shared_cost,FORMAT(lc.down_payment, 0) AS down_payment, 
        FORMAT(lc.interim_payment, 0) AS interim_payment,FORMAT(lc.prepaid_rent, 0) AS prepaid_rent, 
        lc.deposit as fromOther, lc.deposit as fromOther1, lc.contract_form AS fromOther2
    FROM LeaseContract lc
    JOIN Tenent te ON lc.tenent_id = te.tenent_id
    JOIN HouseInfo h ON lc.house_id = h.house_id
      WHERE 1=1
    `;
    const queryParams = [];

    // 동적 조건 추가
    if (selected_date && start_date && end_date) {
        // 선택된 날짜 필드 기준으로 시작일자와 종료일자 조건 추가
        sqlQuery += ` AND lc.${selected_date} BETWEEN ? AND ?`;
        console.log(start_date);
        console.log(end_date);
        queryParams.push(start_date, end_date);
    }
    if (contract_status) {
        sqlQuery += " AND lc.contract_status LIKE ?";
        queryParams.push(`%${contract_status}%`); // 부분 검색
    }
    if (tenent_id) {
        sqlQuery += " AND te.name LIKE ?";
        queryParams.push(`%${tenent_id}%`); // 부분 검색
    }
    if (house_id) {
        sqlQuery += " AND h.address LIKE ?";
        queryParams.push(`%${house_id}%`); // 부분 검색
    }
    if (billing_deadline) {
        sqlQuery += " AND h.billing_deadline = ?";
        queryParams.push(billing_deadline);
    }
    if (lot_number) {
        sqlQuery += " AND h.lot_number LIKE ?";
        queryParams.push(`%${lot_number}%`); // 부분 검색
    } 
    // 데이터베이스 쿼리 실행
    db.query(sqlQuery, queryParams, (err, results) => {
        if (err) {
            console.error("Error searching lease contract data:", err);
            res.status(500).send("Error retrieving data from the database");
        } else {
            res.json(results); // 검색 결과 반환
        }
    });
});

app.get("/LeaseContract", (req, res) => {
    const query = `
    SELECT 
        lc.contract_number, lc.contract_status,h.address AS house_address,h.billing_deadline AS billing_deadline,
        DATE_FORMAT(lc.contract_date, '%Y-%m-%d') AS contract_date,
        DATE_FORMAT(lc.lease_period_start, '%Y-%m-%d') AS lease_period_start, 
        DATE_FORMAT(lc.lease_period_end, '%Y-%m-%d') AS lease_period_end, 
        te.name AS tenent_name,te.mobile AS tenent_mobile,
        FORMAT(lc.deposit, 0) AS deposit,FORMAT(lc.monthly_rent, 0) AS monthly_rent,
        FORMAT(lc.shared_cost, 0) AS shared_cost,FORMAT(lc.down_payment, 0) AS down_payment, 
        FORMAT(lc.interim_payment, 0) AS interim_payment,FORMAT(lc.prepaid_rent, 0) AS prepaid_rent, 
        lc.deposit as fromOther, lc.deposit as fromOther1, h.address AS fromOther2
    FROM LeaseContract lc
    JOIN Tenent te ON lc.tenent_id = te.tenent_id
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
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ success: false, message: 'Failed to log out.' });
        }
        res.clearCookie('session_cookie_name'); // 세션 쿠키 제거
        res.status(200).json({ success: true });
    });
});

