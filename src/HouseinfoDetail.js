// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Axios from "axios";
// import Table from "react-bootstrap/Table";
// import Button from "react-bootstrap/Button";
// import "./HouseinfoDetail.css"; // CSS 파일 추가

// const HouseinfoDetail = () => {
//     const { house_id } = useParams();
//     const navigate = useNavigate();
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
//         if (house_id !== "new") { // house_id가 "new"가 아닐 때만 데이터 불러옴
//             Axios.get(`http://localhost:3001/house/${house_id}`)
//                 .then((response) => {
//                     setHouse(response.data);
//                     setFormData(response.data);
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching house details:", error);
//                 });
//         } else {
//             setFormData({}); // 빈 데이터로 설정
//         }
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

//     const filteredEntries = Object.entries(formData).filter(([key]) => !hiddenColumns.includes(key));

//     const handleRegister = () => {
//         Axios.post("http://localhost:3001/house", formData)
//             .then((response) => {
//                 alert("등록이 완료되었습니다!");
//                 navigate(-1); // 등록 후 이전 페이지로 이동
//             })
//             .catch((error) => {
//                 console.error("Error registering house:", error);
//                 alert("등록에 실패했습니다.");
//             });
//     };
    
//     const handleDelete = () => {
//         if (window.confirm("정말로 삭제하시겠습니까?")) {
//             Axios.delete(`http://localhost:3001/house/${house_id}`)
//                 .then(() => {
//                     alert("삭제가 완료되었습니다.");
//                     navigate(-1); // 목록으로 이동
//                 })
//                 .catch((error) => {
//                     console.error("Error deleting house:", error);
//                     alert("삭제에 실패했습니다.");
//                 });
//         }
//     };

//     return (
//         <div className="house-detail-container">
//             <h2>주택 상세 정보</h2>
//             <Table striped bordered hover className="small-table">
//                 <tbody>
//                     {filteredEntries.reduce((rows, [key, value], index) => {
//                         if (index % 2 === 0) rows.push([]);
//                         rows[rows.length - 1].push(
//                             <th key={`${key}-th`}>{columnMapping[key] || key}</th>,
//                             <td key={`${key}-td`}>
//                                 <input 
//                                     type="text" 
//                                     className="table-input"
//                                     value={value || ""}
//                                     onChange={(e) => handleChange(e, key)}
//                                 />
//                             </td>
//                         );
//                         return rows;
//                     }, []).map((row, index) => (
//                         <tr key={index}>{row}</tr>
//                     ))}
//                 </tbody>
//             </Table>
//             <div className="button-group">
//                 <Button className="back-button" onClick={() => navigate(-1)}>
//                     목록
//                 </Button>
//                 <Button className="register-button" variant="success" onClick={handleRegister}>
//                     수정
//                 </Button>
//                 <Button className="delete-button" variant="danger" onClick={handleDelete}>
//                     삭제
//                 </Button>
//             </div>
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

    // 카카오 주소 검색 API 호출
    const openAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: (data) => {
                // 검색된 주소 정보 가져오기
                setFormData({
                    ...formData,
                    address: data.roadAddress, // 도로명 주소
                    postal_code: data.zonecode, // 우편번호
                });
            }
        }).open();
    };

    useEffect(() => {
        // 카카오 주소 API 스크립트 추가
        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    if (!house) {
        return <div>로딩 중...</div>;
    }

    const filteredEntries = Object.entries(formData).filter(([key]) => !hiddenColumns.includes(key));

    const handleRegister = () => {
        Axios.post("http://localhost:3001/house", formData)
            .then(() => {
                alert("등록이 완료되었습니다!");
                navigate(-1); // 등록 후 이전 페이지로 이동
            })
            .catch((error) => {
                console.error("Error registering house:", error);
                alert("등록에 실패했습니다.");
            });
    };
    
    const handleDelete = () => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            Axios.delete(`http://localhost:3001/house/${house_id}`)
                .then(() => {
                    alert("삭제가 완료되었습니다.");
                    navigate(-1); // 목록으로 이동
                })
                .catch((error) => {
                    console.error("Error deleting house:", error);
                    alert("삭제에 실패했습니다.");
                });
        }
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
                                {key === "address" ? (
                                    <input 
                                        type="text" 
                                        className="table-input"
                                        value={value || ""}
                                        readOnly
                                        onClick={openAddressSearch}
                                        style={{ cursor: "pointer", backgroundColor: "#f0f0f0" }}
                                    />
                                ) : (
                                    <input 
                                        type="text" 
                                        className="table-input"
                                        value={value || ""}
                                        onChange={(e) => handleChange(e, key)}
                                    />
                                )}
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
                    수정
                </Button>
                <Button className="delete-button" variant="danger" onClick={handleDelete}>
                    삭제
                </Button>
            </div>
        </div>
    );
};

export default HouseinfoDetail;
