import React, { useEffect } from 'react';

function Rankings() {
  useEffect(() => {
    fetchRankings();
  }, []);

  async function fetchRankings() {
    const response = await fetch('/api/getClicks');
    if (response.ok) {
      const { data } = await response.json();
      updateRankingTable(data);
    } else {
      console.error('Failed to fetch rankings');
    }
  }

  function updateRankingTable(rankings) {
    const table = document.getElementById('rankingTable');
    table.innerHTML = '';
    rankings.forEach(rank => {
      const row = table.insertRow();
      row.insertCell(0).textContent = rank.classId;
      row.insertCell(1).textContent = rank.clickCount;
    });
  }

  return (
    <div>
      <h1>Rankings</h1>
      <table id="rankingTable">
        <thead>
          <tr>
            <th>Class</th>
            <th>Click Count</th>
          </tr>
        </thead>
        <tbody>
          {/* Table rows will be inserted here */}
        </tbody>
      </table>
    </div>
  );
}

export default Rankings;
