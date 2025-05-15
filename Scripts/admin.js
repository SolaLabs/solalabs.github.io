const server = "https://solalabs-server.onrender.com";

document.addEventListener('DOMContentLoaded', () => 
{
    console.log("Client login service loaded.");

    const form = document.getElementById('admin');
    const status = document.getElementById('status');
    if (!form || !status) 
    {
        console.error('Form or status element not found');
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

        try 
        {
            console.log("Client form data:", address);
            const response = await fetch(`${server}/admin/authorize`, 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: key })
            });
            const result = await response.json();
            console.log("Client form response:", result);
            if (response.ok) 
            {
                display(authorization.message || "Login successful!", "success");
                form.reset();
            } 
            else 
            {
                display(result.error || "Login failed.", "error");
            }
        } 
        catch (error) 
        {
            display("An unexpected error occurred. Please try again later.", "error");
        }
        finally 
        {
            control.disabled = false;
        }
    });
    function display(response, type) 
    {
        console.log("Client form message:", response, type);
        status.textContent = response;
        status.className = type;
    }
    async function clear() 
    {
        const token = localStorage.getItem('token');
        const result = await fetch(`${server}/admin/clear`, 
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
        const result = await fetch(`${server}/admin/download`, 
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
});