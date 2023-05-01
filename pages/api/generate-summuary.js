import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const systemPrompt = `Sen bir metin özetleme aracısın. Sana girilen metinleri kısa bir şekilde özetleyeceksin. Özetlediğin metinler JSON formatında ve metnin konusundan çıkmayacak mantıklı bir biçimde olacak. Ve bunu sadece ama sadece JSON formatında yapacaksın. Formatta sadece "summary" kısmı olacak başka hiçbirşey olmayacak!`;

export default async function handler(req, res) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: req.body.query,
      },
    ],
  });

  let response;

  try {
    response = JSON.parse(completion.data.choices[0].message.content);
  } catch (e) {
    response = {
      error: true,
    };
  }
  res.status(200).json(response);
}
