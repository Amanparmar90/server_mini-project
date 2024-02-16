import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from 'uuid';
import cookieParser from "cookie-parser";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cookieParser());

let data = [
  {
    "person1": {
      "id": uuidv4(),
      "name": "Aman",
      "age": 19,
      "email": "aman.doe@example.com"
    }
  },
  {
    "person2": {
      "id": uuidv4(),
      "name": "Nilesh",
      "age": 29,
      "email": "nilesh.doe@example.com"
    }
  }
];

// Middleware to customize headers
app.use((req, res, next) => {
  // Custom values for headers
  const customHost = 'iiitsurat.com';
  const customUserAgent = 'Aman Parmar';
  const customAccept = 'application/json';
  const customAcceptLanguage = 'en-US';
  const customAcceptEncoding = 'gzip, deflate';
  const customReferer = 'http://iiitsurat.com';
  const customConnection = 'keep-alive'; // or 'keep-alive' based on your preference
  const customUpgradeInsecureRequests = '1';
  const customIfModifiedSince = new Date();
  const customIfNoneMatch = 'W/"custom-etag"';
  const customCacheControl = 'no-cache';

  // Set custom headers
  res.setHeader('Host', customHost);
  res.setHeader('User-Agent', customUserAgent);
  res.setHeader('Accept', customAccept);
  res.setHeader('Accept-Language', customAcceptLanguage);
  res.setHeader('Accept-Encoding', customAcceptEncoding);
  res.setHeader('Referer', customReferer);
  res.setHeader('Connection', customConnection);
  res.setHeader('Upgrade-Insecure-Requests', customUpgradeInsecureRequests);
  res.setHeader('If-Modified-Since', customIfModifiedSince);
  res.setHeader('If-None-Match', customIfNoneMatch);
  res.setHeader('Cache-Control', customCacheControl);

  // Continue to the next middleware or route handler
  next();
});

app.get('/', async (req, res) => {
  try {
    const userIdFromCookie = req.cookies.getUserId;
    const cookiesId = userIdFromCookie || uuidv4();
    const twoDaysInSeconds = 2 * 24 * 60 * 60;
    res.cookie('getUserId', cookiesId, { maxAge: twoDaysInSeconds * 1000, httpOnly: true });
    res.status(200).send({ data, cookiesId });
    // console.log(req.headers);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/processing', (req, res) => {
  try {
    // Your processing logic here
    res.status(102).send('Processing Request');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUser = req.body;
    const index = data.findIndex((user) => user.id === id);

    if (index === -1) {
      res.status(404).send(`User with id ${id} not found.`);
      return;
    }
    console.log(index);
    console.log(`User data with id ${id}:`, data[index]); // Change 'user' to 'data[index]'
    res.status(200).send(data[index]);
    } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/', async (req, res) => {
  try {
    const user = req.body;
    // if (!user.name || !user.age || !user.email) {
    //   res.status(400).send('Bad Request: Missing required parameters.');
    //   return;
    // }
    const userId = uuidv4();
    const userWithID = { ...user, id: userId };
    const userIdFromCookie = req.cookies.postUserId;
    const oneDayInSeconds = 24 * 60 * 60;
    const postCookiesId = userIdFromCookie || uuidv4();
    res.cookie('postUserId', postCookiesId, { maxAge: oneDayInSeconds * 1000, httpOnly: true });
    data.push(userWithID);
    console.log(userWithID);
    res.status(201).send('User data pushed successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    data = data.filter((userData) => userData.id !== id);
    console.log(`User data with id ${id} deleted successfully.`);
    res.status(204).send(); // Use status code 204 and send an empty response body
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUser = req.body;
    const index = data.findIndex((user) => user.id === id);

    if (index === -1) {
      res.status(404).send(`User with id ${id} not found.`);
      return;
    }

    data[index] = { ...data[index], ...updatedUser };
    console.log(`User data with id ${id} updated successfully.`);
    res.status(200).send(`User data with id ${id} updated successfully.`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
