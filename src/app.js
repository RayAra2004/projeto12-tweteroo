import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const usuarios = [];
const tweets = [];

app.post("/sign-up", (req, res) =>{
    const {username, avatar} = req.body;
    const novoUsuario = {username, avatar};

    usuarios.push(novoUsuario);
    res.send("OK");
})

app.post("/tweets", (req, res) =>{
    const {username, tweet} = req.body;

    const userExiste = usuarios.find(user => user.username === username);

    if(userExiste){
        const novoTweet = {username, tweet};
        tweets.push(novoTweet);
        return res.send("OK");
    }else{
        res.send("UNAUTHORIZED");
    }
})

app.get("/tweets", (req, res) =>{
    let ultimosTweets = tweets.slice(-10);
    ultimosTweets = ultimosTweets.reverse();
    const tweetsResposta = [];
    ultimosTweets.forEach(tweet => {
        const avatar = usuarios.find(user => user.username === tweet.username).avatar;
        const username = tweet.username;
        const tweetRes = tweet.tweet;
        const resposta = {username, avatar, tweetRes};
        tweetsResposta.push(resposta);
    })

    res.send(tweetsResposta);
})

app.get("/users", (req, res) =>{
    res.send(usuarios);
})

app.listen(5000, () => console.log("Servidor ligado"))