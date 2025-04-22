import { Button } from '@heroui/button';
import { signout } from '@/app/actions';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <>
            <p>Hello {user?.email}</p>
            <Button onPress={signout}>Logout</Button>
        </>
    );
}
