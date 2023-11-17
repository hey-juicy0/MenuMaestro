// import React, { useState, useEffect } from 'react';
// import { Link, Route, Routes, useParams } from 'react-router-dom';
// import { ref, get, update } from 'firebase/database';
// import { useDatabase } from '../contexts';

// import '../css/category.css'

// function SubCategory({ menus, selectSubCategory }) {
//     const { baseCategory } = useParams();
//     const [subMenus, setSubMenus] = useState([]);

//     const decodedCategory = decodeURIComponent(baseCategory);

//     useEffect(() => {
//         const filteredMenus = baseCategory === "상관없음" ? menus : menus.filter(menus => menus.type === baseCategory);
//         console.log("Filtered Menus: ", filteredMenus);
//         setSubMenus(filteredMenus);
//     }, [menus, decodedCategory]);

    
//   // 2차 카테고리 선택: 음식 종류
//   const selectSubCategory = (category) => {
//     setSelectedCategory(category);
      
//     if(menus.length > 0) { // 1차 카테고리 선택에 맞추어 메뉴 필터링
//         // 해당 카테고리(type)에 맞는 메뉴들만 필터링하여 메뉴 목록 재작성
//         selectedMenu = menus.filter(menus => menus.type === category);
//         setMenus(selectedMenu);
//     }

//     consolg.log("2차 카테고리 선택 확인");
//   }
//     return (
//         <div>
//             <ul>{subMenus.map((menu, index) => ( 
//                 <li key={index}>{menu.name}</li>))}</ul>
//         </div>
//     )


    
// }

// export default SubCategory;