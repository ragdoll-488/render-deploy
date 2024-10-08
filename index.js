
import express from "express";
import cors from "cors";
import Note from "./models/note.js";

const app = express()
const PORT = process.env.PORT || 3001   // process.env.PORT will get port from running machine(server or local). We do not hardcoded in .env file.

/*
let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
*/
/*
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)
*/

app.use(express.json())
app.use(express.static('dist'))
app.use(cors()); 

//This "/" endpoint no longer used due to express.static will pointed to static file in "dist" folder for "root" endpoint.
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
/*
app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)

    if (note) {    
        response.json(note)  
    } 
    else {    
        // response.status(404).end(`No resource founded on ${request.params.id}`)  
        response.status(404).end()      // REST APIs are interfaces that are intended for programmatic use, and the error status code is all that is needed.  
    }
})
*/
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})
/*
const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {  

    // const note = request.body  
    // console.log(request.headers)
    // console.log(note)  

    const body = request.body
    if (!body.content) {
        return response.status(400).json({ error: 'content missing' })
    }
    
    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId(),
    }
    
    notes = notes.concat(note)
    response.json(note)
})
*/
app.post('/api/notes', (request, response) => {

  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

// This middleware handle all requests that are not handle by app routes.
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })

// npm run dev
// Unlike with the start and test scripts, we also have to add "run" to the command because it is a non-native script. 
// Me: we did not regist them to OS(installed) just like node and bash interpreter.
