import logo from './logo.svg';
import './App.css';

// 상단 메뉴바 코드 
import {Navbar, Nav, Container} from 'react-bootstrap';

// 페이지 나누는 라우터 라이브러리
import {Routes, Route,  useNavigate  } from 'react-router-dom'

// 각 페이지 컴포넌트
import RandomPick from './pages/RandomPick';
import FoodBoard from './pages/FoodBoard';
import MenuReCommend from './pages/MenuReCommend';
import WorldCup from './pages/WorldCup';
import MenuAdd from './pages/MenuAdd';
import MemberInfo from './pages/MemberInfo'; 

import { useState } from 'react';
import { DatabaseProvider } from './contexts';

function App() {

  // 상단 네비바->해당경로로 이동해주도록 변수에 저장
  let navigate = useNavigate()
  
  // 랜덤추천, 월드컵, 메뉴추천.js에서 사용할 상태변수 
  let [userPick, setUserPick] = useState(0);


  return (
    <DatabaseProvider>
      <div className="App">
        <Navbar className="nav-layout">
          <Container>
            <Navbar.Brand className = "menumaestro" title="사용 방법 화면으로 이동" onClick={()=> {navigate('/')}}>메뉴 마에스트로</Navbar.Brand>
            <Nav className="me-auto">
              <div className='nav-menu-image-container' title="메뉴 추천 화면으로 이동" > 
              <Nav.Link onClick={()=> {navigate('/MenuRecommend')}}>
              <img 
                className='nav-menu-image' 
                src="https://i.ibb.co/Tbvs0J9/like.png" alt="" />메뉴추천</Nav.Link>
              </div>
              <div className='nav-menu-image-container' title="랜덤 추천 화면으로 이동">
                <Nav.Link onClick={()=> {navigate('/RandomPick')}}>
                <img 
                className='nav-menu-image'
                src="https://i.ibb.co/h8C78Ps/random.png" alt="" />
                랜덤</Nav.Link>
              </div>
              <div className='nav-menu-image-container' title="월드컵 화면으로 이동">
                
                <Nav.Link onClick={()=> {navigate('/WorldCup')}}>
                <img
                
                className='nav-menu-image'
                src="https://i.ibb.co/pzz7WrL/worldcup.png" alt="" />
                월드컵</Nav.Link>
              </div>
              <div className='nav-menu-image-container' title="단원 게시판으로 이동">
                <Nav.Link onClick={()=> {navigate('/FoodBoard')}}>
                <img
                className='nav-menu-image'
                src="https://i.ibb.co/LnTZY3V/2x.png" alt="" />
                  단원 게시판 </Nav.Link>
              </div>
              <div className='nav-menu-image-container' title="메뉴 추가 화면으로 이동">
                <Nav.Link onClick={()=> {navigate('/MenuAdd')}}>
                <img
                className='nav-menu-image' 
                src="https://i.ibb.co/DwHZJxM/food-and-restaurant-4.png" alt="" />
                메뉴 추가</Nav.Link>
              </div>
            </Nav>
          </Container>
        </Navbar> 
        <img className='memberinfo'title="운영 단원 소개"
          onClick={()=> {navigate('/MemberInfo')}}
          src="https://i.ibb.co/qWjYTwK/info-button-1.png"
        />

        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/MenuRecommend' element={<MenuReCommend userPick={userPick} setUserPick={setUserPick}/>} />
          <Route path='/RandomPick' element={<RandomPick userPick={userPick} setUserPick={setUserPick}/>} />
          <Route path='/WorldCup' element={<WorldCup userPick={userPick} setUserPick={setUserPick}/>} />
          <Route path='/FoodBoard' element={<FoodBoard />} />
          <Route path='/MenuAdd' element={<MenuAdd />} />
          <Route path='/MemberInfo' element={<MemberInfo />} />

        </Routes>
    </div>
  </DatabaseProvider>
  );
}

function Main() {
  return(
    <div className="main-bg" style={{marginTop: "50px"}}>
    <div className="container">
      <div className="logo_frame">
        <img className="logo" src="https://i.ibb.co/BLr11Tv/2.png" alt="Logo" />
      </div>
      <p className="text_info">하루에도 몇 번씩 “오늘 뭐 먹지?” 고민하는 사람들을 위한 메뉴 추천 서비스</p>
      <img className="info" src="https://i.ibb.co/qMRfdFp/1.png" alt="Info" />
    </div>
  </div>
  )
}

export default App;
