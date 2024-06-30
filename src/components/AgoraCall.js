"use client";

import AgoraRTC, {
  AgoraRTCProvider,
  useJoin,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import Navbar from '@/components/navbar';

function Call(props) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  return (
    <AgoraRTCProvider client={client}>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-grow p-4 space-y-4">
          <Audio channelName={props.channelName} AppID={props.appId} id={props.id} />
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
  const { AppID, channelName, id } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  usePublish([localMicrophoneTrack]);
  useJoin({
    appid: AppID,
    channel: channelName,
    token: null,
    uid: id,
  });

  audioTracks.map((track) => track.play());

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
            <div className="w-8 h-8 bg-blue-500 rounded-full mr-2"></div>
            <span>You</span>
          </li>
          {/* {
            remoteUsers.map((user) => {
              const userDetail = users.find((u) => u._id === user.uid);
              return (
                <li key={user.uid} className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full mr-2">
                    {
                      userDetail.profilePicture ? (
                        <img src={userDetail.profilePicture} alt={userDetail.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          {userDetail.username.charAt(0).toUpperCase()}
                        </div>
                      )
                    }
                  </div>
                  <span>User {user.uid}</span>
                </li>
              );
            })
          } */}
          {remoteUsers.map((user) => (
            <li key={user.uid} className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full mr-2"></div>
              <span>User {user.uid}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Call;