"use client";

import { useState, useEffect } from "react";
import AgoraRTC, { AgoraRTCProvider, useJoin, useLocalMicrophoneTrack, usePublish, useRTCClient, useRemoteAudioTracks, useRemoteUsers } from "agora-rtc-react";
import Navbar from '@/components/navbar';
import { useUsers } from "@/context/UsersContext";

function Call(props) {
  const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  return (
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
  );
}

function Audio(props) {
  const { AppID, channelName, id, client } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  const { users, currentUser } = useUsers();
  const [botJoined, setBotJoined] = useState(false);
  usePublish([localMicrophoneTrack]);
  useJoin({
    appid: AppID,
    channel: channelName,
    token: null,
    uid: id,
  });

  // Bot Client Initialization
  const botClient = AgoraRTC.createClient({ codec: "vp8", mode: "rtc" });

  // Add bot if more than one remote user
  if (remoteUsers.length > 1 && !botJoined) {
    addModeratorBot(botClient, channelName);
  }

  function addModeratorBot(client, channelName) {
    const botUID = -12345678; // Unique ID for the bot
    console.log("Attempting to add moderator bot...");
    client.init(AppID, () => {
      client.join(null, channelName, botUID, (uid) => {
        console.log(`Bot joined with UID: ${uid}`);
        setBotJoined(true);
      }, (err) => {
        console.error("Bot failed to join", err);
      });
    }, (err) => {
      console.error("Bot client initialization failed", err);
    });
  }

  // Process audio tracks for moderation
  audioTracks.forEach(track => {
    const mediaStreamTrack = track.getMediaStreamTrack();
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(new MediaStream([mediaStreamTrack]));
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (audioProcessingEvent) => {
      const inputBuffer = audioProcessingEvent.inputBuffer;
      const inputData = inputBuffer.getChannelData(0);

      // Perform audio processing for moderation
      console.log('Audio data:', inputData);
    };
  });

  if (isLoadingMic)
    return (
      <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
        <h2 className="font-bold mb-2">Loading devices...</h2>
      </div>
    );

  const allParticipants = [
    ...remoteUsers,
    botJoined ? { uid: -12345678, username: "Moderator Bot", profilePicture: "bot-profile-pic-url" } : null
  ].filter(Boolean); // Filter out null values

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
                          {userDetail.username.charAt(0).toUpperCase()} Not found
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
