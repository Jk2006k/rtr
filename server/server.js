import express from 'express'
import cors from 'cors'
import routes from "./routes/routes.js"
import converRoute from "./routes/convertRoute.js"
const app =express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

app.use('/upload', routes)
app.use('/convert', converRoute)

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT : ${PORT}`);
})
