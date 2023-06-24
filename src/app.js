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

    if(typeof(username) !== 'string' || typeof(avatar) !== 'string' || !avatar || !username){
        return res.status(400).send("Todos os campos são obrigatórios!")
    }

    usuarios.push(novoUsuario);
    res.status(201).send("OK");
})

app.post("/tweets", (req, res) =>{
    const {tweet} = req.body;
    const {user} = req.headers;

    if(typeof(user) !== 'string' || typeof(tweet) !== 'string' || !tweet || !user){
        return res.status(400).send("Todos os campos são obrigatórios!")
    }

    const userExiste = usuarios.find(userF => userF.username === user);

    if(userExiste){
        const username = user;
        const novoTweet = {username, tweet};
        tweets.push(novoTweet);
        return res.status(201).send("OK");
    }else{
        res.status(401).send("UNAUTHORIZED");
    }
})

app.get("/t", (req, res) =>{
    res.send(tweets)
})

app.get("/tweets", (req, res) =>{

    let {page} = req.query;
    if(page < 1){return res.status(400).send("Informe uma página válida!")}
    if(page === undefined){page = 1}
    let ultimosTweets = [...tweets].reverse();
        ultimosTweets = ultimosTweets.slice((Number(page) - 1) * 10, Number(page) * 10);
        const tweetsResposta = [];
        ultimosTweets.forEach(t => {
            const avatar = usuarios.find(user => user.username === t.username).avatar;
            const username = t.username;
            const tweet = t.tweet;
            const resposta = {username, avatar, tweet};
            tweetsResposta.push(resposta);
        })

        res.send(tweetsResposta);
})

app.get("/tweets/:USERNAME", (req, res) =>{
    const {USERNAME} = req.params;
    const tweetsUser = tweets.filter(t => t.username === USERNAME);

    const tweetsResposta = [];
    tweetsUser.forEach(t => {
        const avatar = usuarios.find(user => user.username === t.username).avatar;
        const username = t.username;
        const tweet = t.tweet;
        const resposta = {username, avatar, tweet};
        tweetsResposta.push(resposta);
    })

    res.send(tweetsResposta);
})

app.get("/users", (req, res) =>{
    res.send(usuarios);
})

app.listen(5000, () => console.log("Servidor ligado"))