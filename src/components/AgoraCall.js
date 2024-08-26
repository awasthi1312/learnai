"use client";

import { useEffect } from "react";
import dynamic from 'next/dynamic';
import Navbar from '@/components/navbar';
import { useUsers } from "@/context/UsersContext";
import { addModeratorBot, transcribeAudio, handleTranscription, getAllParticipants } from '@/components/bot';
import AgoraRTC, {
  AgoraRTCProvider,
  useJoin,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";

function Call(props) {
  const client = typeof window !== 'undefined' ? useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  ) : null;

  return (
    client ? (
      <AgoraRTCProvider client={client}>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Navbar />
          <main className="flex-grow p-4 space-y-4">
            <Audio channelName={props.channelName} AppID={props.appId} id={props.id} client={client} />
          </main>
          <nav className="bg-white p-4">
            <ul className="flex justify-around">
              <li className="flex flex-col items-center">
                <a className="px-5 py-3 text-base font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:ring-red-300 w-40" href="/home">
                  End Call
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </AgoraRTCProvider>
    ) : null
  );
}

function Audio(props) {
  const { AppID, channelName, id, client } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  const { users, currentUser } = useUsers();
  usePublish([localMicrophoneTrack]);
  useJoin({
    appid: AppID,
    channel: channelName,
    token: null,
    uid: id,
  });

  useEffect(() => {
    if (remoteUsers.length > 1) {
      addModeratorBot(client, channelName, AppID);
    }
  }, [remoteUsers]);

  useEffect(() => {
    if (typeof window !== 'undefined') { 
      audioTracks.forEach(track => {
        const mediaStreamTrack = track.getMediaStreamTrack();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(new MediaStream([mediaStreamTrack]));
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = async (audioProcessingEvent) => {
          const inputBuffer = audioProcessingEvent.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);

          const transcription = await transcribeAudio(inputData);
          if (transcription) {
            handleTranscription(transcription);
          }
        };
      });
    }
  }, [audioTracks]);

  if (isLoadingMic)
    return (
      <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
        <h2 className="font-bold mb-2">Loading devices...</h2>
      </div>
    );

  const allParticipants = getAllParticipants(remoteUsers);

  return (
    <div className="space-y-4">
      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-bold mb-2">Audio Call</h2>
        <p>Your microphone is {localMicrophoneTrack ? 'active' : 'inactive'}</p>
      </section>

      <section className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold mb-2">Participants:</h3>
        <ul className="space-y-2">
          <li className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full mr-2">
              <img src={currentUser.profilePicture} alt={currentUser.username} className="w-full h-full object-cover" />
            </div>
            <span>You</span>
          </li>
          {
            allParticipants.map((user) => {
              const userDetail = users.find((u) => u._id === user.uid) || user;
              return (
                <li key={user.uid} className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full mr-2">
                    {
                      userDetail.profilePicture ? (
                        <img src={userDetail.profilePicture} alt={userDetail.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          {userDetail.username && userDetail.username.charAt(0).toUpperCase()} Not found
                        </div>
                      )
                    }
                  </div>
                  <span>{userDetail.username}</span>
                </li>
              );
            })
          }
        </ul>
      </section>
    </div>
  );
}

export default Call;
