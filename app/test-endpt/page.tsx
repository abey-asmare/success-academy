import { Button } from '@/components/ui/button';

export default function SendRequest() {
    const sendRequest = async (formData: FormData) => {
        'use server'
        try {
            console.log(process.env.API_APPROVE_REQUEST_ENDPOINT);
            const response = await fetch(process.env.API_APPROVE_REQUEST_ENDPOINT!, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    imageUrl: "https://d46msoxdbl.ufs.sh/f/cYFF9DOgoq3QOsglWrJpXIvT43zDus2b1wftkgV60iEjLKyA",
                    purchaseId: "1",
                    courseName: 'some course',
                    date: new Date().toLocaleString('en-US'),
                }),
            });
            console.log(await response.json());
        } catch (error) {
            console.error(error);
        }
    }
    
  return (
    <div>
<form action={sendRequest}>
<Button type="submit">Send Request</Button> 
</form>
    </div>
  )
}
