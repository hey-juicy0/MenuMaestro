import React, { useState, useEffect, useCallback } from 'react';
import { ref, get, set, child, update } from 'firebase/database';
import { useDatabase } from '../contexts';
import { getToday, getTodayReadable } from '../utils';

import Modal from 'react-modal';
import Card from 'react-bootstrap/Card';

import '../css/category.css'

function MenuReCommend() {
  const { database } = useDatabase();   // 데이터베이스 가져오기
  const dbRef = ref(database, 'menus'); // 'menus' 참조 생성

  // 상태 변수 목록
  const [menus, setMenus] = useState([]);                               // 선택 연산에 사용할 메뉴 목록
  
  const [selectedCategory, setSelectedCategory] = useState(null);       // 선택한 1차 카테고리를 저장
  const [subcategories, setSubcategories] = useState([]);               // 하위 카테고리 종류 설정
  const [selectedSubCategory, setSelectedSubCategory] = useState(null); // 선택된 하위 카테고리 저장
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [finalList, setFinalList] = useState([]);                       // 최종 필터링 결과를 저장하는 목록
  const [finalMenu, setFinalMenu] = useState(null);                     // 최종 추천 메뉴 무작위 선정
  
  const [isModalOpen, setIsModalOpen] = useState(false);               // 최종 추천 메뉴 모달 창 보임 상태
  const [modalMenu, setModalMenu] = useState(null);
  const [votedMenus, setVotedMenus] = useState({});


  const baseCategory = [ "한식", "중식", "일식", "아시안식", "상관없음"]; // 1차 카테고리

  // vote를 위한 전체 메뉴 menus에 저장
  useEffect(() => {
    // 파이어베이스에서 데이터 가져오기
    const fetchData = async () => {
      try {
        const snapshot = await get(dbRef); // 'menus' 참조의 데이터 가져오기
        if (snapshot.exists()) {
          const data = snapshot.val(); // 스냅샷의 데이터를 변수에 할당
          setMenus(data); // 가져온 데이터를 menus 상태 변수에 저장
        }
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };

    // 컴포넌트가 처음 마운트될 때 데이터 가져오기
    fetchData();
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행

    
  // 초기화를 위한 cleanup 함수
  const cleanup = () => {
    setSelectedCategory(null);
    setSubcategories([]);
    setSelectedSubCategory(null);
    setFinalList([]);
    setFinalMenu(null);
    setIsModalOpen(false);
    setModalMenu(null);
  };

  // useEffect를 사용하여 컴포넌트가 처음 마운트될 때 초기화
  useEffect(() => {
    cleanup(); // 컴포넌트가 처음 마운트될 때 바로 초기화
    return cleanup; // cleanup 함수를 반환하여 unmount 시에도 실행되도록 함
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행


  // 모달 창 열고 닫기
  const openModal = useCallback((menu) => {
    setIsModalOpen(true);
    setFinalMenu(menu); // 모달로 띄워진 메뉴를 finalMenu로 설정
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setFinalMenu(null); // 모달이 닫힐 때 finalMenu 초기화
  }, [])

  // 1차 카테고리 온클릭 메소드
  const selectCategory = async (category) => {
    setSelectedCategory(category); // baseCategory 선택

    try {
      const snapshot = await get(dbRef); // 전체 데이터베이스 참조, 스냅샷 생성
      if (snapshot.exists()) {
        const data = snapshot.val(); // 스냅샷 value를 복사한 뒤
        const temp = category === '상관없음' ? data : data.filter(menu => menu.nation === category);
        setFilteredMenus(temp); // 필터링된 메뉴들을 menus 상태로 업데이트

        console.log('Category:', category);
        console.log('data:', data);
        console.log('temp:', temp);

      }
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
    console.log('1차 filteredMenus:', filteredMenus);
  };

  // 1차 카테고리 세팅
  useEffect(() => {
    const setSubCategoriesByCategory = (selectedCategory) => {
      switch (selectedCategory) {
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
        default:
          setSubcategories([]);
          break;
      }
    };
  
    if (selectedCategory !== null) {
      setSubCategoriesByCategory(selectedCategory);
    }
  }, [selectedCategory]);
  

  // 2차 카테고리 선택에 따른 메뉴 필터링
  const selectSubCategory = useCallback((index) => {
    setSelectedSubCategory(subcategories[index]);
    console.log('selected Subcategory:', selectedSubCategory);
    console.log('수신 current filterdmenu:', filteredMenus);

    // 값이 비어 있는 경우에는 더 이상 진행하지 않도록 조건 추가
    if (!selectedCategory || !subcategories[index] || !filteredMenus.length) {
      return;
    }
      let temp = [];
      if (selectedCategory === '상관없음') {
        temp = filteredMenus.filter(menu => menu.type === subcategories[index]);
      }
      else {
        temp = filteredMenus.filter(menu => menu.type === subcategories[index] && menu.nation === selectedCategory);
      }
      setFinalList(temp);

      console.log('temp:', temp);

      if (filteredMenus.length > 0) {
        const randomIndex = Math.floor(Math.random() * temp.length);
        const randomMenu = temp[randomIndex];
        setFinalMenu(randomMenu);
        openModal(randomMenu);
      } else {
        setFinalMenu(null);
      }
    console.log('마지막 filteredMenu:', filteredMenus);
  }, [selectedCategory, subcategories, filteredMenus, openModal]);


  // 2차 카테고리 온클릭 메소드
  useEffect(() => {
    // filteredMenus가 업데이트될 때마다 selectSubCategory 함수 호출
    selectSubCategory(selectedSubCategory);
  }, [filteredMenus, selectSubCategory, selectedSubCategory]);


  // RandomPick에 정의된 upvote 함수
  const upvote = async () => {
    console.log('menus:', menus);
    if (finalMenu) {
      const targetMenuIndex = menus.findIndex(menu => menu.name === finalMenu.name)
      console.log("targetIndex:", targetMenuIndex);

      if(targetMenuIndex !== -1) {
        const updated = {
          ...finalMenu,
          lastVote: getToday(),
          vote: finalMenu.lastVote === getToday() ? finalMenu.lastVote : (Number(finalMenu.vote) + 1) 
        };
        const targetMenuRef = ref(database, `/menus/${targetMenuIndex}`);
        
        update(targetMenuRef, { lastVote: updated.lastVote, vote: updated.vote });
        
        setVotedMenus(prevState => ({
          ...prevState,
          [finalMenu.name]: true,
        }));

        setFinalMenu(updated);
      }
      console.log(finalMenu.vote);
      console.log('finalList:', finalList);
    }
  };

  // 리턴 렌더링 부분
  return (
    <div className="recommend">
      <center><h2>메뉴 추천</h2></center>
        <ul >
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
          {finalMenu && (
              <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                <div style={{width: '300px', backgroundColor: 'white'}}>
                  <div className="card-frame">
                    <div className="card-card">
                      <img className="card-image" src={finalMenu.url} alt="food" />
                      <p className="card_text">{finalMenu.name}</p>
                      <span style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}} onClick={closeModal}>
                        {' '}닫기{' '}
                      </span>
                    </div>
                  </div>
                </div>
                {finalMenu && (<p className="menu-description">
                    오늘({getTodayReadable()}) {finalMenu.vote}회의 추천을 받았습니다. &nbsp;
                    {!votedMenus[finalMenu.name] && (
                      <img className="vote" src="https://i.ibb.co/4VXmN4x/like-1.png" 
                    width={'40px'} onClick={() => upvote()} />
                    )}
                    
                  </p>)}
                  
              </Modal>
          )}
    </div>
  );  
} 

export default MenuReCommend;
