const local = location.hostname == 'localhost' || location.hostname == '127.0.0.1';
const server = local ? "http://localhost:3000" : "https://solalabs-server.onrender.com";

document.addEventListener('DOMContentLoaded', () => 
{
    console.log("Client subscription service loaded");
    
    const form = document.getElementById('subscribe');
    const status = document.getElementById('status');
    if (!form || !status) 
    {
        console.error('Subscription form not found!');
        return;
    }

    const control = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (event) => 
    {
        console.log("Client subscription request submitted!");

        control.disabled = true;
        event.preventDefault();

        const data = new FormData(form);
        const address = data.get('address');

        if (!validate(address)) 
        {
            display("Please enter a valid email address.", "error");
            return;
        }
        console.log("Client sent data:", address);
        try 
        {
            const action = form.getAttribute("action");
            const response = await fetch(`${server}${action}`, 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: address })
            });
            const result = await response.json();
            console.log("Client recieved response:", result);
            if (response.ok) 
            {
                display(result.message || "Thank you for your subscription!", "success");
                form.reset();
            } 
            else 
            {
                display(result.error || "Subscription failed. Please try again later.", "error");
            }
        }
        catch (error) 
        {
            console.error("Error sending request:", error);
            display(error || "Unable to subscribe. Please try again later.", "error");
            return;
        }
        finally 
        {
            control.disabled = false;
        }
    });
    function validate(email) 
    {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function display(response, type) 
    {
        console.log("Client recieved message:", response, type);
        status.textContent = response;
        status.className = type;
    }
});