import { Component } from "react";
import Axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "./LessorList.css"; // CSS 파일을 불러옵니다.
import React from "react";

//Lessor 컴포넌트 정의
// const Lessor = ({ usage_status, relationship, related_lessor, is_business_owner, name, ssn, address, mobile, email, remarks }) => {
//     return (
//         <tr>
//             <td>{usage_status}</td>
//             <td>{relationship}</td>
//             <td>{related_lessor}</td>
//             <td>{is_business_owner}</td> 
//             <td>{name}</td>
//             <td>{ssn}</td>
//             <td>{address}</td>
//             <td>{mobile}</td>
//             <td>{email}</td>
//             <td>{remarks}</td>
//         </tr>
//     );
// };
const Lessor = ({ usage_status, relationship, related_lessor, is_business_owner, name, ssn, address, mobile, email, remarks, onClick }) => {
    return (
        <tr onClick={onClick} style={{ cursor: "pointer" }}>
            <td>{usage_status}</td>
            <td>{relationship}</td>
            <td>{related_lessor}</td>
            <td>{is_business_owner}</td>
            <td>{name}</td>
            <td>{ssn}</td>
            <td>{address}</td>
            <td>{mobile}</td>
            <td>{email}</td>
            <td>{remarks}</td>
        </tr>
    );
};
// ViewLessorModal 컴포넌트 정의
const ViewLessorModal = ({ show, handleClose, data, refreshList }) => {
    if (!data) return null;

    const handleDelete = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                const response = await Axios.delete("http://localhost:3001/deleteLessor", {
                    data: { id: data.lessor_id }, // 선택된 데이터의 ID 전송
                });
                if (response.data.success) {
                    alert("삭제되었습니다.");
                    handleClose();
                    refreshList(); // 삭제 후 목록 새로고침
                } else {
                    alert(`삭제 실패: ${response.data.message}`);
                }
            } catch (error) {
                console.error("Error deleting lessor:", error);
                alert("오류가 발생했습니다.");
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>임대인 정보</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* 데이터 출력 */}
                <p><strong>사용여부:</strong> {data.usage_status}</p>
                <p><strong>관계:</strong> {data.relationship}</p>
                <p><strong>관련 임대인:</strong> {data.related_lessor}</p>
                <p><strong>임대사업자 여부:</strong> {data.is_business_owner}</p>
                <p><strong>이름:</strong> {data.name}</p>
                <p><strong>주민등록번호:</strong> {data.ssn}</p>
                <p><strong>주소:</strong> {data.address}</p>
                <p><strong>휴대폰:</strong> {data.mobile}</p>
                <p><strong>이메일:</strong> {data.email}</p>
                <p><strong>비고:</strong> {data.remarks}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>닫기</Button>
                <Button variant="danger" onClick={handleDelete}>삭제</Button>
            </Modal.Footer>
        </Modal>
    );
};

