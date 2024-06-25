'use client'
import { useRouter } from 'next/router';
import Call from "@/components/AgoraCall";

export default function ChannelPage() {
    const router = useRouter();
    const { channelName } = router.query;
    console.log(channelName);

    return (
        <main className="flex w-full flex-col">
            <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
                {channelName}
            </p>
            <Call appId={process.env.NEXT_PUBLIC_AGORA_APP_ID} channelName={"1234"}></Call>
        </main>
    );
}