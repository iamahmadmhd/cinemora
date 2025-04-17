import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { Button } from '@heroui/button';
import { signout } from '@/app/actions';

export default async function PrivatePage() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select()
        .eq('user_id', data.user.id);

    console.log({ profile });

    return (
        <>
            <p>Hello {data.user.email}</p>
            <Button onPress={signout}>Logout</Button>
        </>
    );
}
