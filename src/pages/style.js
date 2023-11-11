import React, { useState, useEffect } from "react";
import { FlexBox } from "./style";
import { ref, onValue } from "firebase/database";
import { useDatabase } from '../contexts';

const Game = () => {
  const { database } = useDatabase();
  const [round, setRound] = useState(16);
  const [teams, setTeams] = useState([]);
  const [displays, setDisplays] = useState([]);
  const [winners, setWinners] = useState([]);

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
  

  const clickHandler = (team) => () => {
    if (round <= 1) {
      return; // Stop the game if the final is reached
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

  return (
    <FlexBox>
      <h1 className="title">Favorite Worldcup</h1>
      {round === 8 && <div><p>8강</p></div>}
      {round === 4 && <div><p>4강</p></div>}
      {round === 2 && <div><p>결승</p></div>}
      {round === 1 && <div><p>우승</p></div>}
      {displays.map((team) => {
        return (
          <div className="flex-1" key={team.name} onClick={clickHandler(team)}>
            <img className="food-img" src={team.url} alt={team.name} />
            <div className="name">{team.name}</div>
          </div>
        );
      })}
    </FlexBox>
  );
};

export default Game;
