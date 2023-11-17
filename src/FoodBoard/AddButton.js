import React, { useState, useEffect } from 'react';
import './FoodBoard.css';
import Modal from 'react-modal';

const AddButton = function({ onNewColor = f => f }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [detailValue, setDetailValue] = useState("");
  let [dateValue, setDateValue] = useState("");
  const [urlValue, setUrlValue] = useState("");

  useEffect(() => {
    // 컴포넌트가 마운트될 때 모달이 열릴 때 감춰질 요소 설정
    Modal.setAppElement('#modal-root');
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = () => {
    if (!titleValue) {
      alert("제목을 입력하세요!");
      return;
    }
    else if(!urlValue){
      alert("이미지 URL을 입력하세요!");
      return;
    }
    // 제출 버튼이 클릭되었을 때 수행할 작업 추가
    dateValue = document.getElementById("date").value;
  console.log("Title:", titleValue);
  console.log("Detail:", detailValue);
  console.log("Date:", dateValue);
  onNewColor(titleValue, detailValue, dateValue, urlValue);
  setTitleValue("");
  setDetailValue("");
  setDateValue("");
  closeModal(); // 모달 닫기

  // 페이지 새로고침
  window.location.reload();
  };

  const handleTitleChange = (e) => {
    setTitleValue(e.target.value);
  };

  const handleDetailChange = (e) => {
    setDetailValue(e.target.value);
  };

  const handleDateChange = (e) => {
    setDateValue(e.target.value);
  };
  const handleUrlChange = (e) => {
    setUrlValue(e.target.value);
  };
  const getCurrentDate = () =>
  {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    

    /*
    if (hours >= 12) {
      hours = (hours - 12).toString().padStart(2, '0');
      return `${year}-${month}-${day} 오후 ${hours}:${minutes}:${seconds}`;
    } else {
      // 오전인 경우
      return `${year}-${month}-${day} 오전 ${hours}:${minutes}:${seconds}`;
    }
    */

    return `${year}-${month}-${day}`;
  };

  return (
    <div id="Foodboard">
      <button className="fixed-button" onClick={openModal}>
        글쓰기
      </button>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} id="boardModal">
        <center>
          <h1 style={{ textAlign: 'center' }}>글쓰기</h1>
          <hr></hr>
          <table id="boardTable">
            <tbody>
              <tr>
                <th>메뉴 이름 *</th>
                <td>
                  <input
                    id="title"
                    type="text"
                    placeholder="메뉴 이름을 적어주세요."
                    value={titleValue}
                    onChange={handleTitleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>내용</th>
                <td>
                  <textarea
                    id="detail"
                    rows={3}
                    type="text"
                    placeholder="내용을 입력하세요."
                    value={detailValue}
                    onChange={handleDetailChange}
                  />
                </td>
              </tr>
              <tr>
                <th>이미지 URL *</th>
                <td>
                  <input
                    id="url"
                    type="text"
                    placeholder="사진 URL 첨부"
                    value={urlValue}
                    onChange={handleUrlChange}
                  />
                </td>
              </tr>
              <tr>
                <th>이미지 미리보기</th>
                <td>
                  <img
                    src= {urlValue}
                    alt="이미지 미리보기"
                  />
                  </td>
              </tr>
              <tr>
                <th>날짜</th>
                <td>
                  <input
                    id="date"
                    type="text"
                    value={getCurrentDate()}
                    onChange={handleDateChange}
                    disabled
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <button onClick={handleSubmit}>업로드</button>
            <img className='reject_board' src="https://i.ibb.co/YZbWQM5/reject.png" onClick={closeModal} />
          </div>
        </center>
      </Modal>
    </div>
  );
};

export default AddButton;
