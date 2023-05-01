import { Configuration, OpenAIApi } from 'openai'
import Cors from 'cors'

const initMiddleware = (middleware) => (req, res) =>
  new Promise((resolve, reject) => {
    middleware(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })

const cors = Cors({
  methods: ['POST', 'OPTIONS'],
  origin: '*',
  allowedHeaders: ['Content-Type'],
})

const systemPrompt = `Sen bir metin özetleme aracısın. Sana girilen metinleri kısa bir şekilde özetleyeceksin. Özetlediğin metinler JSON formatında ve metnin konusundan çıkmayacak mantıklı bir biçimde olacak. Ve bunu sadece ama sadece JSON formatında yapacaksın. Formatta sadece "summary" kısmı olacak başka hiçbirşey olmayacak!`

export default async function handler(req, res) {
  await initMiddleware(cors)(req, res)

  const apiKey = req.body.apiKey ? req.body.apiKey : process.env.OPENAI_API_KEY
  const configuration = new Configuration({ apiKey })
  const openai = new OpenAIApi(configuration)

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: req.body.query,
        },
      ],
    })

    let response

    try {
      response = JSON.parse(completion.data.choices[0].message.content)
    } catch (e) {
      response = {
        error: true,
      }
    }
    res.status(200).json(response)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Bir hata oluştu. Lütfen tekrar deneyin.' })
  }
}
