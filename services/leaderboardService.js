const db = require('../config/db');
const CryptoJS = require('crypto-js');

const AES_KEY = 'c69d6e5dfac54cf4a7cb8f912b71a6eb5df8c8a7c9f28f3a88939f6f1a7d1c9d';

// AES 복호화 함수
function decryptAES(cipherTextBase64) {
  const key = CryptoJS.enc.Hex.parse(AES_KEY); // 키를 hex로 파싱
  const decrypted = CryptoJS.AES.decrypt(cipherTextBase64, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

class LeaderboardService {
  // ✅ 새로운 점수 저장
  async saveScore(scoreData) {
    console.log(1);

    // 🔐 similarity 복호화 후 숫자로 변환
    const decryptedSimilarity = parseFloat(decryptAES(scoreData.similarity));
    if (isNaN(decryptedSimilarity)) {
      throw new Error("❌ 복호화된 similarity 값이 숫자가 아닙니다.");
    }

    console.log(scoreData.similarity);
    console.log(decryptedSimilarity);

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
        decryptedSimilarity
      ]);

      console.log("✅ Score successfully saved with ID:", result.insertId);

      return { id: result.insertId, nickname: scoreData.nickname, department: scoreData.department, similarity: decryptedSimilarity };
    } catch (error) {
      console.error("❌ Error saving score:", error.message);
      throw new Error("점수 저장 중 오류 발생: " + error.message);
    }
  }

  // ✅ 전체 상위 5개 점수 조회
  async getTopScores() {
    try {
      console.log("🔍 Fetching top scores...");
      console.log("FuckingConsoleWontShutUp");

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

  // ✅ 학과별 상위 5개 점수 조회
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
