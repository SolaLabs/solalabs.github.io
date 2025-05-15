document.addEventListener('DOMContentLoaded', () => 
{
    console.log("Client subscription service loaded");
    const form = document.getElementById('subscribe');
    const status = document.getElementById('status');
    if (!form || !status) 
    {
        console.error('Form or status element not found');
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
        try 
        {
            console.log("Client sent data:", address);
            const response = await fetch(form.action, 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: address })
            });
            const result = await response.json();
            console.log("Client recieved response:", result);
            if (response.ok) 
            {
                display("Thank you for your subscription!", "success");
                form.reset();
            } 
            else 
            {
                display(result.error || "Subscription failed. Please try again later.", "error");
            }
        } 
        catch (error) 
        {
            display(error.Message || "An unexpected error occured. Please try again later.", "error");
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