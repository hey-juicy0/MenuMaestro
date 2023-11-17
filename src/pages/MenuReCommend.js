import React, { useState, useEffect } from 'react';
import { ref, get,set } from 'firebase/database';
import { useDatabase } from '../contexts';
import { getTodayReadable} from '../utils';

import Card from 'react-bootstrap/Card';

import '../css/category.css'

// 음식 카드
function Show({currentMenu, upvote, reset, onClose }) {
  const [showCard, setShowCard] = useState(true);

  const close = () => {
    setShowCard(false);
    onClose();
  }
  return (
    <>
      <div>
        <Card className="text-center">
          <Card.Body>
            <Card.Title><img className="random-current-menu-image" src={currentMenu.url} alt="food"/></Card.Title>
            <Card.Text>{currentMenu.name}</Card.Text>
            <span style={{cursor: "pointer", color: "blue", textDecoration:"underline"}}onClick={close}> 닫기 </span>
          </Card.Body>
        </Card>
        <p className="random-menu-description">
          오늘({getTodayReadable()}) {currentMenu.vote}회의 추천을 받았습니다 &nbsp;
          <img src = "https://i.ibb.co/4VXmN4x/like-1.png" width={"40px"} onClick={upvote}/>
        </p>
                {/* <button onClick={()=> initiateData()}>초기화</button>
          <Card.Footer className="text-muted">
            <button type="button" onClick={upvote}>좋아요</button>
            <button type="button" onClick={reset}>다른거</button>
          </Card.Footer> */}
        </div>
    </>
  );
}


function MenuReCommend() {
  const { database } = useDatabase();   // 데이터베이스 가져오기
  const dbRef = ref(database, 'menus'); // 'menus' 참조 생성

  // 상태 변수 목록
  const [menus, setMenus] = useState([]);                               // 선택 연산에 사용할 메뉴 목록
  
  const [selectedCategory, setSelectedCategory] = useState(null);       // 선택한 1차 카테고리를 저장
  const [subcategories, setSubcategories] = useState([]);               // 하위 카테고리 종류 설정
  const [selectedSubCategory, setSelectedSubCategory] = useState(null); // 선택된 하위 카테고리 저장

  const [finalList, setFinalList] = useState([]);                       // 최종 필터링 결과를 저장하는 목록
  const [finalMenu, setFinalMenu] = useState(null);                     // 최종 추천 메뉴 무작위 선정
  const [showFinalCard, setShowFinalCard] = useState(false);            // 최종 추천 메뉴 창 보임 상태

  const baseCategory = [ "한식", "중식", "일식", "아시안식", "상관없음"]; // 1차 카테고리

  // 1차 카테고리 세팅
  useEffect(() => { 
    if(selectedCategory) {                     // 선택된 1차 카테고리가 있으면
      get(dbRef, 'menus').then((snapshot) => { // 전체 데이터베이스 참조, 스냅샷 생성
        if(snapshot.exists()) {                // 일시적 변수 데이터에 스냅샷 value를 복사한 뒤
          const data = snapshot.val();         // 선택한 카테고리에 포함된 메뉴들만 필터링
          const filteredMenus = selectedCategory === "상관없음" ? data : data.filter(menus => menus.nation === selectedCategory);
          setMenus(filteredMenus); // menus 갱신
        }
      }).catch(error => {
        console.error("Error fetching menus:", error);
      });
    }
  }, [dbRef, selectedCategory]); // 카테고리 선택 변경 시마다 작동


  // 2차 카테고리 세팅
  const setSubCategories = selectedCategory => {
    switch(selectedCategory) { // 선택한 1차 카테고리 종류에 따라 2차 카테고리 분류를 변경
      case '한식':
          setSubcategories(['밥류', '면류', '찌개류', '육류', '기타']);
          break;
      case '중식':
          setSubcategories(['밥류', '면류', '탕류', '육류', '해산물류']);
          break;
      case '양식':
          setSubcategories(['밥류', '면류', '빵류', '육류', '해산물류']);
          break;
      case '일식':
          setSubcategories(['밥류', '면류', '해산물류', '육류', '기타']);
          break;
      case '아시안식':
          setSubcategories(['밥류', '면류', '국물류', '육류', '기타']);
          break;
      case '상관없음':
          setSubcategories(['밥류', '면류', '빵류', '찌개류', '탕류', '국물류', '육류', '해산물류', '기타']);
          break;
            
            default: return[];
    }
  }

  // 1차 카테고리 온클릭 메소드
  const selectCategory = (category) => {
    setSelectedCategory(category); // baseCategory 선택
    setSubCategories(category);    // subcategories 설정
  }

  
  // 2차 카테고리 선택에 따른 메뉴 필터링
  useEffect(() => {
    if(selectedSubCategory !== null) {                          // subcategory가 선택된 상태면
      let filteredMenus = [];
      if (selectedCategory === "상관없음")
        filteredMenus = menus.filter(menu => menu.type === selectedSubCategory);    // 선택한 type에 맞는 메뉴들만 필터링
      else {
        filteredMenus = menus.filter(menu => menu.type === selectedSubCategory && menu.nation === selectedCategory)
      }                        // menus 갱신
      setFinalList(filteredMenus);       

    }
  }, [selectedSubCategory, menus]);

  // 2차 카테고리 온클릭 메소드
  const selectSubCategory = (index) => {
    setSelectedSubCategory(subcategories[index]);  // 서브 카테고리 선택 저장
    showFinalMenu(finalList);                   // 최종 추천 메뉴 창 보이기
  }

  // 최종 추천 메뉴를 랜덤으로 선정
  const showFinalMenu = (finalList) => {
    console.log(finalList);
    if(finalList.length > 0) {
      const randomIndex = Math.floor(Math.random() * menus.length);
      const randomMenu = finalList[randomIndex];
      setFinalMenu(randomMenu);
      setShowFinalCard(true);
    }
  }

  // RandomPick에 정의된 upvote 함수
  const upvote = (currentMenu) => {
    const targetMenuIndex= menus.findIndex(menu => menu.name === currentMenu.name)
    const updated = {...currentMenu, vote: currentMenu.vote+1}
    const newMenus = [...menus];
    newMenus.splice(targetMenuIndex, 1, updated)
    set(ref(database, '/menus'), newMenus);
  }

  // finalMenu 창 닫기 
  const closeCard = () => setShowFinalCard(false);

  // 리턴 렌더링 부분
  return (
    <div className='recommend'>
      <div className='section_title'>메뉴 추천</div>
        <ul>
            {baseCategory.map((category, index) => (
              <li key={index} onClick={()=> selectCategory(category)}>
                {category}</li>
            ))}
          </ul>
          <p></p>
          <ul>
          {subcategories.map((subcategory, index) => (
          <li key={index} onClick={() => selectSubCategory(index)}>
            {subcategory}</li> ))}
          </ul>
          {finalMenu && showFinalCard && (
            <Show currentMenu={finalMenu} 
            upvote={() => upvote(finalMenu)} 
            reset={()=> {pickCurrentMenu({data:menus, force: true})}}
            onClose={closeCard} 
            showCard={showFinalCard}/>
          )}
    </div>
  );  
} 

export default MenuReCommend;
