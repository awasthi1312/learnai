import { useRouter } from 'next/router';
import Call from "@/components/AgoraCall";
export default function ChannelPage() {
    const router = useRouter();
    const { channelId } = router.query;
    const id = router.query.id || "Anonymous";
    console.log(channelId);

    return (
        <main className="flex w-full flex-col">
            <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
                {channelId}
            </p>
            <Call appId={process.env.NEXT_PUBLIC_AGORA_APP_ID} channelName={channelId} id={id}></Call>
        </main>
    );
}