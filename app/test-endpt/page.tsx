import { Button } from '@/components/ui/button';
import { Sentry } from '@/lib/sentryLogger';

export default function SendRequest() {
    const sendRequest = async (formData: FormData) => {
        'use server'
        try {
            const response = await fetch(process.env.API_APPROVE_REQUEST_ENDPOINT!, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    imageUrl: "https://assets.dev.successacademy.et/0b027945-3f5b-4fb3-bed9-6901f2f83c54-img20251107184618541.jpg",
                    purchaseId: "1",
                    courseName: 'some course',
                    date: new Date().toLocaleString('en-US'),
                }),
            });
        } catch (error) {
            Sentry.captureException(error);
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
