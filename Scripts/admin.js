const local = location.hostname == 'localhost' || location.hostname == '127.0.0.1';
const server = local ? "http://localhost:3000" : "https://solalabs-server.onrender.com";

document.addEventListener('DOMContentLoaded', () => 
{
    console.log("Client login service loaded.");
    
    const form = document.getElementById('admin');
    const status = document.getElementById('status');
    if (!form || !status) 
    {
        console.error('Login form not found!');
        return;
    }

    const control = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (event) => 
    {
        console.log("Client login request submitted!");

        control.disabled = true;
        event.preventDefault();

        const data = new FormData(form);
        const key = data.get('key');

        if (key == undefined || key == '') 
        {
            display("Invalid key!", "error");
            return;
        }
        console.log("Client sent data:", key);
        try 
        {
            const action = form.getAttribute("action");
            const response = await fetch(`${server}${action}`, 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: key })
            });
            const result = await response.json();
            console.log("Client recieved response:", result);
            if (response.ok) 
            {
                display(result.message || "Login successful!", "success");
                form.reset();
            } 
            else 
            {
                display(result.error || "Login failed.", "error");
            }
        }
        catch (error) 
        {
            console.error("Error sending request:", error);
            display("Unable to login. Please try again later.", "error");
            return;
        }
        finally 
        {
            control.disabled = false;
        }
    });
    async function clear() 
    {
        const token = localStorage.getItem('token');
        const result = await fetch(`${server}/${form.action}`, 
        {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (result.ok) 
        {
            const blob = await result.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } else 
        {
            alert("Unauthorized or session expired");
        }
    }
    async function downalod() 
    {
        const token = localStorage.getItem('token');
        const result = await fetch(`${server}${form.action}`, 
        {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (result.ok) 
        {
            const blob = await result.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } else 
        {
            alert("Unauthorized or session expired");
        }
    }
    function display(response, type) 
    {
        console.log("Client recieved message:", response, type);
        status.textContent = response;
        status.className = type;
    }
});