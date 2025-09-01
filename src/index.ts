import express from "express"
import dotenv from "dotenv"
import blog from "./routes/blog"
import { Appsource } from "./config/data-source"

dotenv.config({path:"src/config/.env"})

const app = express()
const PORT = 3000

app.use(express.json())

// Initailize db
Appsource.initialize()
.then(()=>{
    console.log("Data source has been initialized")
})


app.use("/api/v1/blog",blog)

app.listen(PORT,()=>{
    console.log(`Server is running on ${process.env.PORT}`)
})