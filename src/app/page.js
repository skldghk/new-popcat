"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

const classes = {
  1: [1, 2, 3, 4, 5],
  2: [1, 2, 3, 4, 5],
  3: [1, 2, 3, 4, 5],
  4: [1, 2, 3, 4, 5],
  5: [1, 2, 3, 4, 5, 6],
  6: [1, 2, 3, 4, 5, 6],
};

const generateInitialRankings = () => {
  let initialRankings = [];
  for (let grade in classes) {
    classes[grade].forEach((classNumber) => {
      initialRankings.push({
        class: `${grade}학년 ${classNumber}반`,
        clickCount: 0,
      });
    });
  }
  return initialRankings;
};

export default function Home() {
  const [grade, setGrade] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [rankings, setRankings] = useState(generateInitialRankings());
  const [isKeyPressed, setIsKeyPressed] = useState(false);

  const fetchRankings = async () => {
    try {
      const response = await axios.get('/api/getClicks');
      const storedRankings = response.data.data;
      const updatedRankings = generateInitialRankings().map((ranking) => {
        const storedRanking = storedRankings.find((r) => r.class === ranking.class);
        return storedRanking ? { ...ranking, clickCount: storedRanking.clickCount } : ranking;
      });
      updatedRankings.sort((a, b) => b.clickCount - a.clickCount);
      setRankings(updatedRankings);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  const handleGradeChange = (event) => {
    setGrade(event.target.value);
    setSelectedClass(null); // 반 초기화
  };

  const handleClassClick = (classNumber) => {
    setSelectedClass(classNumber);
  };

  const handleButtonClick = async () => {
    if (grade && selectedClass) {
      const classId = `${grade}학년 ${selectedClass}반`;

      setIsMouthOpen(true);
      setTimeout(() => {
        setIsMouthOpen(false);
      }, 200); // 200ms 후에 다시 입을 닫음

      try {
        const response = await fetch('/api/click', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ classId })
        });
        if (response.ok) {
          console.log("클릭 데이터가 성공적으로 저장되었습니다.");

          // 순위 업데이트
          setRankings((prevRankings) => {
            const updatedRankings = prevRankings.map((ranking) => {
              if (ranking.class === classId) {
                return { ...ranking, clickCount: ranking.clickCount + 1 };
              }
              return ranking;
            });
            updatedRankings.sort((a, b) => b.clickCount - a.clickCount);
            return updatedRankings;
          });
        } else {
          throw new Error('클릭 데이터 저장 실패');
        }
      } catch (error) {
        console.error('클릭 데이터 저장 중 에러 발생:', error);
      }
    } else {
      alert('학년과 반을 선택하세요.');
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isKeyPressed && grade && selectedClass) {
        handleButtonClick();
        setIsKeyPressed(true);
      }
    };

    const handleKeyUp = (event) => {
      setIsKeyPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [grade, selectedClass, isKeyPressed]);

  useEffect(() => {
    const saveClicksToDB = async () => {
      try {
        await axios.post('/api/saveClicks', { clicks: rankings });
      } catch (error) {
        console.error('Error saving clicks to DB:', error);
      }
    };

    const interval = setInterval(() => {
      saveClicksToDB();
    }, 1000); // 1초마다 저장

    return () => clearInterval(interval);
  }, [rankings]);

  return (
    <div style={styles.container}>
      {grade && selectedClass && (
        <div style={styles.selectedInfo}>
          {grade}학년 {selectedClass}반
        </div>
      )}
      {!grade || !selectedClass ? (
        <div style={styles.selector}>
          <h1>학년을 선택하세요</h1>
          <select onChange={handleGradeChange} value={grade || ''} style={styles.select}>
            <option value="" disabled>
              학년 선택
            </option>
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <option key={g} value={g}>
                {g}학년
              </option>
            ))}
          </select>

          {grade && (
            <div>
              <h2>{grade}학년</h2>
              <div style={styles.buttonsContainer}>
                {classes[grade].map((classNumber) => (
                  <button
                    key={classNumber}
                    onClick={() => handleClassClick(classNumber)}
                    style={{
                      ...styles.button,
                      backgroundColor: selectedClass === classNumber ? '#0070f3' : '#ccc',
                    }}
                  >
                    {classNumber}반
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={styles.mainContent}>
          <div style={styles.rankingsContainer}>
            <div style={styles.rankings}>
              <h2>순위표</h2>
              <ol>
                {rankings.map((r, index) => (
                  <li key={index}>
                    {r.class}: {r.clickCount}회
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div style={styles.result}>
            <div style={styles.imageContainer} onClick={handleButtonClick}>
              <img
                id="clickableImage"
                src={isMouthOpen ? "/popcat-2.png" : "/popcat.png"}
                alt="Popcat"
                style={styles.image}
                draggable="false" // 드래그 방지
                onDragStart={(e) => e.preventDefault()} // 드래그 방지
              />
              <div style={styles.counter}>{rankings.find(r => r.class === `${grade}학년 ${selectedClass}반`)?.clickCount || 0}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  selectedInfo: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  selector: {
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    margin: '20px 0',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    margin: '5px',
    padding: '10px 20px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  mainContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  result: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center', // 중앙 정렬
    alignItems: 'center', // 중앙 정렬
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
  },
  image: {
    width: '300px',
    height: '300px',
    borderRadius: '10px',
  },
  counter: {
    position: 'absolute',
    top: '10px', // 이미지 위에 위치하도록 조정
    left: '50%',
    transform: 'translate(-50%, 0)',
    fontSize: '48px',
    color: '#000', // 검은색으로 변경
    fontWeight: 'bold',
  },
  rankingsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '200px', // 순위표의 넓이를 줄임
    position: 'absolute',
    left: '20px',
  },
  rankings: {
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
  },
};
