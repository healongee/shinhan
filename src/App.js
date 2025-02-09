import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import LessorList from './LessorList';
import 'bootstrap/dist/css/bootstrap.min.css';
import TenantList from './TenantList';
import HouseInfo from './Houseinfo';
import LeaseContract from './LeaseContract';
import LeaseStatement from './LeaseStatement';
import HouseinfoDetail from "./HouseinfoDetail";  // 추가
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Login(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  
  return <>
    <h2>신한 부동산 관리 프로그램 로그인</h2>

    <div className="form">
      <p><input className="login" type="text" name="username" placeholder="아이디" onChange={event => {
        setId(event.target.value);
      }} /></p>
      <p><input className="login" type="password" name="pwd" placeholder="비밀번호" onChange={event => {
        setPassword(event.target.value);
      }} /></p>

      <p><input className="btn" type="submit" value="로그인" onClick={() => {
        const userData = {
          userId: id,
          userPassword: password,
        };
        fetch("http://localhost:3001/login", { //auth 주소에서 받을 예정
          method: "post", // method :통신방법
          headers: {      // headers: API 응답에 대한 정보를 담음
            "content-type": "application/json",
          },
          body: JSON.stringify(userData), //userData라는 객체를 보냄
        })
          .then((res) => res.json())
          .then((json) => {            
            if(json.isLogin==="True"){
              props.setMode("WELCOME");
            }
            else {
              alert(json.isLogin)
            }
          });
      }} /></p>
    </div>

    <p>계정이 없으신가요?  <button onClick={() => {
      props.setMode("SIGNIN");
    }}>회원가입</button></p>
  </> 
}

function Signin(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  return <>
    <h2>회원가입</h2>

    <div className="form">
      <p><input className="login" type="text" placeholder="아이디" onChange={event => {
        setId(event.target.value);
      }} /></p>
      <p><input className="login" type="password" placeholder="비밀번호" onChange={event => {
        setPassword(event.target.value);
      }} /></p>
      <p><input className="login" type="password" placeholder="비밀번호 확인" onChange={event => {
        setPassword2(event.target.value);
      }} /></p>

      <p><input className="btn" type="submit" value="회원가입" onClick={() => {
        const userData = {
          userId: id,
          userPassword: password,
          userPassword2: password2,
        };
        fetch("http://localhost:3001/signin", { //signin 주소에서 받을 예정
          method: "post", // method :통신방법
          headers: {      // headers: API 응답에 대한 정보를 담음
            "content-type": "application/json",
          },
          body: JSON.stringify(userData), //userData라는 객체를 보냄
        })
          .then((res) => res.json())
          .then((json) => {
            if(json.isSuccess==="True"){
              alert('회원가입이 완료되었습니다!')
              props.setMode("LOGIN");
            }
            else{
              alert(json.isSuccess)
            }
          });
      }} /></p>
    </div>

    <p>로그인화면으로 돌아가기  <button onClick={() => {
      props.setMode("LOGIN");
    }}>로그인</button></p>
  </> 
}

function App() {
  const [mode, setMode] = useState("");
  const [menu, setMenu] = useState("LessorList");

  useEffect(() => {
    fetch("http://localhost:3001/authcheck")
      .then((res) => res.json())
      .then((json) => {        
        if (json.isLogin === "True") {
          setMode("WELCOME");
        } else {
          setMode("LOGIN");
        }
      });
  }, []); 

  function handleLogout() {
    fetch('/logout', {
        method: 'GET',
        credentials: 'include', // 세션 쿠키를 포함
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/'; // 홈 페이지로 리다이렉트
        } else {
            alert('Logout failed: ' + data.message);
        }
    })
    .catch(err => console.error('Logout error:', err));
}
  

  const renderContent = () => {
    if (menu === "LessorList") {
      return <LessorList />;
    }
    if (menu === "TenantList") {
      return <TenantList />;
    }
    if (menu === "HouseInfo") {
      return <HouseInfo />;
    }
    if (menu === "LeaseContract") {
      return <LeaseContract />;
    } 
    if (menu === "LeaseStatement") {
      return <LeaseStatement />;
    } 
    return <div>준비 중입니다...</div>;
  };

  let content = null;  

  if (mode === "LOGIN") {
    content = <Login setMode={setMode} />;
  } else if (mode === "SIGNIN") {
    content = <Signin setMode={setMode} />;
  } else if (mode === "WELCOME") {
    content = (
      //<>
      <Router>
        <div className="App">
          <div className="navbar">
            <ul>
              <li onClick={() => setMenu("LessorList")}>임대인정보</li>
              <li onClick={() => setMenu("TenantList")}>임차인정보</li>
              <li onClick={() => setMenu("HouseInfo")}>주택정보</li>
              <li onClick={() => setMenu("LeaseContract")}>임대차계약</li>
              <li onClick={() => setMenu("LeaseStatement")}>임대료청구</li>
              <li>이주정산</li>
              <li>금전출납</li>
              <li>시스템</li>
              <li onClick={handleLogout}>로그아웃</li>
            </ul>
          </div>
          {/* <div className="content">
            {renderContent()}
          </div> */}
          <div className="content">
            <Routes>
              <Route path="/" element={renderContent()} />
              <Route path="/house/:house_id" element={<HouseinfoDetail />} />
            </Routes>
          </div>
        </div>
      {/* </> */}
      </Router>
    );
  }

  return (
    <div className="background">
      {content}
    </div>
  );
}

export default App;