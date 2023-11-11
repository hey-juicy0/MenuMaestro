import React, { useState, useEffect } from 'react';
import './FoodBoard.css';
import Modal from 'react-modal';

const AddButton = function ({ onNewColor = f => f }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [detailValue, setDetailValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      const currentDate = new Date().toISOString().slice(0, 10);
      setDateValue(currentDate);
    }
  }, [isModalOpen]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = () => {
    onNewColor(titleValue, detailValue, dateValue, urlValue);
    setTitleValue("");
    setDetailValue("");
    setDateValue("");
    setUrlValue("");
    setImagePreview("");
    closeModal();
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
    const imageUrl = e.target.value;
    setUrlValue(imageUrl);

    if (imageUrl.startsWith("http") || imageUrl.startsWith("https")) {
      setImagePreview(imageUrl);
    } else {
      setImagePreview("");
    }
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
                <td>{imagePreview && (
                  <img
                    src={imagePreview}
                    alt="이미지 미리보기"
                  />
                )}</td>
              </tr>
              <tr>
                <th>날짜</th>
                <td>
                  <input
                    id="date"
                    type="text"
                    value={dateValue}
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
