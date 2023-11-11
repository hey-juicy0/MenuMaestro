import React from 'react';
import '../css/memberinfo.css'
function MemberInfo(){
    return (
      <div className='box'>
        <div className="info_text">운영 단원 소개</div>
        <div className="members">
          <div className='row1'>
          <img className="박준희" src="https://i.ibb.co/PNf15Ms/1.png" />
          <img className="임지우" src="https://i.ibb.co/QdBd2fP/2.png" />
        </div>
        <div className='row2'>
          <img className="우영범" src="https://i.ibb.co/bz4QmRX/3.png" />
          <img className="박유진" src="https://i.ibb.co/C2kh6MQ/4.png" />
          </div>
        </div>
      </div>
    );
  }

export default MemberInfo;