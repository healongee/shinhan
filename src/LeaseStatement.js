import "./LeaseStatement.css"; // CSS 파일을 불러옵니다.
import { Component } from "react";
import Axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Statement = ({ statement_number, statement_sequence, account_date, account_cashbook, account_item, 
    substance, deposit_amount, withdrawal_amount, receiver, confirm_date, director, remarks, category,
    address, contract_number, etc, closing_number, registration_date, registered_by, modificatoin_date,
    modificated_by}) => {
    return (
        <tr>
            <td>{statement_number}</td>
            <td>{statement_sequence}</td>
            <td>{account_date}</td>
            <td>{account_cashbook}</td>
            <td>{account_item}</td>
            <td>{substance}</td>
            <td>{deposit_amount}</td>
            <td>{withdrawal_amount}</td>
            <td>{receiver}</td>
            <td>{confirm_date}</td>
            <td>{director}</td>
            <td>{remarks}</td>
            <td>{category}</td>
            <td>{address}</td>
            <td>{contract_number}</td>
            <td>{etc}</td>
            <td>{closing_number}</td>
            <td>{registration_date}</td>
            <td>{registered_by}</td>
            <td>{modificatoin_date}</td>
            <td>{modificated_by}</td>
        </tr>
    );
};

class LeaseStatement extends Component {
    state = {
        statementList: [],
        contract_date: '',
        contract_status: '',
        billing_deadline: '',
        lot_number: '',
        address: '',
        unit_number: '',
        lessor_id: '',
        tenant_id: '',
    };

    getList = () => {
        Axios.get("http://localhost:3001/LeaseStatement")
            .then((response) => {
                console.log("서버 응답 데이터:", response.data); // 서버에서 반환된 데이터를 확인
                this.setState({ statementList: response.data });                
            })
            .catch((error) => {
                console.error("Error fetching house list:", error);
            });
    };

    searchLeaseStatement = () => {
        const { selected_date, start_date, end_date, house_id, lot_number, tenant_id, contract_status, billing_deadline } = this.state;
        Axios.post("http://localhost:3001/searchLeaseStatement", { selected_date, start_date, end_date, house_id, lot_number, tenant_id, contract_status, billing_deadline })
            .then((response) => {
                console.log("Received:", response.data);
                this.setState({ statementList: response.data });
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
        const { statementList, selected_date, house_id, lot_number, tenant_id, contract_status, billing_deadline } = this.state;

        return (
            <div>
                <div className="button-group">
                    <Button variant="info" onClick={this.searchLeaseStatement}>검색</Button>
                    <Button variant="secondary" onClick={this.getList}>초기화</Button>
                </div>

                <Form>
                    <div className="form-row">

                    <Form.Group className="mb-3 col" controlId="formDateField">
                    <Form.Label>날짜 항목</Form.Label>
                    <Form.Select
                        name="selected_date" // 선택된 날짜 항목
                        value={selected_date}
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
                            name="house_id"
                            value={house_id}
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
                            <Form.Label>임차인</Form.Label>
                            <Form.Control
                                type="text"
                                name="tenant_id"
                                value={tenant_id}
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 col" controlId="formManagementStatus">
                        <Form.Label>계약상태</Form.Label>
                        <Form.Select
                            name="contract_status"
                            value={contract_status}
                            onChange={this.handleInputChange}
                        >
                            <option value="">전체</option> {/* 모든 상태 검색 */}
                            <option value="작성중">작성중</option>
                            <option value="계약성립">계약성립</option>
                            <option value="입주완료">입주완료</option>
                            <option value="계약변경">계약변경</option>
                            <option value="계약파기">계약파기</option>
                            <option value="계약취소">계약취소</option>
                            <option value="계약종료">계약종료</option> 
                        </Form.Select>
                    </Form.Group>
                    {/* </div>
                    <div className="form-row"> */}

                        <Form.Group className="mb-3 col">
                            <Form.Label>청구 마감일자</Form.Label>
                            <Form.Select
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
                                <th>출납번호</th>
                                <th>출납상세순번</th>
                                <th>출납일자</th>
                                <th>출납계정</th>
                                <th>출납항목</th>
                                <th>내용</th>
                                <th>입금액</th>
                                <th>출금액</th>
                                <th>보낸(받는)사람</th>
                                <th>확인일자</th>
                                <th>담당자</th>
                                <th>비고</th>
                                <th>주소</th>
                                <th>계약서번호</th>
                                <th>참조</th>
                                <th>마감번호</th>
                                <th>등록일시</th>
                                <th>등록인</th>
                                <th>수정일시</th>
                                <th>수정인</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statementList.length > 0 ? (
                                statementList.map((v, index) => (
                                    <Statement
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

export default LeaseStatement;
