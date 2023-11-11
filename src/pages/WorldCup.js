import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { useDatabase } from '../contexts';
import '../css/worldcup.css';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

const WorldCup = () => {
  const { database } = useDatabase();
  const [round, setRound] = useState(16);
  const [teams, setTeams] = useState([]);
  const [displays, setDisplays] = useState([]);
  const [winners, setWinners] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const menusRef = ref(database, 'menus');
        onValue(menusRef, (snapshot) => {
          if (snapshot.exists()) {
            const menusData = snapshot.val();
            const shuffledItems = Object.values(menusData).sort(() => Math.random() - 0.5);

            setTeams(shuffledItems.slice(0, 16));
            setDisplays([shuffledItems[0], shuffledItems[1]]);
          }
        });
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };

    fetchMenus();
  }, [database]);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const clickWinner = (team) => () => {
    if (round <= 1) {
      return; // Stop the world cup if the final is reached
    }
    if (round === 2) {
      setRound(1);
    }

    if (teams.length <= 2) {
      if (winners.length === 0) {
        setDisplays([team]);
      } else {
        const updatedTeams = [...winners, team];
        setTeams(updatedTeams);
        setDisplays([updatedTeams[0], updatedTeams[1]]);
        setWinners([]);
        setRound((prevRound) => prevRound / 2);
      }
    } else if (teams.length > 2) {
      setWinners([...winners, team]);
      setDisplays([teams[2], teams[3]]);
      setTeams(teams.slice(2));
    }
  };

  // Open the modal automatically when round is 1
  useEffect(() => {
    if (round === 1) {
      setModalIsOpen(true);
    }
  }, [round]);

  return (
    <>
    <Modal
    isOpen = {modalIsOpen}
    contentLabel='모달'
    className= 'Modal'>
      <div className='overlap-group' onClick={closeModal}>
        <div className='rectangle'></div>
        <div className='text-wrapper'>시작</div>
      </div>
      <Link to = "/">
    <img className='reject' src = "https://i.ibb.co/YZbWQM5/reject.png"></img>
    </Link>
    <div class="modal_worldcup">월드컵</div>
    </Modal>
      <h1 className="worldcup_title">월드컵</h1>
      <div className="dotted-line-container">
        <div className="dotted-line" />
        {/* 투표는 건드리지 않고 난수만 다시 뽑아서 음식을 선택해주는 리셋 버튼 */}
      </div>
      {round === 16 && <div className="worldcup_round"><p>16강</p></div>}
      {round === 8 && <div className="worldcup_round"><p>8강</p></div>}
      {round === 4 && <div className="worldcup_round"><p>4강</p></div>}
      {round === 2 && <div className="worldcup_round"><p>결승</p></div>}
      <div className="worldcup_frame">
        {displays.map((team) => (
          <div className="worldcup_card" key={team.name} onClick={clickWinner(team)}>
            <img className="worldcup_image" src={team.url} alt={team.name} />
            <p className="worldcup_text">{team.name}</p>
          </div>
        ))}
        <p className="vs">VS.</p>
      </div>
      {/* Automatically open the modal when round is 1 */}
      {round === 1 && (
        <>
          <p className="worldcup_round">우승</p>
          <Modal
            isOpen={modalIsOpen}
            contentLabel='Final Modal'
            className='Modal'
            style={{
              overlay: {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#2CCEC9'
              }
            }}
          >
            <div className='overlap-group' onClick={closeModal}>
              <div className='rectangle'></div>
              <div className='text-wrapper'>확인</div>
            </div>
            <Link to="/">
              <img className='reject' src="https://i.ibb.co/YZbWQM5/reject.png"></img>
            </Link>
            <div class="modal_worldcup">월드컵 결과</div>
          </Modal>
        </>
      )}
    </>
  );
};

export default WorldCup;
