const https = require('https')

async function testVideoUrl() {
  const videoUrl = 'https://medias.cornosbrasilvip.com/free/02/video_6108.mp4'
  
  console.log('🔍 Testando URL do vídeo:', videoUrl)
  
  return new Promise((resolve, reject) => {
    const req = https.request(videoUrl, { method: 'HEAD' }, (res) => {
      console.log('📊 Status Code:', res.statusCode)
      console.log('📊 Headers:', {
        'content-type': res.headers['content-type'],
        'content-length': res.headers['content-length'],
        'access-control-allow-origin': res.headers['access-control-allow-origin'],
        'access-control-allow-methods': res.headers['access-control-allow-methods'],
        'access-control-allow-headers': res.headers['access-control-allow-headers']
      })
      
      if (res.statusCode === 200) {
        console.log('✅ URL do vídeo está acessível!')
        resolve(true)
      } else {
        console.log('❌ URL do vídeo retornou status:', res.statusCode)
        resolve(false)
      }
    })
    
    req.on('error', (error) => {
      console.error('❌ Erro ao testar URL:', error.message)
      resolve(false)
    })
    
    req.setTimeout(10000, () => {
      console.log('⏰ Timeout ao testar URL')
      req.destroy()
      resolve(false)
    })
    
    req.end()
  })
}

testVideoUrl() 