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

    searchLeaseContract = () => {
        const { contract_date, lease_period_start, lease_period_end, effective_date, contract_status, house_id, lessor_id, tenent_id } = this.state;
        Axios.post("http://localhost:3001/searchHouse", { contract_date, lease_period_start, lease_period_end, contract_status, house_id, lessor_id, tenent_id })
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
        const { contractList, contract_date, contract_status, billing_deadline, lot_number, address, unit_number, lessor_id, tenent_id, town } = this.state;

        return (
            <div>
                <div className="button-group">
                    <Button variant="info" onClick={this.searchLeaseContract}>검색</Button>
                    <Button variant="secondary" onClick={this.getList}>초기화</Button>
                </div>

                <Form>
                    <div className="form-row">

                    <Form.Group className="mb-3 col" controlId="formDateField">
                    <Form.Label>날짜 항목</Form.Label>
                    <Form.Select
                        name="contract_date" // 선택된 날짜 항목
                        value={contract_date}
                        onChange={this.handleInputChange}
                    >
                        <option value="contract_date">계약일자</option>
                        <option value="lease_period_start">임대시작일</option>
                        <option value="lease_period_end">임대종료일</option>
                        <option value="effective_date">적용일자</option>
                    </Form.Select>
                </Form.Group>
                    <Form.Group className="mb-3 col" controlId="formStartDate">
                        <Form.Label>시작일자</Form.Label>
                        <Form.Control
                            type="date"
                            name="start_date" // 시작일자를 저장할 키
                            value={this.state.start_date} // 상태에서 가져온 값
                            onChange={this.handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 col" controlId="formEndDate">
                        <Form.Label>종료일자</Form.Label>
                        <Form.Control
                            type="date"
                            name="end_date" // 종료일자를 저장할 키
                            value={this.state.end_date} // 상태에서 가져온 값
                            onChange={this.handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 col" controlId="formManagementStatus">
                        <Form.Label>동</Form.Label>
                        <Form.Select
                            name="contract_status"
                            value={contract_status}
                            onChange={this.handleInputChange}
                        >
                            <option value="">전체</option> {/* 모든 상태 검색 */}
                            <option value="논현동">논현동</option>
                            <option value="도곡동">도곡동</option>
                            <option value="반포동">반포동</option>
                            <option value="역삼동">역삼동</option>
                            <option value="잠원동">잠원동</option>
                            <option value="서초동">서초동</option>
                        </Form.Select>
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
                        <Form.Group className="mb-3 col" controlId="formLessor">
                            <Form.Label>임차인</Form.Label>
                            <Form.Control
                                type="text"
                                name="tenent_id"
                                value={tenent_id}
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                    {/* </div>
                    <div className="form-row"> */}

                        <Form.Group className="mb-3 col">
                            <Form.Label>청구 마감일자</Form.Label>
                            <Form.Select
                                as="select"
                                name="billing_deadline"
                                value={billing_deadline}
                                onChange={this.handleInputChange}
                            >
                                <option value="">전체</option>
                                <option value="10일">10일</option>
                                <option value="20일">20일</option>
                                <option value="30일">30일</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                </Form>

                <div className="table-container">
                    <Table striped bordered hover>
                    <thead>
                            <tr>
                                <th>계약서 번호</th>
                                <th>계약상태</th>
                                <th>주소</th>
                                <th>마감기준일</th>
                                <th>계약일자</th>
                                <th>계약기간</th>
                                <th>임차인</th>
                                <th>전화번호</th>
                                <th>보증금</th>
                                <th>임대료</th>
                                <th>공용비</th>
                                <th>계약금</th>
                                <th>중도금</th>
                                <th>잔금</th>
                                <th>선불임대료</th>
                                <th>보증금</th>
                                <th>보증금미납</th>
                                <th>주소</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contractList.length > 0 ? (
                                contractList.map((v, index) => (
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
