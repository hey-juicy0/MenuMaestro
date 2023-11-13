import { useState, useRef } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { useDatabase } from '../contexts';
import { onValue } from "firebase/database";
import { Category } from '../utils';

import '../css/category.css'

function MenuReCommend() {

  const { database } = useDatabase();   // 데이터베이스 가져오기
  const dbRef = ref(database, 'menus'); // 'menus' 참조 생성

  // 상태 변수 목록
  const [menus, setMenus] = useState([]); // 메뉴 목록 저장
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리를 저장
  const [selectedMenu, setSelectedMenu] = useState(null); // 선택된 메뉴를 저장

  // menus 리스트
  const randomMenu = menus.length > 0 ? menus[1] : null; // 랜덤으로 선택한 메뉴
  const baseCategory = [ "한식", "중식", "일식", "아시안식", "상관 없음"]; // 1차 카테고리

  // 1차 카테고리 선택: 국가
  const selectBaseCategory = async (category) => {
    setSelectedCategory(category); // 선택 카테고리 업데이트

    try {
      const snapshot = await get(dbRef); // 메뉴 전체를 일시적으로 snapshot
      if(snapshot.exists()) {            // snapshot이 존재하면
        const data = snapshot.val();

        // 해당 카테고리(국적)에 맞는 메뉴들만 필터링하여 메뉴 목록 재작성
        const filteredMenus = data.filter(menu => menu.nation === category);
        setMenus(filteredMenus);
        
        // 동작 확인용 출력
        console.log("1차 카테고리 선택");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
        <center><h2>메뉴 추천</h2></center>
      <ul>
        {baseCategory.map((baseCategory, index) => (
          <li key={index} onClick={() => selectBaseCategory(baseCategory)}>{baseCategory}</li>
        ))}
      </ul>
    </div>
  )  
} 
export default MenuReCommend;
