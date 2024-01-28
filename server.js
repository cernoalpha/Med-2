const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;


app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const{imageAi}= require("./services/imageAI")

app.post('/upload', upload.array('files', 50),imageAi)

app.get('/health', (req, res) => {
    res.status(200).contentType('text/plain').send('Server Shaddy Med is healthy 😀🥳');
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});