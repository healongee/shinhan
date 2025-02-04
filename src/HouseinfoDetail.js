// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Axios from "axios";
// import Button from "react-bootstrap/Button";
// import "./HouseinfoDetail.css"; // 스타일을 위한 CSS 파일 추가

// const HouseinfoDetail = () => {
//     const { house_id } = useParams();
//     const navigate = useNavigate(); // 페이지 이동을 위한 훅
//     const [house, setHouse] = useState(null);
//     const [formData, setFormData] = useState({}); // 입력값 저장

//     const columnMapping = {
//         usage_status: "사용여부",
//         management_status: "관리여부",
//         lessor_name: "임대인",
//         billing_deadline: "마감일자",
//         vat: "부가세",
//         town: "읍면동",
//         lot_number: "번지",
//         unit_number: "호",
//         building_name: "건물이름",
//         postal_code: "우편번호",
//         land_area_m2: "토지면적(m2)",
//         land_area_py: "토지면적(평)",
//         land_purpose: "지목",
//         building_area_m2: "건물면적(m2)",
//         building_area_py: "건물면적(평)",
//         building_purpose: "건물용도",
//         building_structure: "건물구조",
//         remarks: "비고",
//         address: "주소",
//         water_meter_date: "수도검침일",
//         water_payment_type: "수도요금 납부구분",
//         water_billing_month: "수도요금 청구월",
//         electricity_meter_date: "전기검침일",
//         electricity_payment_type: "전기요금 납부구분",
//         gas_meter_date: "가스검침일",
//         gas_payment_type: "가스요금 납부구분",
//         other_fee: "기타요금",
//         cable_fee: "케이블요금",
//         internet_fee: "인터넷요금",
//         old_address: "(구)주소",
//         old_postal_code: "(구)우편번호",
//     };

//     const hiddenColumns = ["house_id", "registration_date", "registered_by", "modification_date", "modified_by", "lessor_id"];

//     useEffect(() => {
//         Axios.get(`http://localhost:3001/house/${house_id}`)
//             .then((response) => {
//                 setHouse(response.data);
//                 setFormData(response.data); // 가져온 데이터를 formData로 저장
//             })
//             .catch((error) => {
//                 console.error("Error fetching house details:", error);
//             });
//     }, [house_id]);

//     // 입력값 변경 핸들러
//     const handleChange = (e, key) => {
//         setFormData({
//             ...formData,
//             [key]: e.target.value
//         });
//     };

//     if (!house) {
//         return <div>로딩 중...</div>;
//     }

//     return (
//         <div className="house-detail-container">
//             <h2>주택 상세 정보</h2>
//             <div className="house-info-grid">
//                 {Object.entries(house)
//                     .filter(([key]) => !hiddenColumns.includes(key))
//                     .map(([key, value]) => (
//                         <div className="info-card" key={key}>
//                             <label className="info-label">{columnMapping[key] || key}</label>
//                             <input 
//                                 type="text" 
//                                 className="info-input"
//                                 value={formData[key] || ""}
//                                 onChange={(e) => handleChange(e, key)}
//                             />
//                         </div>                        
//                     ))}
//             </div>
//             <div className="button-group">
//                 <Button className="back-button" onClick={() => navigate(-1)}>
//                     목록
//                 </Button>
//                 <Button className="register-button" variant="success">
//                     등록
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default HouseinfoDetail;

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Axios from "axios";
// import Table from "react-bootstrap/Table";
// import Button from "react-bootstrap/Button";
// import "./HouseinfoDetail.css"; // CSS 파일 추가

// const HouseinfoDetail = () => {
//     const { house_id } = useParams();
//     const [house, setHouse] = useState(null);

//     const columnMapping = {
//         usage_status: "사용여부",
//         management_status: "관리여부",
//         lessor_name: "임대인",
//         billing_deadline: "마감일자",
//         vat: "부가세",
//         town: "읍면동",
//         lot_number: "번지",
//         unit_number: "호",
//         building_name: "건물이름",
//         postal_code: "우편번호",
//         land_area_m2: "토지면적(m2)",
//         land_area_py: "토지면적(평)",
//         land_purpose: "지목",
//         building_area_m2: "건물면적(m2)",
//         building_area_py: "건물면적(평)",
//         building_purpose: "건물용도",
//         building_structure: "건물구조",
//         remarks: "비고",
//         address: "주소",
//         water_meter_date: "수도검침일",
//         water_payment_type: "수도요금 납부구분",
//         water_billing_month: "수도요금 청구월",
//         electricity_meter_date: "전기검침일",
//         electricity_payment_type: "전기요금 납부구분",
//         gas_meter_date: "가스검침일",
//         gas_payment_type: "가스요금 납부구분",
//         other_fee: "기타요금",
//         cable_fee: "케이블요금",
//         internet_fee: "인터넷요금",
//         old_address: "(구)주소",
//         old_postal_code: "(구)우편번호",
//     };

//     const hiddenColumns = ["house_id", "registration_date", "registered_by", "modification_date", "modified_by", "lessor_id"];

//     useEffect(() => {
//         Axios.get(`http://localhost:3001/house/${house_id}`)
//             .then((response) => {
//                 setHouse(response.data);
//             })
//             .catch((error) => {
//                 console.error("Error fetching house details:", error);
//             });
//     }, [house_id]);

//     if (!house) {
//         return <div>로딩 중...</div>;
//     }

//     const filteredEntries = Object.entries(house).filter(([key]) => !hiddenColumns.includes(key));