// AddLessorModal 컴포넌트 정의
const AddLessorModal = ({ show, handleClose, refreshList }) => {
    const [formData, setFormData] = React.useState({
        name: "",
        ssn: "",
        relation: "",
        relatedLessor: "",
        is_business_owner: "",
        address: "",
        mobile: "",
        email: "",
        note: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        // 기본값 설정
        const dataToSubmit = {
            ...formData,
            relation: formData.relation || "본인",
            relatedLessor: formData.relatedLessor || formData.name,
        };

        try {
            const response = await Axios.post("http://localhost:3001/addLessor", dataToSubmit);
            if (response.data) {
                alert("등록이 완료되었습니다.");
                handleClose();
                refreshList(); // 목록 새로고침
            } else {
                alert(`등록 실패: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error registering lessor:", error);
            alert("오류가 발생했습니다.");
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>임대인 등록</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>이름</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>주민등록번호</Form.Label>
                        <Form.Control
                            type="text"
                            name="ssn"
                            value={formData.ssn}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                    <Form.Label>임대 사업자 여부</Form.Label>
                        <Form.Select
                            name="is_business_owner"
                            value={formData.is_business_owner}
                            onChange={handleChange}
                        >
                        <option value="N">N</option>
                        <option value="Y">Y</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>관계</Form.Label>
                        <Form.Control
                            type="text"
                            name="relation"
                            value={formData.relation}
                            onChange={handleChange}
                            placeholder="예시) '본인'"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>관련 임대인</Form.Label>
                        <Form.Control
                            type="text"
                            name="relatedLessor"
                            value={formData.relatedLessor}
                            onChange={handleChange}
                            placeholder="예시) '홍길동'"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>주소</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>휴대폰</Form.Label>
                        <Form.Control
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>이메일</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>비고</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    취소
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    등록
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

class LessorList extends Component {
    state = {
        lessorList: [], // 초기 상태를 빈 배열로 설정
        name: "",
        ssn: "",
        mobile: "",
        showAddModal: false, // 등록 모달 상태

        showViewModal: false, // 보기 모달 상태
        selectedLessor: null // 선택된 임대인 데이터
    };
    
    // 서버에서 Lessor 데이터를 가져오는 함수
    getList = () => {
        Axios.get("http://localhost:3001/Lessorlist")
            .then((response) => {
                console.log("서버 응답 데이터:", response.data); // 서버에서 반환된 데이터를 확인
                this.setState({ lessorList: response.data }); // 데이터를 lessorList에 설정
            })
            .catch((error) => {
                console.error("Error fetching list:", error);
            });
    };

    // 검색 요청을 보내는 함수
    searchLessor = () => {
        const { name, ssn, mobile } = this.state;
        Axios.post("http://localhost:3001/searchLessor", { name, ssn, mobile })
            .then((response) => {
                console.log("검색 결과:", response.data);
                this.setState({ lessorList: response.data });
            })
            .catch((error) => {
                console.error("Error searching lessor:", error);
            });
    };

    // 입력값을 상태에 저장하는 함수
    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    // 모달 열기/닫기
    toggleAddModal = (show) => {
        this.setState({ showAddModal: show });
    };

    toggleViewModal = (show, lessor = null) => {
        this.setState({ showViewModal: show, selectedLessor: lessor });
    };

    // 컴포넌트가 마운트되었을 때 리스트를 가져옵니다.
    componentDidMount() {
        this.getList();
    }

    render() {
//        const { lessorList, name, ssn, mobile, showAddModal } = this.state;
        const { lessorList, name, ssn, mobile, showAddModal, showViewModal, selectedLessor } = this.state;

        return (
            <div>
                <div className="button-group">
                    <Button variant="info" onClick={this.searchLessor}>검색</Button>
                    <Button variant="secondary" onClick={this.getList}>초기화</Button>
                    <Button variant="success" onClick={() => this.toggleAddModal(true)}>등록</Button>                                        
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
                            <th>임대사업자 여부</th> 
                            <th>이름</th>
                            <th>주민등록번호</th>
                            <th>주소</th>
                            <th>휴대폰</th>
                            <th>이메일</th>
                            <th>비고</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* {lessorList.length > 0 ? (
                            lessorList.map((v, index) => (
                                <Lessor 
                                    key={index} 
                                    usage_status={v.usage_status}
                                    relationship={v.relationship}
                                    related_lessor={v.related_lessor}
                                    is_business_owner={v.is_business_owner} 
                                    name={v.name}
                                    ssn={v.ssn}
                                    address={v.address}
                                    mobile={v.mobile}
                                    email={v.email}
                                    remarks={v.remarks}
                                />
                            ))
                        ) : ( */}
                            {lessorList.length > 0 ? (
                                lessorList.map((v, index) => (
                                    <Lessor
                                        key={index}
                                        {...v}
                                        onClick={() => this.toggleViewModal(true, v)}
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

                {/* 등록 모달 */}
                <AddLessorModal
                    show={showAddModal}
                    handleClose={() => this.toggleAddModal(false)}
                    refreshList={this.getList}
                />
                <ViewLessorModal
                    show={showViewModal}
                    handleClose={() => this.toggleViewModal(false)}
                    data={selectedLessor}
                    refreshList={this.getList} // 목록 갱신 함수 전달
                />
            </div>
        );
    }
}

export default LessorList;
