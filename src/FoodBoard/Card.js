//카드 컴포넌트
import React from "react";
import Modal from 'react-modal';
import { useState } from "react";
import Card from 'react-bootstrap/Card';

const FoodCard = ( {src = "https://via.placeholder.com/300x200", title="맛있는 간식", detail="...", date="..."} ) => {
const [modalIsOpen, setModalIsOpen] = useState(false);   

const openModal = () => {
  setModalIsOpen(true);
};

const closeModal = () => {
  setModalIsOpen(false);
};

return (
        <div> 
            <center>

            <Card className="text-center" onClick={openModal} style={{ width: '400px', height: '400px' }}>
        <Card.Body>
          <Card.Title><img className="random-current-menu-image" src={src} alt="..." style={{ width: '100%', height: '300px' }} /></Card.Title>
          <Card.Text>{title}</Card.Text>
        </Card.Body>
      </Card>

                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} >
                <center><h2>{title}</h2>
              <p>{detail}</p>
              <p>{date}</p>
              <button onClick={closeModal}>닫기</button>
              </center>
                </Modal>
            </center>
              </div>
              
    )
}

export default FoodCard;