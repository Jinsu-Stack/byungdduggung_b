const db = require('../config/db');

class LeaderboardService {
  // 상위 점수 5개 조회
  async getTopScores() {
    try {
      console.log("🔍 Fetching top scores..."); // Debug log

      const [rows] = await db.execute(
        'SELECT * FROM score ORDER BY similarity DESC LIMIT 5'
      );

      console.log("✅ Query successful, results:", rows); // Debug log
      return rows;
    } catch (error) {
      console.error("❌ 점수 조회 중 오류 발생:", error);
      throw new Error('점수 조회 중 오류 발생: ' + error.message);
    }
  }


  // 전체 상위 5개 점수 조회
  async getTopScores() {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM score ORDER BY similarity DESC LIMIT 5'
      );
      return rows;  // 자동으로 JSON으로 변환됨
    } catch (error) {
      throw new Error('점수 조회 중 오류 발생: ' + error.message);
    }
  }

  // 특정 학과 상위 5개 점수 조회
  async getTopScoresByDepartment(department) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM score WHERE department = ? ORDER BY similarity DESC LIMIT 5',
        [department]
      );
      return rows;  // 자동으로 JSON으로 변환됨
    } catch (error) {
      throw new Error('학과별 점수 조회 중 오류 발생: ' + error.message);
    }
  }
}

module.exports = new LeaderboardService();