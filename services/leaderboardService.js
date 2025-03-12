const db = require('../config/db');

class LeaderboardService {
  // ✅ 새로운 점수 저장 (saveScore)
  async saveScore(scoreData) {
    try {
      if (!scoreData.nickname || !scoreData.department || scoreData.similarity === undefined) {
        throw new Error("❌ 필수 데이터가 누락되었습니다.");
      }

      console.log("📥 Inserting new score:", scoreData);

      const query = `
        INSERT INTO score (nickname, department, similarity) 
        VALUES (?, ?, ?)
      `;

      const [result] = await db.promise().execute(query, [
        scoreData.nickname,
        scoreData.department,
        scoreData.similarity
      ]);

      console.log("✅ Score successfully saved with ID:", result.insertId);

      return { id: result.insertId, ...scoreData };
    } catch (error) {
      console.error("❌ Error saving score:", error.message);
      throw new Error("점수 저장 중 오류 발생: " + error.message);
    }
  }

  // ✅ 상위 점수 5개 조회 (getTopScores)
  async getTopScores() {
    try {
      console.log("🔍 Fetching top scores...");

      const [rows] = await db.promise().execute(
        'SELECT * FROM score ORDER BY similarity DESC LIMIT 5'
      );

      console.log("✅ Query successful, results:", rows);
      return rows;
    } catch (error) {
      console.error("❌ 점수 조회 중 오류 발생:", error);
      throw new Error('점수 조회 중 오류 발생: ' + error.message);
    }
  }

  // ✅ 특정 학과 상위 5개 점수 조회 (getTopScoresByDepartment)
  async getTopScoresByDepartment(department) {
    try {
      console.log(`🔍 Fetching top scores for department: ${department}`);

      const [rows] = await db.promise().execute(
        'SELECT * FROM score WHERE department = ? ORDER BY similarity DESC LIMIT 5',
        [department]
      );

      console.log("✅ Query successful, department results:", rows);
      return rows;
    } catch (error) {
      console.error("❌ 학과별 점수 조회 중 오류 발생:", error);
      throw new Error('학과별 점수 조회 중 오류 발생: ' + error.message);
    }
  }
}

module.exports = new LeaderboardService();
