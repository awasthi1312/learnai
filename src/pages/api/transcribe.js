import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), 'uploads');
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the files' });
      return;
    }

    const audioFile = files.file.path;
    const audioData = fs.readFileSync(audioFile);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    try {
      const aiResponse = await openai.transcriptions.create({
        model: 'whisper-1',
        file: audioData,
      });

      res.status(200).json({ transcription: aiResponse.text });
    } catch (error) {
      res.status(500).json({ error: 'Transcription failed' });
    } finally {
      fs.unlinkSync(audioFile);
    }
  });
};

export default handler;
