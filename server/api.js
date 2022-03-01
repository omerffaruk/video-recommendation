import { Router } from "express";
import pool from "./utils/pool";

const router = Router();

router.get("/", (req, res) => {
  const query = 'SELECT * FROM videos';
  pool.query(query, (error, result) => {
    if(error) {
      console.log(error);
      return res.send(error);
    } else {
      res.json(result.rows);
    }
  })
});

// POST "/"
router.post('/', (req, res) => {
  const { title, url} = req.body;
  const newVideo = {
    "title": title,
    "url": url,
    "rating": 0
  }
  if(!title || !url) {
    return res.status(400).send({
  "result": "failure",
  "message": "Video could not be saved"
})
  } else {
    pool.query('SELECT * FROM videos WHERE title=$1 AND url=$2', [title, url])
    .then((result) => {
      if(result.rows.length > 0) {
        return res.status(400).send(`This video with the title of ${title} and url of ${url} is already in videos.`)
      } else {
        pool.query('INSERT INTO videos (title, url, rating) VALUES ($1, $2, 0)', [title, url])
        .then(() => res.status(202).send(`The video has been added to the videos.`));
      }
    })
  }
}) 

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM videos WHERE id=$1';
  pool.query(query, [id])
  .then((result) => {
    if(result.rows.length === 0) {
      res.status(400).send(`There is no video with the id of ${id}`);
    } else {
      res.status(200).send(result.rows);
    }
  })
})

export default router;
