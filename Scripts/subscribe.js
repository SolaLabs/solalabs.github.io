document.addEventListener('DOMContentLoaded', () => 
{
    console.log("Client loaded");
    const form = document.getElementById('subscription');
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
        console.log("Client form submitted!");
        event.preventDefault();

        const data = new FormData(form);
        const address = data.get('address');

        if (!validate(address)) 
        {
            display("Please enter a valid email address.", "error");
            return;
        }
        try 
        {
            console.log("Client form data:", address);
            const response = await fetch(form.action, 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: address })
            });
            const result = await response.json();
            console.log("Client form response:", result);
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
            display("An unexpected error occurred. Please try again later.", "error");
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
        console.log("Client form message:", response, type);
        status.textContent = response;
        status.className = type;
    }
});