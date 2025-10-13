import { HttpResponse, http } from 'msw'

export const handlers = [
  // Mock textbooks API
  http.get('/api/textbooks', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Textbook',
        jlptLevel: 'N5',
        sswType: 'SSW1',
        totalChapters: 10,
      },
    ])
  }),

  // Mock textbook generation
  http.post('/api/textbooks/generate-ssw', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      id: 'generated-123',
      ...body,
      status: 'generating',
    })
  }),

  // Mock audio generation
  http.post('/api/audio/generate', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      success: true,
      audioUrl: 'https://example.com/audio.mp3',
      ...body,
    })
  }),

  // Mock kanji stroke order
  http.get('/api/kanji/stroke-order/:kanji', ({ params }) => {
    return HttpResponse.json({
      kanji: params.kanji,
      totalStrokes: 4,
      strokeData: [],
      writingTips: 'Write from top to bottom',
    })
  }),
]
