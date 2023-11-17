import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { useDatabase } from '../contexts';
import { getTodayReadable } from '../utils';

import Card from 'react-bootstrap/Card';

import '../css/category.css'

// 음식 카드
function Show({currentMenu, upvote, onClose }) {
  const [showCard, setShowCard] = useState(true);

  const close = () => {
    setShowCard(false);
    onClose();
  }
  return (
    <>
        <Card className='recommend_card'>
          <Card.Body>
            <Card.Title>
            <img className='close' src="https://i.ibb.co/YZbWQM5/reject.png" onClick={close} alt="reject"></img>
              <img className='recommend_image' src={currentMenu.url} alt="food"/></Card.Title>
            <Card.Text className='recommend_text'>{currentMenu.name}</Card.Text>
          </Card.Body>
        </Card>
        <p style={{backgroundColor:'white'}} className="random-menu-description">
          오늘({getTodayReadable()}) {currentMenu.vote}회의 추천을 받았습니다 &nbsp;
          <img src = "https://i.ibb.co/4VXmN4x/like-1.png" className='vote' onClick={upvote}/>
        </p>
                {/* <button onClick={()=> initiateData()}>초기화</button>
          <Card.Footer className="text-muted">
            <button type="button" onClick={upvote}>좋아요</button>
            <button type="button" onClick={reset}>다른거</button>
          </Card.Footer> */}
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
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [selectedSubCategoryIndex, setSelectedSubCategoryIndex] = useState(null);
  const baseCategory = [ "한식", "중식", "일식", "아시안식", "상관없음"]; // 1차 카테고리

  // 1차 카테고리 세팅
  useEffect(() => { 
    const fetchMenus = async () => {
      try {
        if(selectedCategory) {                     // 선택된 1차 카테고리가 있으면
          const snapshot = await get(dbRef, 'menus'); // 전체 데이터베이스 참조, 스냅샷 생성
          if(snapshot.exists()) {                // 일시적 변수 데이터에 스냅샷 value를 복사한 뒤
            const data = snapshot.val();         // 선택한 카테고리에 포함된 메뉴들만 필터링
            const filteredMenus = selectedCategory === "상관없음" ? data : data.filter(menus => menus.nation === selectedCategory);
            setMenus(filteredMenus); // menus 갱신
          }
        }
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };
    fetchMenus();
  }, [dbRef, selectedCategory]);

  //   if(selectedCategory) {                     // 선택된 1차 카테고리가 있으면
  //     get(dbRef, 'menus').then((snapshot) => { // 전체 데이터베이스 참조, 스냅샷 생성
  //       if(snapshot.exists()) {                // 일시적 변수 데이터에 스냅샷 value를 복사한 뒤
  //         const data = snapshot.val();         // 선택한 카테고리에 포함된 메뉴들만 필터링
  //         const filteredMenus = selectedCategory === "상관없음" ? data : data.filter(menus => menus.nation === selectedCategory);
  //         setMenus(filteredMenus); // menus 갱신
  //       }
  //     }).catch(error => {
  //       console.error("Error fetching menus:", error);
  //     });
  //   }
  // }, [dbRef, selectedCategory]); // 카테고리 선택 변경 시마다 작동


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
const selectCategory = (category, index) => {
  setSelectedCategory(category); // baseCategory 선택
  setSelectedCategoryIndex(index); // 선택한 카테고리의 인덱스 저장
  setSubCategories(category);    // subcategories 설정
}

  
  // 2차 카테고리 선택에 따른 메뉴 필터링
useEffect(() => {
  const showFinalMenu = async finalList => {
    try {
      if (selectedSubCategory !== null) {
        let filteredMenus = [];
        if (selectedCategory === '상관없음') {
          filteredMenus = menus.filter(menu => menu.type === selectedSubCategory);
        } else {
          filteredMenus = menus.filter(
            menu => menu.type === selectedSubCategory && menu.nation === selectedCategory
          );
        }
        setFinalList(filteredMenus);

        if (filteredMenus.length > 0) {
          const randomIndex = Math.floor(Math.random() * filteredMenus.length);
          const randomMenu = filteredMenus[randomIndex];
          setFinalMenu(randomMenu);
          setShowFinalCard(true);
        }
      }
    } catch (error) {
      console.error('Error showing final menu:', error);
    }
  };

  (async () => {
    await showFinalMenu();
  })();
}, [selectedSubCategory, selectedCategory]);

// 2차 카테고리 온클릭 메소드
const selectSubCategory = (subcategory, index) => {
  setSelectedSubCategory(subcategory);
  setSelectedSubCategoryIndex(index);
  showFinalMenu(finalList);
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

  const handleResetClick = () => {
    // 페이지를 새로고침
    window.location.reload();
  };
  
  // 리턴 렌더링 부분
  return (
    <div className="recommend">
      <div className='section_title'>메뉴 추천</div>
      <div className="dotted-line-container">
        <div className="dotted-line" />
        {/* 투표는 건드리지 않고 난수만 다시 뽑아서 음식을 선택해주는 리셋 버튼 */}
        <img className = 'reset' src="https://i.ibb.co/yRggpzD/reset.png" onClick={handleResetClick} alt="reset" />
      </div>
      <div className="lists-container">
        <div className="category-list">
          <ul>
          {baseCategory.map((category, index) => (
            <li
              key={index}
              onClick={() => selectCategory(category, index)}
              className={selectedCategoryIndex === index ? 'selected' : ''}
            >
              {category}
            </li>
            ))}
          </ul>
        </div>
        <div className="subcategory-list">
          <ul>
          {subcategories.map((subcategory, index) => (
            <li
              key={index}
              onClick={() => selectSubCategory(subcategory, index)}
              className={selectedSubCategoryIndex === index ? 'selected' : ''}
            >
              {subcategory}
            </li>
            ))}
          </ul>
        </div>
      </div>
      {finalMenu && showFinalCard && (
        <Show
          currentMenu={finalMenu}
          upvote={() => upvote(finalMenu)}
          reset={() => { pickCurrentMenu({ data: menus, force: true }) }}
          onClose={closeCard}
          showCard={showFinalCard}
        />
      )}
    </div>
  );
}

export default MenuReCommend;