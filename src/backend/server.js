const express = require('express')
const cors=require('cors')
const authRoutes = require('./authh');
require('dotenv').config();
const Note = require('./note');
const verifyToken = require('./Auth');
const connectDB = require('./db'); // Import the connectDB function


const app=express()
const PORT=5000

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes);
connectDB()

app.use('/', userRoutes);  // Instead of app.use('/api/users', userRoutes)

//routes
app.get('/notes',async(req,res)=>{
    const notes=await Note.find()
    res.json(notes)
})

app.post('/notes',async(req,res)=>{
    const newNote= new Note({
        title:req.body.title,
        content:req.body.content
    })
    await newNote.save()
    res.json(newNote)
})

// Edit Note Functionality
app.put('/notes/:id', async (req, res) => {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content
    }, { new: true }); // Return the updated document
    res.json(updatedNote);
  });  

app.put('/notes/:id/like',async(req,res)=>{
    const note=await Note.findByIdAndUpdate(req.params.id,{$inc:{ likes:1}},{new:true});
    res.json(note)
})

app.put('/notes/:id/unlike', async (req, res) => {
    const note = await Note.findById(req.params.id);
    note.likes -= 1; // Decrease the like count
    await note.save();
    res.json(note);
});

app.delete('/notes/:id',async(req,res)=>{
    await Note.findByIdAndDelete(req.params.id)
    res.json({message:'note deleted'})
})

app.get('/notes', verifyToken, async (req, res) => {
    const notes = await Note.find({ userId: req.userId }); // Example of using req.userId if notes are user-specific
    res.json(notes);
});

app.listen(PORT,()=>console.log('server is running'))