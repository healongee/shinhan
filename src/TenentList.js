import { Component } from "react";
import Axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./TenentList.css"; // CSS 파일을 불러옵니다.

const Tenent = ({ usage_status, relationship, related_tenent, name, ssn, address, mobile, email, remarks }) => {
    return (
        <tr>
            <td>{usage_status}</td>
            <td>{relationship}</td>
            <td>{related_tenent}</td>
            <td>{name}</td>
            <td>{ssn}</td>
            <td>{address}</td>
            {/* <td>{phone}</td> */}
            <td>{mobile}</td>
            <td>{email}</td>
            <td>{remarks}</td>
        </tr>
    );
};

class TenentList extends Component {
    state = {
        tenentList: [], // 초기 상태를 빈 배열로 설정
        name: '',
        ssn: '',
        mobile: ''
    };

    getList = () => {
        Axios.get("http://localhost:3001/Tenentlist")
            .then((response) => {
                console.log("서버 응답 데이터:", response.data); // 서버에서 반환된 데이터를 확인
                this.setState({ tenentList: response.data }); // 데이터를 tenentList에 설정
            })
            .catch((error) => {
                console.error("Error fetching list:", error);
            });
    };

    // 검색 요청을 보내는 함수
    searchTenent = () => {
        const { name, ssn, mobile } = this.state;
        Axios.post("http://localhost:3001/searchTenent", { name, ssn, mobile })
            .then((response) => {
                console.log("검색 결과:", response.data);
                this.setState({ tenentList: response.data });
            })
            .catch((error) => {
                console.error("Error searching tenent:", error);
            });
    };

    // 입력값을 상태에 저장하는 함수
    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    // 컴포넌트가 마운트되었을 때 리스트를 가져옵니다.
    componentDidMount() {
        this.getList();
    }

    render() {
        const { tenentList, name, ssn, mobile } = this.state;

        return (
            <div>
                <div className="button-group">
                    <Button variant="info" onClick={this.searchTenent}>검색</Button>
                    <Button variant="secondary" onClick={this.getList}>초기화</Button>
                </div>

                <Form>
                    <div className="form-row">
                        <Form.Group className="mb-3 col" controlId="exampleForm.ControlInput1">
                            <Form.Label>이름</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="name" 
                                value={name}
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 col" controlId="exampleForm.ControlInput2">
                            <Form.Label>주민등록번호</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="ssn" 
                                value={ssn} 
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 col" controlId="exampleForm.ControlInput3">
                            <Form.Label>휴대폰</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="mobile" 
                                value={mobile} 
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                    </div>
                </Form>
                <div className="table-container">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>사용여부</th>
                            <th>관계</th>
                            <th>관련 임대인</th>
                            <th>이름</th>
                            <th>주민등록번호</th>
                            <th>주소</th>
                            {/* <th>전화번호</th> */}
                            <th>휴대폰</th>
                            <th>이메일</th>
                            <th>비고</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tenentList.length > 0 ? (
                            tenentList.map((v, index) => (
                                <Tenent
                                    key={index} 
                                    usage_status={v.usage_status}
                                    relationship={v.relationship}
                                    related_tenent={v.related_tenent}
                                    name={v.name}
                                    ssn={v.ssn}
                                    address={v.address}
                                    // phone={v.phone}
                                    mobile={v.mobile}
                                    email={v.email}
                                    remarks={v.remarks}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">데이터가 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                </div>
                <div className="button-group-right">
                    <Button variant="info">등록</Button>
                    <Button variant="secondary">수정</Button>
                    <Button variant="danger">삭제</Button>
                </div>
            </div>
        );
    }
}

export default TenentList;
