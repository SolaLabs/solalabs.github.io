console.log("Server loaded!");
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const output = path.join(__dirname, 'subscribers.csv');

app.use(express.json());
app.use(express.static('Public'));
app.use((request, result) => {
    result.status(404).sendFile(path.join(__dirname, 'Public', '404.html'));
});

app.post('/subscribe', (request, result) =>
{
    console.log("Server form recieved!");
    console.log(request.body);
    let address = request.body.address;
    if (address == undefined || address == '') 
    {
        console.error("Invalid email address:", address);
        return result.status(400).json({ error: "Invalid email address!" });
    }
    try 
    {
        subscribers = fs.readFileSync(output, 'utf8').split(',').filter(line => line.trim() !== '') || [];
        console.log("Subscribers:", subscribers);
    }
    catch (error) 
    {
        console.error("Failed to read subscriber file:", error);
    }
    if (subscribers.includes(address)) 
    {
        console.error("Email address already subscribed:", address);
        return result.status(400).json({ error: "Email address already subscribed!" });
    }
    else 
    {
        const line = address + ",";
        fs.appendFile(output, line, error => 
        {
            if (error) 
            {
                console.error("Failed to store subscriber information:", error);
                return result.status(500).json({ error: "Internal server error!" });
            }
            console.log("Subscriber information stored successfully!");
            return result.status(200).json({ message: "Subscription successful!" });
        });
    }
});

app.listen(port, () => 
{
    console.log(`Server running on http://localhost:${port}`);
});