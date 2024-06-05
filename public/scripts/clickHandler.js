document.getElementById('clickableImage').addEventListener('click', async function() {
  const classId = '1학년 1반';  // 예를 들어 사용자가 속한 반의 정보
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
    } else {
      throw new Error('클릭 데이터 저장 실패');
    }
  } catch (error) {
    console.error('클릭 데이터 저장 중 에러 발생:', error);
  }
});
