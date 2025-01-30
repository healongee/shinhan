import "./HouseInfo.css"; // CSS 파일을 불러옵니다.
import { Component } from "react";
import Axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import React from "react";

const House = ({ usage_status, management_status, billing_deadline, vat, lessor_name, town, lot_number, unit_number, building_name, postal_code, address,
    land_area_m2, land_area_py, land_purpose, building_area_m2, building_area_py, building_structure,
    building_purpose, remarks, water_meter_date, water_payment_type, water_billing_month,
    electricity_meter_date, electricity_payment_type, gas_meter_date, gas_payment_type, other_fee, cable_fee, sticker_fee }) => {
    return (
        <tr>
            <td>{usage_status}</td>
            <td>{management_status}</td>
            <td>{billing_deadline}</td>
            <td>{vat}</td>
            <td>{lessor_name}</td>
            <td>{town}</td>
            <td>{lot_number}</td>
            <td>{unit_number}</td>
            <td>{building_name}</td>
            <td>{postal_code}</td>
            <td>{address}</td>
            <td>{land_area_m2}</td>
            <td>{land_area_py}</td>
            <td>{land_purpose}</td>
            <td>{building_area_m2}</td>
            <td>{building_area_py}</td>
            <td>{building_structure}</td>
            <td>{building_purpose}</td>
            <td>{remarks}</td>
            <td>{water_meter_date}</td>
            <td>{water_payment_type}</td>
            <td>{water_billing_month}</td>
            <td>{electricity_meter_date}</td>
            <td>{electricity_payment_type}</td>
            <td>{gas_meter_date}</td>
            <td>{gas_payment_type}</td>
            <td>{other_fee}</td>
            <td>{cable_fee}</td>
            <td>{sticker_fee}</td>
        </tr>
    );
};

class HouseInfo extends Component {
    state = {
        houseList: [],
        building_name: '',
        address: '',
        lot_number: '',
        lessor_id: '',
        management_status: '',
        billing_deadline: ''
    };

    getList = () => {
        Axios.get("http://localhost:3001/HouseInfo")
            .then((response) => {
                console.log("서버 응답 데이터:", response.data); // 서버에서 반환된 데이터를 확인
                this.setState({ houseList: response.data });
            })
            .catch((error) => {
                console.error("Error fetching house list:", error);
            });
    };

    searchHouse = () => {
        const { building_name, address, lot_number, lessor_id, management_status, billing_deadline } = this.state;
        Axios.post("http://localhost:3001/searchHouse", { building_name, address, lot_number, lessor_id, management_status, billing_deadline })
            .then((response) => {
                this.setState({ houseList: response.data });
            })
            .catch((error) => {
                console.error("Error searching house:", error);
            });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    componentDidMount() {
        this.getList();
    }

    render() {
        const { houseList, building_name, address, lot_number, lessor_id, management_status, billing_deadline } = this.state;

        return (
            <div>
                <div className="button-group">
                    <Button variant="info" onClick={this.searchHouse}>검색</Button>
                    <Button variant="secondary" onClick={this.getList}>초기화</Button>
                </div>

                <Form>
                    <div className="form-row">

                    <Form.Group className="mb-3 col" controlId="formManagementStatus">
                        <Form.Label>관리 상태</Form.Label>
                        <Form.Select
                            name="management_status"
                            value={management_status}
                            onChange={this.handleInputChange}
                        >
                            <option value="">전체</option> {/* 모든 상태 검색 */}
                            <option value="관리">관리</option>
                            <option value="비관리">비관리</option>
                        </Form.Select>
                    </Form.Group>

                        <Form.Group className="mb-3 col" controlId="formBuildingName">
                            <Form.Label>건물 이름</Form.Label>
                            <Form.Control
                                type="text"
                                name="building_name"
                                value={building_name}
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 col" controlId="formAddress">
                            <Form.Label>주소</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={address}
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 col" controlId="formLotNumber">
                            <Form.Label>번지</Form.Label>
                            <Form.Control
                                type="text"
                                name="lot_number"
                                value={lot_number}
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 col" controlId="formLessor">
                            <Form.Label>임대인</Form.Label>
                            <Form.Control
                                type="text"
                                name="lessor_id"
                                value={lessor_id}
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                    {/* </div>
                    <div className="form-row"> */}

                        <Form.Group className="mb-3 col">
                            <Form.Label>청구 마감일자</Form.Label>
                            <Form.Control
                                as="select"
                                name="billing_deadline"
                                value={billing_deadline}
                                onChange={this.handleInputChange}
                            >
                                <option value="">선택</option>
                                <option value="10일">10일</option>
                                <option value="20일">20일</option>
                                <option value="30일">30일</option>
                            </Form.Control>
                        </Form.Group>
                    </div>
                </Form>

                <div className="table-container">
                    <Table striped bordered hover>
                    <thead>
                            <tr>
                                <th>사용여부</th>
                                <th>관리여부</th>
                                <th>청구마감일자</th>
                                <th>부가세</th>
                                <th>임대인</th>
                                <th>읍면동</th>
                                <th>번지</th>
                                <th>호</th>
                                <th>건물이름</th>
                                <th>우편번호</th>
                                <th>주소</th>
                                <th>토지면적 m2</th>
                                <th>토지면적 평</th>
                                <th>토지지목</th>
                                <th>건물면적 m2</th>
                                <th>건물면적 평</th>
                                <th>건물구조</th>
                                <th>건물용도</th>
                                <th>비고</th>
                                <th>수도검침일</th>
                                <th>수도요금 납부구분</th>
                                <th>수도요금 청구월</th>
                                <th>전기검침일</th>
                                <th>전기요금 납부 구분</th>
                                <th>가스검침일</th>
                                <th>가스요금 납부구분</th>
                                <th>기타요금</th>
                                <th>인/케요금</th>
                                <th>스티커요금</th>
                            </tr>
                        </thead>
                        <tbody>
                            {houseList.length > 0 ? (
                                houseList.map((v, index) => (
                                    <House
                                        key={index}
                                        {...v}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="29">데이터가 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}

export default HouseInfo;
