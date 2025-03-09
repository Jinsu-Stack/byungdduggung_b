const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'https://byungdduggungf.web.app/', // Allow all domains (or set this to your frontend URL later)
  methods: "GET,POST",
  allowedHeaders: "Content-Type"
}));

app.use(express.json());

// 라우터 불러오기
const scoreRoutes = require('./routes/scores');

// 라우터 설정
app.use('/api', scoreRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 