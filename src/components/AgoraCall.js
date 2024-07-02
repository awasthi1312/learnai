"use client";

import { useEffect } from "react";
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
  usePublish([localMicrophoneTrack]);
  useJoin({
    appid: AppID,
    channel: channelName,
    token: null,
    uid: id,
  });

  useEffect(() => {
    if (remoteUsers.length > 1) {
      addModeratorBot();
    }
  }, [remoteUsers]);

  function addModeratorBot() {
    const botUID = -12345678; // Unique ID for the bot
    useJoin({
      appid: AppID,
      channel: channelName,
      token: null,
      uid: botUID,
    });
    makeHost(botUID);
  }

  function makeHost(botUID) {
    client.setClientRole('host').then(() => {
      console.log(`Bot with UID ${botUID} is now the host`);
    }).catch(err => {
      console.error('Failed to set bot as host:', err);
    });
  }

  useEffect(() => {
    audioTracks.forEach((track) => {
      track.play();
      track.getAudioTrack().then(audioTrack => {
        analyzeAudio(audioTrack);
      });
    });
  }, [audioTracks]);

  function analyzeAudio(audioTrack) {
    const audioBlob = new Blob([audioTrack], { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');

    fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      handleTranscription(data.transcription);
    });
  }

  function handleTranscription(transcription) {
    remoteUsers.forEach(user => {
      if (transcription.includes('mute')) {
        client.muteRemoteAudio(user.uid).then(() => {
          console.log(`Muted user with UID ${user.uid}`);
        }).catch(err => {
          console.error(`Failed to mute user ${user.uid}:`, err);
        });
      } else if (transcription.includes('unmute')) {
        client.unmuteRemoteAudio(user.uid).then(() => {
          console.log(`Unmuted user with UID ${user.uid}`);
        }).catch(err => {
          console.error(`Failed to unmute user ${user.uid}:`, err);
        });
      }
    });
  }

  if (isLoadingMic)
    return (
      <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
        <h2 className="font-bold mb-2">Loading devices...</h2>
      </div>
    );

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
            remoteUsers.map((user) => {
              const userDetail = users.find((u) => u._id === user.uid);
              return (
                <li key={user.uid} className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full mr-2">
                    {
                      userDetail ? userDetail.profilePicture ? (
                        <img src={userDetail.profilePicture} alt={userDetail.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          {userDetail.username.charAt(0).toUpperCase()} Not found
                        </div>
                      ) : <div></div>
                    }
                  </div>
                  {userDetail ? <span>{userDetail.username}</span> : <span>User {user.uid}</span>}
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
