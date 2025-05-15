const server = "https://solalabs-server.onrender.com";

document.addEventListener('DOMContentLoaded', () => 
{
    const form = document.getElementById('login');
    const status = document.getElementById('status');
    console.log(status.textContent)
    if (!form || !status) 
    {
        console.error('Form or message element not found');
        return;
    }

    const control = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (event) => 
    {
        control.disabled = true;
        event.preventDefault();

        const data = new FormData(form);
        const address = data.get('key');

        const result = await fetch(`${server}/admin/auth`, 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: key })
        });

        const authorization = await result.json();
        if (result.ok) 
        {
            display(authorization.message || "Login successful!", "success");
            localStorage.setItem('token', data.token);
        } else 
        {
            display(authorization.error || "Login failed.", "error");
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