//     return (
//         <div className="house-detail-container">
//             <h2>주택 상세 정보</h2>
//             <Table striped bordered hover className="small-table">
//                 <tbody>
//                     {filteredEntries.reduce((rows, [key, value], index) => {
//                         if (index % 2 === 0) rows.push([]); 
//                         rows[rows.length - 1].push(
//                             <th key={`${key}-th`}>{columnMapping[key] || key}</th>,
//                             <td key={`${key}-td`}>{value}</td>
//                         );
//                         return rows;
//                     }, []).map((row, index) => (
//                         <tr key={index}>{row}</tr>
//                     ))}
//                 </tbody>
//             </Table>
//             <Button onClick={() => window.history.back()}>뒤로 가기</Button>
//         </div>
//     );
// };

// export default HouseinfoDetail;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "./HouseinfoDetail.css"; // CSS 파일 추가

const HouseinfoDetail = () => {
    const { house_id } = useParams();
    const navigate = useNavigate();
    const [house, setHouse] = useState(null);
    const [formData, setFormData] = useState({}); // 입력값 저장

    const columnMapping = {
        usage_status: "사용여부",
        management_status: "관리여부",
        lessor_name: "임대인",
        billing_deadline: "마감일자",
        vat: "부가세",
        town: "읍면동",
        lot_number: "번지",
        unit_number: "호",
        building_name: "건물이름",
        postal_code: "우편번호",
        land_area_m2: "토지면적(m2)",
        land_area_py: "토지면적(평)",
        land_purpose: "지목",
        building_area_m2: "건물면적(m2)",
        building_area_py: "건물면적(평)",
        building_purpose: "건물용도",
        building_structure: "건물구조",
        remarks: "비고",
        address: "주소",
        water_meter_date: "수도검침일",
        water_payment_type: "수도요금 납부구분",
        water_billing_month: "수도요금 청구월",
        electricity_meter_date: "전기검침일",
        electricity_payment_type: "전기요금 납부구분",
        gas_meter_date: "가스검침일",
        gas_payment_type: "가스요금 납부구분",
        other_fee: "기타요금",
        cable_fee: "케이블요금",
        internet_fee: "인터넷요금",
        old_address: "(구)주소",
        old_postal_code: "(구)우편번호",
    };

    const hiddenColumns = ["house_id", "registration_date", "registered_by", "modification_date", "modified_by", "lessor_id"];

    // useEffect(() => {
    //     Axios.get(`http://localhost:3001/house/${house_id}`)
    //         .then((response) => {
    //             setHouse(response.data);
    //             setFormData(response.data); // 기존 데이터를 입력 필드 기본값으로 설정
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching house details:", error);
    //         });
    // }, [house_id]);

    useEffect(() => {
        if (house_id !== "new") { // house_id가 "new"가 아닐 때만 데이터 불러옴
            Axios.get(`http://localhost:3001/house/${house_id}`)
                .then((response) => {
                    setHouse(response.data);
                    setFormData(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching house details:", error);
                });
        } else {
            setFormData({}); // 빈 데이터로 설정
        }
    }, [house_id]);    
    
    // 입력값 변경 핸들러
    const handleChange = (e, key) => {
        setFormData({
            ...formData,
            [key]: e.target.value
        });
    };

    if (!house) {
        return <div>로딩 중...</div>;
    }

    const filteredEntries = Object.entries(formData).filter(([key]) => !hiddenColumns.includes(key));

    // return (
    //     <div className="house-detail-container">
    //         <h2>주택 상세 정보</h2>
    //         <Table striped bordered hover className="small-table">
    //             <tbody>
    //                 {filteredEntries.reduce((rows, [key, value], index) => {
    //                     if (index % 2 === 0) rows.push([]);
    //                     rows[rows.length - 1].push(
    //                         <th key={`${key}-th`}>{columnMapping[key] || key}</th>,
    //                         <td key={`${key}-td`}>
    //                             <input 
    //                                 type="text" 
    //                                 className="table-input"
    //                                 value={value || ""}
    //                                 onChange={(e) => handleChange(e, key)}
    //                             />
    //                         </td>
    //                     );
    //                     return rows;
    //                 }, []).map((row, index) => (
    //                     <tr key={index}>{row}</tr>
    //                 ))}
    //             </tbody>
    //         </Table>
    //         <div className="button-group">
    //             <Button className="back-button" onClick={() => navigate(-1)}>
    //                 목록
    //             </Button>
    //             <Button className="register-button" variant="success">
    //                 등록
    //             </Button>
    //         </div>
    //     </div>
    // );

    const handleRegister = () => {
        Axios.post("http://localhost:3001/house", formData)
            .then((response) => {
                alert("등록이 완료되었습니다!");
                navigate(-1); // 등록 후 이전 페이지로 이동
            })
            .catch((error) => {
                console.error("Error registering house:", error);
                alert("등록에 실패했습니다.");
            });
    };
    
    return (
        <div className="house-detail-container">
            <h2>주택 상세 정보</h2>
            <Table striped bordered hover className="small-table">
                <tbody>
                    {filteredEntries.reduce((rows, [key, value], index) => {
                        if (index % 2 === 0) rows.push([]);
                        rows[rows.length - 1].push(
                            <th key={`${key}-th`}>{columnMapping[key] || key}</th>,
                            <td key={`${key}-td`}>
                                <input 
                                    type="text" 
                                    className="table-input"
                                    value={value || ""}
                                    onChange={(e) => handleChange(e, key)}
                                />
                            </td>
                        );
                        return rows;
                    }, []).map((row, index) => (
                        <tr key={index}>{row}</tr>
                    ))}
                </tbody>
            </Table>
            <div className="button-group">
                <Button className="back-button" onClick={() => navigate(-1)}>
                    목록
                </Button>
                <Button className="register-button" variant="success" onClick={handleRegister}>
                    등록
                </Button>
            </div>
        </div>
    );
    

};

export default HouseinfoDetail;
