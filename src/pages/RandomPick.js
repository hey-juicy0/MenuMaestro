// Card 빼고 다 임포트 하시면 됩니다.
import { useState, useRef, useEffect } from 'react';
import '../index.css'
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

Modal.setAppElement('#root');
// 데이더 읽기(get) 쓰기(set, ref), 업데이트(update)
// 자세한 건 파이어베이스 공식문서를 참고하시면 될거 같습니다. 
//https://firebase.google.com/docs/database/web/read-and-write?hl=ko 참고해주세요
import { getDatabase, ref, set, update } from "firebase/database";
import { useDatabase } from '../contexts';
import { onValue } from "firebase/database";
import {isEqual, getToday, getTodayReadable} from '../utils';

function initiateData() {
// **Firebase에 있는 데이터가 꼬이거나 초기화 시키고 싶을 경우 사용.
// **실제로 사용되지는 않고 디버그 하거나 개발할 때 사용하면 됩니다. 
  const db = getDatabase();
  
  const postData = [
    {   
      
      "name": "쌀국수",
      "type": "면",
      "lastVote": "2023-11-05",
      "url": "https://previews.123rf.com/images/lounom/lounom2002/lounom200200015/140498720",
      "vote": 0
    },
    {
      "name": "나시고랭",
      "type": "밥",
      "lastVote": "2023-11-05",
      "url": "https://d2w4my3xq5hp3v.cloudfront.net/image/goods/000/000/007/856/1.jpg?updated_at=20230508100736",
      "vote": 0
    },
    {
      "name": "똠양꿍",
      "type": "국물류",
      "lastVote": "2023-11-05",
      "url": "https://recipe1.ezmember.co.kr/cache/recipe/2020/07/02/1287260bdd49dd6b044b0174031b87db1.jpg",
      "vote": 0
    },
    {
      "name": "쏨땀",
      "type": "면",
      "lastVote": "2023-11-05",
      "url": "https://recipe1.ezmember.co.kr/cache/recipe/2021/11/29/e38ab22265c7fffb088acc91b494585b1.jpg",
      "vote": 0
    },
    {
      "name": "분짜",
      "type": "면",
      "lastVote": "2023-11-05",
      "url": "https://recipe1.ezmember.co.kr/cache/recipe/2021/08/22/33fef69beb75faf7bf6e3c9ce0a9a6d31.jpg",
      "vote": 0
    },
    {
      "name": "인도커리",
      "type": "밥",
      "lastVote": "2023-11-05",
      "url": "https://d2gfz7wkiigkmv.cloudfront.net/pickin/2/1/2/b38BExx9SQeHdJHv47AwHQ",
      "vote": 0
    },
    {
      "name": "탄두리치킨",
      "type": "육류",
      "lastVote": "2023-11-05",
      "url": "https://i.namu.wiki/i/0de_CCTSzHIpT8JPv-LMdBv0012IBVAYy9QH8hU80I9XDxjJ9z1HgLuaTwST1NLZEI0W-HfHyqAKzkxKJB3FNw.webp",
      "vote": 0
    },
    {
      "name": "케밥",
      "type": "육류",
      "lastVote": "2023-11-05",
      "url": "https://s3.ap-northeast-2.amazonaws.com/kh-mx/2/board_content_image/e93c5d1b-dd65-44ac-a983-920a1aa38602.jpg",
      "vote": 0
    },
    {
      "name": "필라프",
      "type": "밥",
      "lastVote": "2023-11-05",
      "url": "https://previews.123rf.com/images/lobachad/lobachad2103/lobachad210300333/165414271-%EC%83%A4%EC%9D%98-%ED%95%84%EB%9D%BC%ED%94%84-%EB%A0%88%EC%8A%8C%ED%86%A0%EB%9E%91%EC%9D%98-%EC%95%84%EC%A0%80%EB%B0%94%EC%9D%B4%EC%A7%94%EC%9D%80-%EC%B9%B8%EC%9D%98.jpg",
      "vote": 0
    },
    {
      "name": "팟타이",
      "type": "면",
      "lastVote": "2023-11-05",
      "url": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxODA3MjBfODgg%2FMDAxNTMyMDc5NDkzMTMw.jVyLwKZN6v5k0y3zrVYRwfdX3fnzKgmsoB9OJNTEmYIg.Dwrgm-9ETELmG99e0e6EJOrvY0fVZsVLsoFL6UzNnS0g.JPEG.msinvestment%2FIMG_0125_180227.jpg",
      "vote": 0
    },
 {
    "name": "볶음밥",
    "type": "밥",
    "lastVote": "2023-11-05",
    "url": "https://recipe1.ezmember.co.kr/cache/recipe/2022/12/11/4b2c829f7b82086cf42f851d961188801.jpg",
    "vote": 0
  },
  {
    "name": "짬뽕",
    "type": "면",
    "lastVote": "2023-11-05",
    "url": "https://img.siksinhot.com/seeon/1637896057710109.jpg",
    "vote": 0
  },
  {
    "name": "짜장면",
    "type": "면",
    "lastVote": "2023-11-05",
    "url": "https://cdn.paris.spl.li/wp-content/uploads/535370-파송송정통짜장면_썸네일2.png",
    "vote": 0
  },
  {
    "name": "탕수육",
    "type": "육류",
    "lastVote": "2023-11-05",
    "url": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA4MjhfMjIg%2FMDAxNjkzMjAzNjQ0NzM5.VZMYMf9dKHIL4-TJuwGY1s7jCVvJqFoOtLqPwT-qzXYg.yrWMp4IYk40JeHsoH2YSpx9w0u74_MGmfYRjgAaW97Ug.JPEG.pkga0827%2FIMG_4247.jpg&type=l340_165",
    "vote": 0
  },
  {
    "name": "칠리새우",
    "type": "해산물",
    "lastVote": "2023-11-05",
    "url": "https://ai.esmplus.com/foodjang01/images/221406877_b_1.jpg",
    "vote": 0
  },
  {
    "name": "양꼬치",
    "type": "육류",
    "lastVote": "2023-11-05",
    "url": "https://img1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/b4qa/image/kvKUsPEAd2jeQ1qBKeu3Mf9EAjs.jpg",
    "vote": 0
  },
  {
    "name": "마라탕",
    "type": "면",
    "lastVote": "2023-11-05",
    "url": "https://i.namu.wiki/i/qFWfOHBd0mx7NmNquwtaSbUjnPumXpk5oi1jxNKpWUsv_eGJe44xm9AePkbhQ6hIxTjMtroFaOFPbhBy0MSbNQ.webp",
    "vote": 0
  },
  {
    "name": "딤섬",
    "type": "기타",
    "lastVote": "2023-11-05",
    "url": "https://s3-ap-northeast-1.amazonaws.com/agreable-shoplink/item/templates/e07d857dc97043179c692e2a1526c5c5.jpg",
    "vote": 0
  },
  {
    "name": "깐풍기",
    "type": "육류",
    "lastVote": "2023-11-05",
    "url": "https://recipe1.ezmember.co.kr/cache/recipe/2015/10/25/47e8080f901ecc25a1f0e7947d2b1ee21.jpg",
    "vote": 0
  },
  {
    "name": "동파육",
    "type": "육류",
    "lastVote": "2023-11-05",
    "url": "https://cdn.imweb.me/upload/S201812245c2088d5a1502/ba1b9e3d30136.jpg",
    "vote": 0
  },
  {
    "name": "우육면",
    "type": "면",
    "lastVote": "2023-11-05",
    "url": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDZfMzYg%2FMDAxNjcwMzM4MDQ2NTQ2.DQwYcL8E5ry-Q_XXmbkufu-Qsj1tAWTUXjtk7KnqrVgg.soCr-QI3E81PPG9QzteNkW-4qmUXcv6cV42W3uQH2sEg.JPEG.s23180%2FIMG_6387.jpg&type=a340",
    "vote": 0
  },
    {
      "name": "피자",
      "type":"빵",
      "lastVote": "2023-11-05",
      "url": "https://dev-gopizza-homepage.s3.ap-northeast-2.amazonaws.com/ui/images/menu/detail/pizza/pizza3x2.webp",
      "vote": 0
    },
    {
      "name": "샐러드",
      "type":"기타",
      "lastVote": "2023-11-05",
      "url": "https://img.choroc.com/newshop/goods/024968/024968_1.jpg",
      "vote": 0
    },
    {
      "name": "파스타",
      "type":"면",
      "lastVote": "2023-11-05",
      "url": "https://static.wtable.co.kr/image/production/service/recipe/1767/8a70db02-325f-4dd0-9780-625a2e7cfefe.jpg",
      "vote": 0
    },
    {
      "name": "스테이크",
      "type":"육류",
      "lastVote": "2023-11-05",
      "url": "https://ai.esmplus.com/foodjang01/images/111000525_b_1.jpg",
      "vote": 0
    },
    {
      "name": "샌드위치",
      "type":"빵",
      "lastVote": "2023-11-05",
      "url": "https://cdn.paris.spl.li/wp-content/uploads/300538-디럭스-샌드위치_썸네일1.jpg",
      "vote": 0
    },
    {
      "name": "햄버거",
      "type":"빵",
      "lastVote": "2023-11-05",
      "url": "https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/9JDV/image/FQtSFWM_1h2TEwr0SgUqvE5X0ds.JPG",
      "vote": 0
    },
    {
      "name": "토스트",
      "type":"빵",
      "lastVote": "2023-11-05",
      "url": "https://static.wtable.co.kr/image/production/service/recipe/1134/06706e9b-9c6b-4487-a51e-32529f20b599.jpg",
      "vote": 0
    },
    {
      "name": "바비큐",
      "type":"육류",
      "lastVote": "2023-11-05",
      "url": "https://static.wtable.co.kr/image/production/service/recipe/872/3e8741b8-c824-49a7-bc78-7811cc3f258c.jpg?size=800x800",
      "vote": 0
    },
    {
      "name": "감바스",
      "type":"해산물",
      "lastVote": "2023-11-05",
      "url": "https://ientree.com/data/item/1629357625/1200.jpg",
      "vote": 0
    },
    {
      "name": "리조또",
      "type":"밥",
      "lastVote": "2023-11-05",
      "url": "https://img1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/Mtv/image/4PDY_vDw12Fr6q5H95pgh_f6pMA.jpg",
      "vote": 0
    },
    {
      "name": "떡볶이",
      "type":"기타",
      "lastVote": "2023-11-05",
      "url": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA3MjNfMTA5%2FMDAxNjkwMDgwMTE1ODU1.LGnR9fpgWzbAMclXS8GKhRFzo3IrobLF4xx08bCraNUg.kXlBf6T4ZAZgAdk9b1uT2w67bYtONT6p15sJJoNkgDYg.JPEG.rkdxodls0814k%2F20230722%25A3%25DF221718.jpg&type=a340",
      "vote": 0
    },
    {
      "name": "삼겹살",
      "type":"육류",
      "lastVote": "2023-11-05",
      "url": "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxNjEyMDhfMjIg%2FMDAxNDgxMTc4ODg2NjAy.LgD85VEg5JzNLJPxHyIYY2pGSMuoECviQZ3XZxA7Y6wg.62wGMItS-pEOYsJyJRCfiTH7LzPWwH55bvw4E2Q0hnAg.JPEG.ronba%2FDSC_7780.JPG&type=a340",
      "vote": 0
    },
    {
      "name": "김밥",
      "type":"밥",
      "lastVote": "2023-11-05",
      "url": "https://post-phinf.pstatic.net/MjAyMjA4MzFfNTIg/MDAxNjYxOTA2NzE5NDEw.Dx-9hbUlNbYwvo6VaBIBtsglCGMvpiLTMJGdKjPFTx4g.JcMlUoA2PLUULMkmBEEHg4yIUhrdIt5PLtDD-3azzAUg.JPEG/3.교남김밥_daily.autumn33님의_인스타그램.jpg?type=w800_q75",
      "vote": 0
    },
    {
      "name": "곱창",
      "type":"육류",
      "lastVote": "2023-11-05",
      "url": "https://thum.buzzni.com/unsafe/https://moa-commerce-product.s3-ap-northeast-1.amazonaws.com/2022-05-24/68d9acbe98144780ba4ffe390dbbfb60.jpg",
      "vote": 0
    },
    {
      "name": "불고기",
      "type":"육류",
      "lastVote": "2023-11-05",
      "url": "https://jiinfood.com/incfood/inc_go01-500.jpg",
      "vote": 0
    },
    {
      "name": "냉면",
      "type":"면",
      "lastVote": "2023-11-05",
      "url": "https://blog.kakaocdn.net/dn/btzZTc/btsgCjYCXcP/jAkVXXv1jLhojKCfs0Z56K/img.png",
      "vote": 0
    },
    {
      "name": "칼국수",
      "type":"면",
      "lastVote": "2023-11-05",
      "url": "https://static.wtable.co.kr/image/production/service/recipe/2189/2ffd0a90-95f9-47ce-8dfa-e87be42f834a.jpg?size=800x800",
      "vote": 0
    },
    {
      "name": "된장찌개",
      "type":"찌개",
      "lastVote": "2023-11-05",
      "url": "https://static.coupangcdn.com/image/retail/images/2019/02/19/10/8/454e800f-8663-462e-9100-31f69559b4fb.jpg?size=800x800",
      "vote": 0
    },
    {
      "name": "비빔밥",
      "type":"밥",
      "lastVote": "2023-11-05",
      "url": "https://contents.lotteon.com/itemimage/_v161250/LO/20/25/76/29/57/_2/02/57/62/95/8/LO2025762957_2025762958_1.jpg",
      "vote": 0
    },
    {
      "name": "김치찌개",
      "type":"찌개",
      "lastVote": "2023-11-05",
      "url": "https://mblogthumb-phinf.pstatic.net/MjAyMjA5MjhfMjE3/MDAxNjY0MzcxODc2MzQ5.DGjuCyj4uXXOe8BMST453zmtGSTFQ4y9zsfb3hHbGAQg.Z07CoO8C1Rty9SaiAssl_oCfaMU8wuH-K5vMWK5neTcg.JPEG.kyoungmik/SE-c0d162a1-3f29-11ed-8296-4f4d94366423.jpg?type=w800",
      "vote": 0
    },
    {
      "name": "초밥",
      "type":"밥",
      "lastVote": "2023-11-05",
      "url": "https://rimage.gnst.jp/rest/img/4xwxjx4z0000/s_0ndq.jpg?dt=1601018232",
      "vote": 0
    },
    {
      "name": "우동",
      "type":"면",
      "lastVote": "2023-11-05",
      "url": "https://thum.buzzni.com/unsafe/https://moa-commerce-product.s3-ap-northeast-1.amazonaws.com/2022-05-25/38270ee4a32c43dca4dfc11444931ba7.jpg",
      "vote": 0
    },
    {
      "name": "회",
      "type":"해산물",
      "lastVote": "2023-11-05",
      "url": "https://cdn.oasis.co.kr:48581/product/67624/thumb/thumb_676241ccc771c-af71-46e2-b21a-df1cf7602393.jpg",
      "vote": 0
    },
    {
      "name": "텐동",
      "type":"밥",
      "lastVote": "2023-11-05",
      "url": "https://mblogthumb-phinf.pstatic.net/MjAxODA3MjVfMTkz/MDAxNTMyNDYwNzYxNjE3.Y6XaY4Zc-rkd833WZfglnWDjwUkJ1v1kXl6jONgB-Y8g.Rc33Xsck2QRkNzccbZuvaCnrbGavZTltQwnueBqYgZwg.JPEG.dmsgur9122/2018년_07월_24일_신포동_온센_00.JPG?type=w800",
      "vote": 0
    },
    {
      "name": "라멘",
      "type":"면",
      "lastVote": "2023-11-05",
      "url": "https://www.noodlelovers.com/upload_data/WebEditor/20183923133904860232418.jpg",
      "vote": 0
    },
    {
      "name": "소바",
      "type":"면",
      "lastVote": "2023-11-05",
      "url": "https://pbs.twimg.com/media/DGwBMxNUAAEC7qQ.jpg",
      "vote": 0
    },
    {
      "name": "샤브샤브",
      "type":"육류",
      "lastVote": "2023-11-05",
      "url": "https://cdn-pro-web-228-183.cdn-nhncommerce.com/hanilsts_godomall_com/data/goods/21/03/11//1611641444/t50_modify_magnify_02.jpg",
      "vote": 0
    },
    {
      "name": "규동",
      "type":"육류",
      "lastVote": "2023-11-05",
      "url": "https://post-phinf.pstatic.net/MjAxNzA0MTNfMTgx/MDAxNDkyMDE1MTc1NjUw.1bGp5uR7er6rYCzO_5VLRr7QE5kZIOcSknEOCxV-Kgcg.-3XNvxLv3XzRQ6eAmkNcmFDLYvn9GXiIgZP9LrC9UrUg.JPEG/mug_obj_201704130139363960.jpg?type=w800_q75",
      "vote": 0
    },
    {
      "name": "규카츠",
      "type":"육류",
      "lastVote": "2023-11-05",
      "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjSv2BPYxxF2QCMxMyQ-7ddy8V5NBSHrZEmw&usqp=CAU",
      "vote": 0
    },
    {
      "name": "돈까스",
      "type":"육류",
      "lastVote": "2023-11-05",
      "url": "https://static.wtable.co.kr/image/production/upload/123973020/styles/32241/dc080aca-5864-4aca-bb22-edaf4ec8cdb7.jpg?size=800x800",
      "vote": 0
    }
  ]
  
  // 업데이트할 내용을 담을 객체 > updatas
  const updates = {};
  // postData배열에 담긴 데이터를 데이터베이스에 업데이트
  updates['/menus'] = postData;
  // 실제 데이터에 접근할 db에 대한 참조를 생성하고 ref(db), /menus경로에 postData배열을 업데이트 시킴!
  return update(ref(db), updates);
} // ~ 최초 데이터 구성 함수


