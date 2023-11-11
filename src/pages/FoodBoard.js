import AddButton from "../FoodBoard/AddButton";
import DateList from "../FoodBoard/DateList";
import { useState, useEffect } from "react";
import { get, ref, push } from "firebase/database";
import { useDatabase } from "../contexts";

function FoodBoard() {

   const { database } = useDatabase();
   const dbRef = ref(database, 'foodboard');
   const [menus, setMenus] = useState([]);

 
   useEffect(() => {
    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const dataArray = Object.values(data);
        setMenus(dataArray);
        //console.log(dataArray)
      } else {
        setMenus([]);
      }
    });
  }, []);



  const handleNewColor =(titleValue, detailValue, dateValue, urlValue) => {
    const newMenu = 
      {
        title: titleValue,
        detail: detailValue,
        date: dateValue,
        src: urlValue
      };
    const newMenuRef = push(ref(database, 'foodboard'), newMenu);

    console.log("새로 생성된 데이터의 키:", newMenuRef.key);
    
  };

  return (
    <div style={{ marginTop: '50px' }}>
    <center>
    <h1>단원 게시판</h1>
    <div class="dotted-line" />
    </center>
      <AddButton onNewColor={handleNewColor} />
      <DateList
        data={menus.sort((a, b) => new Date(b.date) - new Date(a.date))}
      />
    </div>
  );
}

export default FoodBoard;
