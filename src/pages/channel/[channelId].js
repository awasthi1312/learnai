import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Call = dynamic(() => import('@/components/AgoraCall'), { ssr: false });

export default function ChannelPage() {
    const router = useRouter();
    const { channelId } = router.query;
    const id = router.query.id || "Anonymous";

    return (
        <main className="flex w-full flex-col">
            <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
                {channelId}
            </p>
            {channelId && (
                <Call appId={process.env.NEXT_PUBLIC_AGORA_APP_ID} channelName={channelId} id={id} />
            )}
        </main>
    );
}