function RandomRick({ userPick, setUserPick }) {
  // 모든 컴포넌트에서 database를 사용해야하는 경우를 대비해 ContextProvider에 database 상태를 두고 관리 중.
  const {database} = useDatabase();
  // database 객체를 사용하여 menus 경로에 참조를 만듬 > 접근 가능
  // Firebase에서 데이터를 읽어오는 부분으로 menusRef라는 변수명도 무방
  const newMenuRef = ref(database, 'menus');
  // menus안의 값들이 변경되서 상태변수로 잡음
  const [menus, setMenus] = useState([]);
  // currentMenu는 랜덤함수에 따라 계속 상태가 바뀜 잘 기억
  const [currentMenu, setCurrentMenu] = useState({});
  // console.log(lastMenuNameRef) > 초기값은 ' ' 이 상태임 시작버튼시 > current채워짐 / last: { current : ' '}
  const lastMenuNameRef = useRef('');
  const [modalIsOpen, setModalIsOpen] = useState(true);

  // 유저가 따봉 버튼을 눌러서 db에 있는 vote값을 변경할 예정
  const upvote = () => {
    // 현재의 골라진 음식의 인덱스 번호 저장 ex) 쏨땀은 3을 저장
    const targetMenuIndex= menus.findIndex(menu => menu.name === currentMenu.name)

    // 골라진 메뉴의 vote부분만 +1 더할거임
    //기존 데이터 > currentMenu = {lastVote : "2023-11-05", name : "쏨땀" ... , vote: 0 > 1로 변경}
    const updated = {...currentMenu, vote: currentMenu.vote+1}
    // 원본을 건드리면 안되기 때문에 덮어쓰기 위한 새로운 배열 생성
    const newMenus = [...menus];
    // 골라진 음식의 인덱스 번호를 업데이트된걸로 변경 targetMenuIndex=3, 
    newMenus.splice(targetMenuIndex, 1, updated)
    // /munus에 있는 database를 newMenus데이터로 덮어쓰기
    set(ref(database, '/menus'), newMenus);
  }

// 2개로 나뉘는데 바로 아래는 vote관련 기능입니다. 더 아래꺼는 랜덤 메뉴 하나 뽑기 기능 입니다.
  // 1번 vote와 lastVote 수정 data->menus / force> true or false 
const pickCurrentMenu = ({data, force}) => {
    // vote만 올리기
    if (!force && lastMenuNameRef.current !== '') {
      // 현재 화면에 출력된 메뉴의 데이터 객체를 저장 = {lastVot:"2023-11-05", name:"쏨땅"...}
      const targetMenu= menus.find(menu => menu.name === currentMenu.name)
      if (targetMenu) {
        // 2023-11-05 !== 2023-11-06 > 업데이트할 필요가 있습니다!
        if (getToday() !== targetMenu.lastVote){
          //CurrentMenu를 접근하기 위해 상태함수사용, 다른 날이기 때문에 vote수를 초기화 하고 +1
          setCurrentMenu(menu => ({...menu, lastVote: getToday(), vote: 1}));
          console.log("vote+1");
          
        } else {
          // 쏨땀이라는 객체값에서 투표수를 하나 증가시킴 (같은 날에 투표 한 상황)
          setCurrentMenu(menu => ({...menu, vote: targetMenu.vote+1}));
          console.log("vote+1");
        }
      }
      return;
    }
    // 2번 랜덤 함수를 통해서 음식 하나 뽑기
    // 배열 크기에 맞는 랜덤 숫자 생성 data -> menus[{}, {}, {}....]
    const randomKey = Math.floor(Math.random() * data.length);

    // 3번이 뽑혔다고 하고 data[3] = {lastVote:"2023-11-05" ...}
    const selectedObject = data[randomKey];
    // 1.) "쏨땀"=="쏨땀" 같으면 처음 위치로 가서 다시 난수 생성
    //2.) 만약 랜덤으로 뽑은 메뉴가 마지막에 뽑은 메뉴와 같다면 다시 랜덤으로 다시 난수 생성
    if (lastMenuNameRef.current === selectedObject.name) {
      pickCurrentMenu({data, force});
      return;
    }
    // 똠양꿍 == 쏨땅 일시 > 선택된 쏨땀을 lastMenuNameRef에 넣어줍니다.
    lastMenuNameRef.current = selectedObject.name;
    // 선택된 메뉴는 상태변수이기 때문에 저장시키겠습니다.
    setCurrentMenu(selectedObject);
  } // ~ pickCurrentMenu끝

  
    //  Firebase에서 데이터 업데이트를 감지하면 아래 코드가 실행이 되면서 menus, currentMenu 상태가 변경됩니다.
    // 랜덤으로 음식하나 띄워놓고 해당 음식의 정보를 변경해보시면 실시간으로 변하는 것을 보실 수 있을겁니다
    // but 이유를 모르겠으나 실시간으로 변경되지 않네요..
  onValue(newMenuRef, (snapshot) => {
    // data는 변경된 데이터를 포함한 전체의 menus가 담김
    const data = snapshot.val();
    if (!data) {
      alert('메뉴가 없습니다. 메뉴를 추가해주세요.');
      return;
    }
    // 변경된 menus인 data와 원래의 menus를 비교
    if (isEqual(data, menus)) return;
    // 변경이 된거라면 setMenus를 상용하여 업데이트 시킴
    setMenus(data);
    // 변경된 data를 기반으로 위 함수를 실행시킴 
    pickCurrentMenu({data, force: false});
  });

  const closeModal = () => {
    setModalIsOpen(false);
  }

  useEffect(() => {
    setModalIsOpen(true);
  }, []);

  // start 버튼 누르면 show컴포넌트가 보여짐
  return (
    <>
    <Modal
    isOpen = {modalIsOpen}
    contentLabel='모달'
    className= 'Modal'>
        <div className = "modal_title">랜덤</div>
        <button className = "rectangle" onClick={closeModal}>시작</button>
        <Link to = "/">
        <img className='reject' src = "https://i.ibb.co/YZbWQM5/reject.png"></img>
        </Link>
    </Modal>
      <h1 className='section_title'>랜덤</h1>
      <div className="dotted-line-container">
        <div className="dotted-line" />
        {/* 투표는 건드리지 않고 난수만 다시 뽑아서 음식을 선택해주는 리셋 버튼 */}
        <img className = 'reset' src="https://i.ibb.co/yRggpzD/reset.png" onClick={() => pickCurrentMenu({ data: menus, force: true })} alt="reset" />
      </div>
      <div className='card_frame'>
        <div className="card_card">
          <img className="card_image" src={currentMenu.url} alt={currentMenu.name} />
          <p className="card_text">{currentMenu.name}</p>
        </div>
      </div>
      <p className="random-menu-description">
        오늘({getTodayReadable()}) {currentMenu.vote}회의 추천을 받았습니다 &nbsp;
        <img className= 'vote' src = "https://i.ibb.co/4VXmN4x/like-1.png" width={"40px"} onClick={upvote}/>
      </p>
    </>
  );
} // ~~ RandomPick 끝
export default RandomRick;