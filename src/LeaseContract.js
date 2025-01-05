import "./LeaseContract.css"; // CSS 파일을 불러옵니다.
import { Component } from "react";
import Axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Contract = ({ contract_number, contract_status, address, billing_deadline, contract_date, 
    lease_period_start, lease_period_end, lot_number, unit_number, building_name, postal_code,
    Lessor, Lessor_Mobile, deposit, monthly_rent, shared_cost, down_payment, interim_payment_amount, final_payment, prepaid_rent, interim_payment_date, deposit_arrears, 
    special_terms, remarks, move_in_date, move_out_date, confirmation_delivery_date, main_agency_name, main_agency_license, 
    main_agency_representative, main_agency_phone, main_agency_member, main_agency_address}) => {
    return (
        <tr>
            <td>{contract_number}</td>
            <td>{contract_status}</td>
            <td>{address}</td>
            <td>{billing_deadline}</td>
            <td>{contract_date}</td>
            <td>{lease_period_start}</td>
            <td>{lease_period_end}</td>
            <td>{lot_number}</td>
            <td>{unit_number}</td>
            <td>{building_name}</td>
            <td>{postal_code}</td>
            <td>{Lessor}</td>
            <td>{Lessor_Mobile}</td>
            <td>{deposit}</td>
            <td>{monthly_rent}</td>
            <td>{shared_cost}</td>
            <td>{down_payment}</td>
            <td>{interim_payment_amount}</td>
            <td>{final_payment}</td>
            <td>{prepaid_rent}</td>
            <td>{interim_payment_date}</td>
            <td>{deposit_arrears}</td>
            <td>{special_terms}</td>
            <td>{remarks}</td> 
            <td>{move_in_date}</td> 
            <td>{move_out_date}</td>
            <td>{confirmation_delivery_date}</td>
            <td>{main_agency_name}</td>
            <td>{main_agency_license}</td>
            <td>{main_agency_representative}</td>
            <td>{main_agency_phone}</td>
            <td>{main_agency_member}</td>
            <td>{main_agency_address}</td>
        </tr>
    );
};

class LeaseContract extends Component {
    state = {
        contractList: [],
        contract_date: '',
        contract_status: '',
        billing_deadline: '',
        lot_number: '',
        address: '',
        unit_number: '',
        lessor_id: '',
        tenent_id: '',
    };

    getList = () => {
        Axios.get("http://localhost:3001/LeaseContract")
            .then((response) => {
                this.setState({ contractList: response.data });
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
                                    <Contract
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

export default LeaseContract;
