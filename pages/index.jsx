import { useState } from 'react'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [summaries, setSummaries] = useState([])
  const [apiKey, setApiKey] = useState('')

  const submitHandle = (e) => {
    e.preventDefault()
    setLoading(true)
    fetch('/api/generate-summuary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, apiKey }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false)
        setSummaries([
          ...summaries,
          {
            key: `summary-${summaries.length}`,
            name: `Özet ${summaries.length + 1}`,
            summary: res.summary,
            originalText: query,
          },
        ])
        setQuery('')
        document.getElementById('input-textarea').style.height = 'auto'
        if (loading) {
          document.getElementById('input-textarea').style.height = '225px'
        }
      })
      .catch((err) => console.log(err))
    setQuery('')
  }

  const handleTextAreaChange = (e) => {
    setQuery(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  const handleClearSummaries = () => {
    setSummaries([])
  }

  const handleRemoveSummary = (indexToRemove) => {
    setSummaries(summaries.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className="container mx-auto my-6">
      <header className="border-b pb-6 mb-6 flex items-center justify-between">
        <div>
          <h6 className="flex items-center gap-x-2 text-xl font-bold">
            SUMMARY
            <span className="bg-yellow-500 rounded-md px-4 py-1 text-black">
              APP
            </span>
          </h6>
          <p className="text-base font-medium text-zinc-600 mt-2">
            Girdiğiniz metni özetleyen bir araç. Developed By Tunahan
            (Jagshem#1948)
          </p>
        </div>
      </header>
      <form
        onSubmit={submitHandle}
        className="flex gap-x-4 items-center justify-center"
      >
        <input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="OpenAI API Anahtarı"
          className="w-[400px] bg-zinc-100 outline-none focus:bg-zinc-300 p-4 rounded-md text-[15px] font-medium"
        />
        <textarea
          value={query}
          id="input-textarea"
          onChange={((e) => setQuery(e.target.value), handleTextAreaChange)}
          placeholder={loading ? 'Özetleniyor...' : 'Metni buraya yazınız...'}
          className="w-[400px] bg-zinc-100 outline-none focus:bg-zinc-300 p-4 rounded-md text-[15px] font-medium resize-none max-h-[225px] overflow-y-auto loading:cursor-pointer-events-none"
        />
        <button
          disabled={!query || loading}
          className="h-10 px-5 rounded-md bg-yellow-500 text-black font-bold hover:bg-yellow-400 disabled:bg-zinc-100 disabled:text-zinc-600 disabled:cursor-not-allowed"
        >
          {loading ? 'ÖZETLENİYOR...' : 'ÖZETLE'}
        </button>
        <button
          type="button"
          disabled={summaries.length === 0}
          onClick={handleClearSummaries}
          className="h-10 px-5 rounded-md bg-red-500 text-white font-bold hover:bg-red-400 disabled:bg-zinc-100 disabled:text-zinc-600 disabled:cursor-not-allowed"
        >
          TEMİZLE
        </button>
      </form>
      <div className="container mx-auto my-6">
        {/* header, form, and button code remains the same */}
        {summaries.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Özetler</h3>
            {summaries.map((item, index) => (
              <div className="flex mb-3" key={item.key}>
                <div className="w-1/2 p-4 bg-zinc-100 rounded-md mr-3">
                  <h4 className="text-lg font-bold mb-3">{item.name}</h4>
                  <p>{item.summary}</p>
                </div>
                <div className="w-1/2 p-4 bg-zinc-100 rounded-md ml-3">
                  <h4 className="text-lg font-bold mb-3">GİRDİĞİNİZ METİN</h4>
                  <p>{item.originalText}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSummary(index)}
                  className="h-10 px-4 ml-3 rounded-md bg-red-500 text-white font-bold hover:bg-red-400"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
