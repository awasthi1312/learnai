import { useRemoteUsers } from "agora-rtc-react";

// Function to add moderator bot to the participant list
export function getAllParticipants(remoteUsers) {
  const allParticipants = [
    ...remoteUsers,
    { uid: -12345678, username: "Moderator Bot", profilePicture: "https://img.freepik.com/free-vector/graident-ai-robot-vectorart_78370-4114.jpg?t=st=1724579769~exp=1724583369~hmac=231eb2df013c8c165597bf060e84e9d989b2e29a84307172786bc719b76f5e91&w=740" }
  ];
  return allParticipants;
}

// Export the addModeratorBot, transcribeAudio, and handleTranscription functions
export async function addModeratorBot(client, channelName, AppID) {
  if (!client) return;
  const botUID = -12345678;

  client.init(AppID, () => {
    client.join(null, channelName, botUID, (uid) => {
      console.log(`Bot joined with UID: ${uid}`);
    }, (err) => {
      console.error("Bot failed to join", err);
    });
  }, (err) => {
    console.error("Bot client initialization failed", err);
  });
}

export async function transcribeAudio(audioData) {
  try {
    const response = await axios.post('/api/transcribe', { audio: audioData });
    return response.data.transcription;
  } catch (error) {
    console.error('Transcription error:', error);
    return null;
  }
}

export function handleTranscription(transcription) {
  console.log('Transcription:', transcription);
  if (transcription.includes('mute')) {
    // Mute logic
    console.log('Mute logic triggered');
  } else if (transcription.includes('unmute')) {
    // Unmute logic
    console.log('Unmute logic triggered');
  }
}
